package com.HireFire.HireFireBackend.service;

import com.HireFire.HireFireBackend.model.Payment;
import com.HireFire.HireFireBackend.model.PaymentStatus;
import com.HireFire.HireFireBackend.model.Worker;
import com.HireFire.HireFireBackend.repository.PaymentRepository;
import com.HireFire.HireFireBackend.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public WorkerService(WorkerRepository workerRepository, PaymentRepository paymentRepository) {
        this.workerRepository = workerRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Get all payments for a worker
     */
    public List<Payment> getWorkerPayments(Long workerId) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getWorker().getId().equals(workerId))
                .collect(Collectors.toList());
    }

    /**
     * Get completed payments for a worker in the current month
     */
    public List<Payment> getWorkerCompletedPaymentsForCurrentMonth(Long workerId) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getWorker().getId().equals(workerId))
                .filter(payment -> payment.getStatus() == PaymentStatus.COMPLETED)
                .filter(payment -> payment.getCompletedAt() != null && payment.getCompletedAt().isAfter(startOfMonth))
                .collect(Collectors.toList());
    }
}
