package com.HireFire.HireFireBackend;

public class Worker {
    private int userId;
    private String name;
    private String email;
    private String category;
    private String experience;
    private String hourlyRate;
    private String availability;

    // Constructors
    public Worker() {}

    public Worker(int userId, String name, String email, String category, String experience, String hourlyRate, String availability) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.category = category;
        this.experience = experience;
        this.hourlyRate = hourlyRate;
        this.availability = availability;
    }

    // Getters and Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(String hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }
}

