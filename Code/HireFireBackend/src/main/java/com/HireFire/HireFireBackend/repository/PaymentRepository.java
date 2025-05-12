package com.HireFire.HireFireBackend.repository;

import com.HireFire.HireFireBackend.model.Payment;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class PaymentRepository {
    private final Map<String, Payment> paymentRefMap = new ConcurrentHashMap<>();
    private final Map<Long, Payment> paymentIdMap = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Payment save(Payment payment) {
        if (payment.getId() == null) {
            payment.setId(idGenerator.getAndIncrement());
        }
        paymentIdMap.put(payment.getId(), payment);
        paymentRefMap.put(payment.getPaymentReference(), payment);
        return payment;
    }

    public Optional<Payment> findById(Long id) {
        return Optional.ofNullable(paymentIdMap.get(id));
    }

    public Optional<Payment> findByPaymentReference(String paymentReference) {
        return Optional.ofNullable(paymentRefMap.get(paymentReference));
    }

    public Optional<Payment> findByTransactionId(String transactionId) {
        return paymentIdMap.values().stream()
                .filter(p -> transactionId.equals(p.getTransactionId()))
                .findFirst();
    }

    public List<Payment> findAll() {
        return new ArrayList<>(paymentIdMap.values());
    }

    public void deleteById(Long id) {
        Payment payment = paymentIdMap.remove(id);
        if (payment != null) {
            paymentRefMap.remove(payment.getPaymentReference());
        }
    }
}