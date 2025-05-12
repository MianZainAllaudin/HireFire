package com.HireFire.HireFireBackend.controller;

import com.HireFire.HireFireBackend.WorkerLookup.Location;
import com.HireFire.HireFireBackend.model.Worker;
import com.HireFire.HireFireBackend.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerRepository workerRepository;
    private static final String DB_URL = "jdbc:sqlite:HireFire.db";

    // Create a method to establish database connection
    private Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL);
        return conn;
    }

    public static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @Autowired
    public WorkerController(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    @PostMapping
    public ResponseEntity<Worker> createWorker(@RequestBody Worker worker) {
        worker.setCreatedAt(LocalDateTime.now());
        Worker savedWorker = workerRepository.save(worker);
        return ResponseEntity.ok(savedWorker);
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable Long id) {
        return workerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/update_preferred_location")
    public ResponseEntity<ApiResponse> updatePreferredLocation(
            @PathVariable Long id,
            @RequestBody Location location
    ) {
        double x = location.getLat();
        double y = location.getLon();
        try (Connection conn = getConnection()) {
            String newLocation = x + "," + y;

            String updateSql = "UPDATE workers SET location = ? WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(updateSql)) {
                stmt.setString(1, newLocation);
                stmt.setLong(2, id);

                int updated = stmt.executeUpdate();
                if (updated > 0) {
                    return ResponseEntity.ok(new ApiResponse(true, "Preferred location updated successfully"));
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse(false, "Worker not found"));
                }
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to update location: " + e.getMessage()));
        }
    }
}