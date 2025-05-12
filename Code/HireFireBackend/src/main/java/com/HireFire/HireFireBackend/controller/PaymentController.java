package com.HireFire.HireFireBackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @GetMapping("/initiate")
    public PaymentInitiationResponse initiatePayment() {
        String jazzCashUrl = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform" +
                "?pp_Version=1.1" +
                "&pp_TxnType=MWALLET" +
                "&pp_Language=EN" +
                "&pp_MerchantID=MC151248" +
                "&pp_Password=99cx8s93f0" +
                "&pp_TxnRefNo=202505011510539A08AF21" +
                "&pp_Amount=250000" +
                "&pp_TxnCurrency=PKR" +
                "&pp_TxnDateTime=20250509151053" +
                "&pp_BillReference=HF-37B4118A" +
                "&pp_Description=Payment";

        return new PaymentInitiationResponse(jazzCashUrl);
    }

    // Simple response DTO
    private static class PaymentInitiationResponse {
        private final String redirectUrl;

        public PaymentInitiationResponse(String redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        public String getRedirectUrl() {
            return redirectUrl;
        }
    }
}