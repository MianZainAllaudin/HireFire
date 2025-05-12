package com.HireFire.HireFireBackend.service;

import com.HireFire.HireFireBackend.dto.PaymentInitiationRequest;
import com.HireFire.HireFireBackend.dto.PaymentResponse;
import com.HireFire.HireFireBackend.exception.PaymentException;
import com.HireFire.HireFireBackend.model.Payment;
import com.HireFire.HireFireBackend.model.PaymentStatus;
import com.HireFire.HireFireBackend.model.User;
import com.HireFire.HireFireBackend.model.Worker;
import com.HireFire.HireFireBackend.repository.PaymentRepository;
import com.HireFire.HireFireBackend.repository.UserRepository;
import com.HireFire.HireFireBackend.repository.WorkerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PaymentRepository paymentRepository;
    private final JazzCashService jazzCashService;

    @Autowired
    public PaymentService(
            UserRepository userRepository,
            WorkerRepository workerRepository,
            PaymentRepository paymentRepository,
            JazzCashService jazzCashService) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.paymentRepository = paymentRepository;
        this.jazzCashService = jazzCashService;
    }

    // Remove @Transactional annotation
    public PaymentResponse initiatePayment(PaymentInitiationRequest request) {
        logger.info("Initiating payment for user: {}, worker: {}, amount: {}",
                request.getUserId(), request.getWorkerId(), request.getAmount());

        // Find user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new PaymentException("User not found"));

        // Find worker
        Worker worker = workerRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new PaymentException("Worker not found"));

        // Create payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setWorker(worker);
        payment.setAmount(request.getAmount());
        payment.setPaymentReference(generatePaymentReference());
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setCreatedAt(LocalDateTime.now());

        // Save payment to in-memory storage
        payment = paymentRepository.save(payment);

        // Initiate JazzCash payment
        String redirectUrl = jazzCashService.initiatePayment(payment);

        // Return response
        PaymentResponse response = new PaymentResponse();
        response.setPaymentReference(payment.getPaymentReference());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setRedirectUrl(redirectUrl);

        return response;
    }

    // Rest of the methods remain the same...
    public Payment getPaymentByReference(String reference) {
        return paymentRepository.findByPaymentReference(reference)
                .orElseThrow(() -> new PaymentException("Payment not found"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment updatePaymentStatus(String reference, PaymentStatus status) {
        Payment payment = getPaymentByReference(reference);
        payment.setStatus(status);
        if (status == PaymentStatus.COMPLETED) {
            payment.setCompletedAt(LocalDateTime.now());
        }
        return paymentRepository.save(payment);
    }

    private String generatePaymentReference() {
        return "HF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}