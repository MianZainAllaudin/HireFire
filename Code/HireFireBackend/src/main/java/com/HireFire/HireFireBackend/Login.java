package com.HireFire.HireFireBackend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow requests from React Native frontend
public class Login {

    private static final String DB_URL = "jdbc:sqlite:HireFire.db";

    // Create a method to establish database connection
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    // User login DTO (Data Transfer Object)
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // Response DTO
    public static class ApiResponse {
        private boolean success;
        private String message;
        private String name;
        private String email;
        private Long userId;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public ApiResponse(boolean success, String message, String name, String email, Long userId) {
            this.success = success;
            this.message = message;
            this.name = name;
            this.email = email;
            this.userId = userId;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    // User Login endpoint
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Validate input
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty() ||
                    loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Email and password are required"));
            }

            // Hash the provided password for comparison
            String hashedPassword = hashPassword(loginRequest.getPassword());

            // Check if user exists and password matches
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(
                         "SELECT id, name, email FROM users WHERE email = ? AND password = ?")) {

                stmt.setString(1, loginRequest.getEmail());
                stmt.setString(2, hashedPassword);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Long userId = rs.getLong("id");
                        String name = rs.getString("name");
                        String email = rs.getString("email");

                        return ResponseEntity.ok(new ApiResponse(
                                true,
                                "User login successful",
                                name,
                                email,
                                userId
                        ));
                    } else {
                        // If authentication fails, return an error response
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse(false, "Invalid email or password"));
                    }
                }
            }
        } catch (SQLException | NoSuchAlgorithmException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    // Worker Login endpoint
    @PostMapping("/worker/login")
    public ResponseEntity<ApiResponse> loginWorker(@RequestBody LoginRequest loginRequest) {
        try {
            // Validate input
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty() ||
                    loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Email and password are required"));
            }

            // Hash the provided password for comparison
            String hashedPassword = hashPassword(loginRequest.getPassword());

            // Check if worker exists and password matches
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(
                         "SELECT id, name, email FROM workers WHERE email = ? AND password = ?")) {

                stmt.setString(1, loginRequest.getEmail());
                stmt.setString(2, hashedPassword);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Long userId = rs.getLong("id");
                        String name = rs.getString("name");
                        String email = rs.getString("email");

                        return ResponseEntity.ok(new ApiResponse(
                                true,
                                "Worker login successful",
                                name,
                                email,
                                userId
                        ));
                    } else {
                        // If authentication fails, return an error response
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse(false, "Invalid email or password"));
                    }
                }
            }
        } catch (SQLException | NoSuchAlgorithmException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    // Utility method to hash passwords (using SHA-256)
    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : encodedHash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<ApiResponse> testEndpoint() {
        return ResponseEntity.ok(new ApiResponse(true, "API is working!"));
    }
}