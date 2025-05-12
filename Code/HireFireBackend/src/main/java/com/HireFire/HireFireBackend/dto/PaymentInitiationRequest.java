package com.HireFire.HireFireBackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class PaymentInitiationRequest {

    // Getters and Setters
    private Long userId;
    private Long workerId;
    private BigDecimal amount;
    private String description;

}