package com.HireFire.HireFireBackend.util;

public class JazzCashConstants {

    // JazzCash API parameters
    public static final String VERSION = "1.1";
    public static final String TXN_TYPE = "MWALLET";
    public static final String LANGUAGE = "EN";
    public static final String CURRENCY = "PKR";

    // JazzCash response codes
    public static final String RESPONSE_CODE_SUCCESS = "000";
    public static final String RESPONSE_CODE_PENDING = "124";
    public static final String RESPONSE_CODE_FAILED = "999";

    private JazzCashConstants() {
        // Private constructor to prevent instantiation
    }
}

