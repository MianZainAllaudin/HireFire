package com.HireFire.HireFireBackend;

import java.util.Vector;
import java.time.LocalDateTime;


enum SubscriptionType{
    BASIC,
    PREMIUM
}

public class Customer extends UserClass{
    private int customerID;
    private SubscriptionType subscriptionType;
    private Vector<Integer> ratings;
    private Vector<String> reviews;
    private Vector<LocalDateTime> orderDates;

    //methods
}