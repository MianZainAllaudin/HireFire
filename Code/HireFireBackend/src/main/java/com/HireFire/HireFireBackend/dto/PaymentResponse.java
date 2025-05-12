package com.HireFire.HireFireBackend.dto;

import com.HireFire.HireFireBackend.model.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class PaymentResponse {

    // Getters and Setters
    private String paymentReference;
    private String redirectUrl;
    private BigDecimal amount;
    private PaymentStatus status;
    private String message;

    // Constructors
    public PaymentResponse() {
    }

    public PaymentResponse(String paymentReference, String redirectUrl, BigDecimal amount, PaymentStatus status) {
        this.paymentReference = paymentReference;
        this.redirectUrl = redirectUrl;
        this.amount = amount;
        this.status = status;
    }

}

