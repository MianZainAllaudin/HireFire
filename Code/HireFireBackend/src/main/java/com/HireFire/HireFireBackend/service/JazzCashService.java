package com.HireFire.HireFireBackend.service;

import com.HireFire.HireFireBackend.config.JazzCashConfig;
import com.HireFire.HireFireBackend.dto.JazzCashCallbackRequest;
import com.HireFire.HireFireBackend.dto.JazzCashRequestDTO;
import com.HireFire.HireFireBackend.dto.PaymentResponse;
import com.HireFire.HireFireBackend.exception.PaymentException;
import com.HireFire.HireFireBackend.model.Payment;
import com.HireFire.HireFireBackend.model.PaymentStatus;
import com.HireFire.HireFireBackend.repository.PaymentRepository;
import com.HireFire.HireFireBackend.util.HashUtils;
import com.HireFire.HireFireBackend.util.JazzCashConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class JazzCashService {
    private static final Logger logger = LoggerFactory.getLogger(JazzCashService.class);

    private final RestTemplate restTemplate;
    private final JazzCashConfig jazzCashConfig;
    private final HashUtils hashUtils;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Autowired
    public JazzCashService(
            RestTemplate restTemplate,
            JazzCashConfig jazzCashConfig,
            HashUtils hashUtils,
            PaymentRepository paymentRepository,
            NotificationService notificationService) {
        this.restTemplate = restTemplate;
        this.jazzCashConfig = jazzCashConfig;
        this.hashUtils = hashUtils;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    public String initiatePayment(Payment payment) {
        try {
            JazzCashRequestDTO requestDTO = prepareJazzCashRequest(payment);
            String redirectUrl = createRedirectUrl(requestDTO);

            // Save transaction reference to payment
            payment.setTransactionId(requestDTO.getPp_TxnRefNo());
            paymentRepository.save(payment);

            logger.info("JazzCash payment initiated with reference: {}, txnRefNo: {}",
                    payment.getPaymentReference(), requestDTO.getPp_TxnRefNo());

            return redirectUrl;
        } catch (Exception e) {
            logger.error("Error initiating JazzCash payment", e);
            throw new PaymentException("Failed to initiate JazzCash payment: " + e.getMessage(), e);
        }
    }

    private JazzCashRequestDTO prepareJazzCashRequest(Payment payment) {
        JazzCashRequestDTO requestDTO = new JazzCashRequestDTO();

        // Generate unique transaction reference number
        String txnRefNo = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Format amount to PKR without decimals (e.g., 100.50 -> 10050)
        String amount = payment.getAmount().multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.HALF_UP).toString();

        String txnDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        requestDTO.setPp_Version(JazzCashConstants.VERSION);
        requestDTO.setPp_TxnType(JazzCashConstants.TXN_TYPE);
        requestDTO.setPp_Language(JazzCashConstants.LANGUAGE);
        requestDTO.setPp_MerchantID(jazzCashConfig.getMerchantId());
        requestDTO.setPp_Password(jazzCashConfig.getPassword());
        requestDTO.setPp_TxnRefNo(txnRefNo);
        requestDTO.setPp_Amount(amount);
        requestDTO.setPp_TxnCurrency(JazzCashConstants.CURRENCY);
        requestDTO.setPp_TxnDateTime(txnDateTime);
        requestDTO.setPp_BillReference(payment.getPaymentReference());
        requestDTO.setPp_Description("Payment for " + payment.getWorker().getSpecialization() + " service");
        requestDTO.setPp_ReturnURL(jazzCashConfig.getReturnUrl());

        // Optional fields
        requestDTO.setPpmpf_1(payment.getUser().getName());
        requestDTO.setPpmpf_2(payment.getUser().getMobileNumber());
        requestDTO.setPpmpf_3(payment.getWorker().getName());
        requestDTO.setPpmpf_4(payment.getUser().getEmail());
        requestDTO.setPpmpf_5("HireFire-" + payment.getId());

        // Generate secure hash
        String secureHash = generateSecureHash(requestDTO);
        requestDTO.setPp_SecureHash(secureHash);

        return requestDTO;
    }

    private String generateSecureHash(JazzCashRequestDTO requestDTO) {
        StringBuilder hashString = new StringBuilder();
        hashString.append(requestDTO.getPp_Amount())
                .append("&").append(requestDTO.getPp_BillReference())
                .append("&").append(requestDTO.getPp_Description())
                .append("&").append(requestDTO.getPp_Language())
                .append("&").append(requestDTO.getPp_MerchantID())
                .append("&").append(requestDTO.getPp_Password())
                .append("&").append(requestDTO.getPp_ReturnURL())
                .append("&").append(requestDTO.getPp_TxnCurrency())
                .append("&").append(requestDTO.getPp_TxnDateTime())
                .append("&").append(requestDTO.getPp_TxnRefNo())
                .append("&").append(requestDTO.getPp_TxnType())
                .append("&").append(requestDTO.getPp_Version());

        return hashUtils.generateSecureHash(hashString.toString(), jazzCashConfig.getHashKey());
    }

    private String createRedirectUrl(JazzCashRequestDTO requestDTO) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("pp_Version", requestDTO.getPp_Version());
        map.add("pp_TxnType", requestDTO.getPp_TxnType());
        map.add("pp_Language", requestDTO.getPp_Language());
        map.add("pp_MerchantID", requestDTO.getPp_MerchantID());
        map.add("pp_Password", requestDTO.getPp_Password());
        map.add("pp_TxnRefNo", requestDTO.getPp_TxnRefNo());
        map.add("pp_Amount", requestDTO.getPp_Amount());
        map.add("pp_TxnCurrency", requestDTO.getPp_TxnCurrency());
        map.add("pp_TxnDateTime", requestDTO.getPp_TxnDateTime());
        map.add("pp_BillReference", requestDTO.getPp_BillReference());
        map.add("pp_Description", requestDTO.getPp_Description());
        map.add("pp_ReturnURL", requestDTO.getPp_ReturnURL());
        map.add("pp_SecureHash", requestDTO.getPp_SecureHash());
        map.add("ppmpf_1", requestDTO.getPpmpf_1());
        map.add("ppmpf_2", requestDTO.getPpmpf_2());
        map.add("ppmpf_3", requestDTO.getPpmpf_3());
        map.add("ppmpf_4", requestDTO.getPpmpf_4());
        map.add("ppmpf_5", requestDTO.getPpmpf_5());

        return jazzCashConfig.getApiUrl() + "?" + mapToQueryString(map);
    }

    private String mapToQueryString(MultiValueMap<String, String> map) {
        StringBuilder queryString = new StringBuilder();
        map.forEach((key, values) -> {
            values.forEach(value -> {
                if (queryString.length() > 0) {
                    queryString.append("&");
                }
                queryString.append(key).append("=").append(value);
            });
        });
        return queryString.toString();
    }

    public boolean verifyCallbackHash(JazzCashCallbackRequest callbackRequest) {
        try {
            Map<String, String> params = callbackRequest.getParameters();
            String receivedHash = params.get("pp_SecureHash");

            if (receivedHash == null) {
                logger.error("No secure hash in callback");
                return false;
            }

            StringBuilder hashString = new StringBuilder();
            hashString.append(params.get("pp_Amount"))
                    .append("&").append(params.get("pp_BillReference"))
                    .append("&").append(params.get("pp_Language"))
                    .append("&").append(params.get("pp_MerchantID"))
                    .append("&").append(params.get("pp_ResponseCode"))
                    .append("&").append(params.get("pp_ResponseMessage"))
                    .append("&").append(params.get("pp_RetreivalReferenceNo"))
                    .append("&").append(params.get("pp_TxnCurrency"))
                    .append("&").append(params.get("pp_TxnDateTime"))
                    .append("&").append(params.get("pp_TxnRefNo"))
                    .append("&").append(params.get("pp_TxnType"));

            String calculatedHash = hashUtils.generateSecureHash(hashString.toString(), jazzCashConfig.getHashKey());
            boolean isValid = calculatedHash.equals(receivedHash);

            if (!isValid) {
                logger.warn("Hash verification failed for transaction: {}", params.get("pp_TxnRefNo"));
            }

            return isValid;
        } catch (Exception e) {
            logger.error("Error during hash verification", e);
            return false;
        }
    }

    public boolean verifyPayment(JazzCashCallbackRequest callbackRequest) {
        String responseCode = callbackRequest.getParameter("pp_ResponseCode");
        String responseMessage = callbackRequest.getParameter("pp_ResponseMessage");
        String txnRefNo = callbackRequest.getParameter("pp_TxnRefNo");

        logger.info("Received JazzCash callback: txnRefNo={}, responseCode={}, message={}",
                txnRefNo, responseCode, responseMessage);

        if (!verifyCallbackHash(callbackRequest)) {
            logger.error("Hash verification failed for callback");
            return false;
        }

        return JazzCashConstants.RESPONSE_CODE_SUCCESS.equals(responseCode);
    }

    public PaymentResponse processPaymentCallback(JazzCashCallbackRequest callbackRequest) {
        String billReference = callbackRequest.getParameter("pp_BillReference");
        String responseCode = callbackRequest.getParameter("pp_ResponseCode");
        String responseMessage = callbackRequest.getParameter("pp_ResponseMessage");
        String txnRefNo = callbackRequest.getParameter("pp_TxnRefNo");

        Payment payment = paymentRepository.findByPaymentReference(billReference)
                .orElseThrow(() -> {
                    logger.error("Payment not found for reference: {}", billReference);
                    return new PaymentException("Payment not found for reference: " + billReference);
                });

        PaymentResponse response = new PaymentResponse();
        response.setPaymentReference(billReference);
        response.setAmount(payment.getAmount());

        if (JazzCashConstants.RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setCompletedAt(LocalDateTime.now());
            payment.setTransactionId(txnRefNo);
            payment.setPpResponseCode(responseCode);
            payment.setPpResponseMessage(responseMessage);
            payment.setPpBillReference(billReference);

            paymentRepository.save(payment);
            notifyWorker(payment);

            response.setStatus(PaymentStatus.COMPLETED);
            response.setMessage("Payment completed successfully");
        } else if (JazzCashConstants.RESPONSE_CODE_PENDING.equals(responseCode)) {
            payment.setStatus(PaymentStatus.PROCESSING);
            payment.setPpResponseCode(responseCode);
            payment.setPpResponseMessage(responseMessage);
            paymentRepository.save(payment);

            response.setStatus(PaymentStatus.PROCESSING);
            response.setMessage("Payment is being processed");
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setPpResponseCode(responseCode);
            payment.setPpResponseMessage(responseMessage);
            paymentRepository.save(payment);

            response.setStatus(PaymentStatus.FAILED);
            response.setMessage("Payment failed: " + responseMessage);
        }

        return response;
    }

    public PaymentResponse checkPaymentStatus(String paymentReference) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new PaymentException("Payment not found for reference: " + paymentReference));

        PaymentResponse response = new PaymentResponse();
        response.setPaymentReference(payment.getPaymentReference());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());

        switch (payment.getStatus()) {
            case COMPLETED:
                response.setMessage("Payment has been completed successfully");
                break;
            case PROCESSING:
                response.setMessage("Payment is being processed");
                break;
            case FAILED:
                response.setMessage("Payment failed: " + payment.getPpResponseMessage());
                break;
            case CANCELLED:
                response.setMessage("Payment was cancelled");
                break;
            default:
                response.setMessage("Payment is awaiting processing");
                break;
        }

        return response;
    }

    private void notifyWorker(Payment payment) {
        try {
            notificationService.sendPaymentConfirmation(payment);
            logger.info("Worker notification sent for payment: {}", payment.getPaymentReference());
        } catch (Exception e) {
            logger.error("Failed to send worker notification", e);
        }
    }
}