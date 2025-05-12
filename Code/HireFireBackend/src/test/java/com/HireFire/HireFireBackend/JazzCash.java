package com.HireFire.HireFireBackend;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class JazzCash {

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment() {
        Map<String, String> data = new HashMap<>();

        String txnRefNo = "T" + System.currentTimeMillis();
        String txnDateTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        data.put("pp_Version", "1.1");
        data.put("pp_TxnType", "MWALLET");
        data.put("pp_Language", "EN");
        data.put("pp_MerchantID", "YOUR_MERCHANT_ID");
        data.put("pp_Password", "YOUR_PASSWORD");
        data.put("pp_TxnRefNo", txnRefNo);
        data.put("pp_Amount", "10000"); // 100 PKR
        data.put("pp_TxnCurrency", "PKR");
        data.put("pp_TxnDateTime", txnDateTime);
        data.put("pp_BillReference", "billRef");
        data.put("pp_Description", "Test Payment");
        data.put("pp_ReturnURL", "https://<ngrok-url>/api/jazzcash/payment-return");

        String hash = generateSecureHash(data); // see next step
        data.put("pp_SecureHash", hash);

        return ResponseEntity.ok(data);
    }

    private String generateSecureHash(Map<String, String> data) {
        return "";
    }

    @PostMapping("/api/jazzcash/payment-return")
    public ResponseEntity<String> handleReturn(@RequestParam Map<String, String> params) {
        // Validate pp_SecureHash
        // Check transaction status and update DB
        return ResponseEntity.ok("Payment handled");
    }

    @PostMapping("/api/jazzcash/ipn")
    public ResponseEntity<String> handleIPN(@RequestParam Map<String, String> params) {
        // Same logic as above
        return ResponseEntity.ok("IPN received");
    }

}
