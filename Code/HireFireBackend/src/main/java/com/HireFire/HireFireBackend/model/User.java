package com.HireFire.HireFireBackend.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class User {

    // Getters and Setters
    private Long id;

    private String name;

    private String email;

    private String mobileNumber;

    private String address;

    private LocalDateTime createdAt;

}
