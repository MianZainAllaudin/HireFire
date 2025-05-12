package com.HireFire.HireFireBackend.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Setter
@Getter
public class Worker {
    private Long id;

    private String name;

    private String mobileNumber;

    private String specialization;

    private LocalDateTime createdAt;

    private String deviceToken; // For sending push notifications

}

