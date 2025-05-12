package com.HireFire.HireFireBackend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HireFire.HireFireBackend.WorkerLookup.Location;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*") // Allow requests from React Native frontend
public class WorkerLookup {
    private static final String DB_URL = "jdbc:sqlite:HireFire.db";

    // Create a method to establish database connection
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public static class WorkerLookupRequest {
        private Location location;
        private String dateTime;
        private String category;
    
        // Getters and setters
        public Location getLocation() {
            return location;
        }
    
        public void setLocation(Location location) {
            this.location = location;
        }
    
        public String getDateTime() {
            return dateTime;
        }
    
        public void setDateTime(String dateTime) {
            this.dateTime = dateTime;
        }
    
        public String getCategory() {
            return category;
        }
    
        public void setCategory(String category) {
            this.category = category;
        }
    }

    public static class Location {
        private Double lat;
        private Double lon;

        public Location() {
            
        }
        
        public Location(String locationString) {
            if (locationString == null || !locationString.contains(",")) {
                throw new IllegalArgumentException("Invalid location format: " + locationString);
            }
    
            String[] parts = locationString.split(",");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Location string must have exactly two values separated by a comma");
            }
    
            try {
                this.lat = Double.parseDouble(parts[0].trim());
                this.lon = Double.parseDouble(parts[1].trim());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Latitude and longitude must be valid numbers", e);
            }
        }
        
        // Getters and setters
        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLon() {
            return lon;
        }

        public void setLon(Double lon) {
            this.lon = lon;
        }

        // Calculate if this location is within 5km of another location
        public boolean inRange(Location other) {
            // Convert to double degrees assuming original integers are in degrees (e.g., 37.7749 -> 37774900)
            double thisLat = this.lat;
            double thisLon = this.lon;
            double otherLat = other.lat;
            double otherLon = other.lon;

            double earthRadiusKm = 6371.0;

            double dLat = Math.toRadians(otherLat - thisLat);
            double dLon = Math.toRadians(otherLon - thisLon);

            double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(Math.toRadians(thisLat)) * Math.cos(Math.toRadians(otherLat)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            double distanceKm = earthRadiusKm * c;

            return distanceKm <= 5.0;
        }

        @Override
        public String toString() {
            return lat + "," + lon;
        }
    }

    public static class ApiResponse {
        private boolean success;
        private String message;
        private Worker result[];

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public ApiResponse(boolean success, String message, Worker result[]) {
            this.success = success;
            this.message = message;
            this.result = result;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Worker[] getResult() { return result; }
        public void setResult(Worker result[]) { this.result = result; }
    }

    private String padTime(String time) {
        // Ensures "9:5" becomes "09:05"
        String[] parts = time.split(":");
        String hour = parts[0].length() == 1 ? "0" + parts[0] : parts[0];
        String minute = parts[1].length() == 1 ? "0" + parts[1] : parts[1];
        return hour + ":" + minute;
    }
    
    @PostMapping("/lookup")
    public ResponseEntity<ApiResponse> workerLookup(@RequestBody WorkerLookupRequest request) {
        String category = request.getCategory();
        String timeString = request.getDateTime();
        Location desiredLocation = request.getLocation();
        // Extract the time part (HH:mm) from the datetime string
        LocalTime requestedTime;
        try {
            DateTimeFormatter flexibleTimeFormatter = DateTimeFormatter.ofPattern("H:m");
            String rawTime = timeString.substring(timeString.indexOf("T") + 1);

            requestedTime = LocalTime.parse(rawTime, flexibleTimeFormatter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Invalid dateTime format"));
        }

        List<Worker> matchingWorkers = new ArrayList<>();

        try (Connection conn = getConnection();
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM workers WHERE category = ?")) {

            stmt.setString(1, category);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    String availability = rs.getString("availability");
                    Location location = new Location(rs.getString("location"));


                    if (location.inRange(desiredLocation))
                        System.err.println(location + " is in range of " + desiredLocation);
                        else
                        System.err.println(location + " is NOT in range of " + desiredLocation);
                    
                    
                    if (location.inRange(desiredLocation) && availability != null && !availability.isEmpty()) {
                        String[] parts = availability.split("-");
                        if (parts.length == 2) {
                            try {
                                LocalTime start = LocalTime.parse(padTime(parts[0]));
                                LocalTime end = LocalTime.parse(padTime(parts[1]));

                                // Check if requestedTime is within range
                                if (!requestedTime.isBefore(start) && !requestedTime.isAfter(end)) {
                                    Worker worker = new Worker();
                                    worker.setUserId(rs.getInt("id"));
                                    worker.setName(rs.getString("name"));
                                    worker.setEmail(rs.getString("email"));
                                    worker.setCategory(rs.getString("category"));
                                    worker.setExperience(rs.getString("experience"));
                                    worker.setHourlyRate(String.valueOf(rs.getDouble("hourly_rate")));
                                    worker.setAvailability(availability);

                                    matchingWorkers.add(worker);
                                }
                            } catch (Exception e) {
                                System.err.println("Invalid availability format for worker id " + rs.getInt("id"));
                            }
                        }
                    }
                }
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Database error: " + e.getMessage()));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Filtered workers", matchingWorkers.toArray(new Worker[0])));

    }
}
