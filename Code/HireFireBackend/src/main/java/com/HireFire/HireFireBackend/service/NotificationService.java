package com.HireFire.HireFireBackend.service;

import com.HireFire.HireFireBackend.model.Payment;
import com.HireFire.HireFireBackend.model.Worker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    /**
     * Send payment confirmation to worker
     * This could be implemented using Firebase Cloud Messaging or another push notification service
     */
    public void sendPaymentConfirmation(Payment payment) {
        Worker worker = payment.getWorker();
        String deviceToken = worker.getDeviceToken();

        if (deviceToken != null && !deviceToken.isEmpty()) {
            // In a real implementation, this would send a push notification to the worker's device
            // For now, we'll just log the action
            logger.info("Sending payment confirmation to worker: {}, device token: {}, amount: {}",
                    worker.getName(), deviceToken, payment.getAmount());

            // Mock implementation - in a real app, this would use FCM or another service
            // FirebaseMessage message = FirebaseMessage.builder()
            //     .setToken(deviceToken)
            //     .setNotification(Notification.builder()
            //         .setTitle("Payment Received")
            //         .setBody("Payment of " + payment.getAmount() + " has been received from " + payment.getUser().getName() + ". You can proceed to your next task.")
            //         .build())
            //     .setData(Map.of(
            //         "paymentId", payment.getId().toString(),
            //         "paymentReference", payment.getPaymentReference(),
            //         "amount", payment.getAmount().toString(),
            //         "currency", "PKR",
            //         "timestamp", payment.getCompletedAt().toString()
            //     ))
            //     .build();
            // firebaseMessaging.send(message);
        } else {
            logger.warn("Cannot send notification to worker: {} - no device token", worker.getName());
            // Fallback notification method could be implemented here (e.g., SMS)
        }
    }

    /**
     * Send SMS notification to worker as a fallback
     * This would be useful in cases where the worker doesn't have the app installed
     * or doesn't have an internet connection
     */
    public void sendSmsNotification(Payment payment) {
        Worker worker = payment.getWorker();
        String mobileNumber = worker.getMobileNumber();

        if (mobileNumber != null && !mobileNumber.isEmpty()) {
            // In a real implementation, this would send an SMS to the worker's mobile
            logger.info("Sending SMS notification to worker: {}, mobile: {}, amount: {}",
                    worker.getName(), mobileNumber, payment.getAmount());

            // Implementation would use an SMS gateway service
            // Example: twilioClient.messages.create(new MessageCreator(mobileNumber, twilioPhoneNumber,
            //     "Payment of PKR " + payment.getAmount() + " has been received. You may proceed to your next task."));
        }
    }
}