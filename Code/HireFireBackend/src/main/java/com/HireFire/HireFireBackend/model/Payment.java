package com.HireFire.HireFireBackend.model;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Setter
@Getter
public class Payment {

    // Getters and Setters
    private Long id;
    private String paymentReference;
    private User user;
    private Worker worker;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String transactionId;

    // JazzCash specific fields
    private String ppBillReference;
    private String ppResponseCode;
    private String ppResponseMessage;

    // Default constructor
    public Payment() {
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.INITIATED;
    }

    // Utility method to format amount for JazzCash
    public String getFormattedAmount() {
        return this.amount.multiply(new BigDecimal("100")).setScale(0, RoundingMode.HALF_UP).toString();
    }

}

