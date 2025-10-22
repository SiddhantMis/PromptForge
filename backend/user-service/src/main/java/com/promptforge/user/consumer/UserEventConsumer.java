package com.promptforge.user.consumer;

import com.promptforge.shared.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class UserEventConsumer {
    
    private static final Logger log = LoggerFactory.getLogger(UserEventConsumer.class);
    
    @KafkaListener(topics = "user.registered", groupId = "user-service-group")
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info(" Received UserRegisteredEvent:");
        log.info("   User ID: {}", event.getUserId());
        log.info("   Username: {}", event.getUsername());
        log.info("   Email: {}", event.getEmail());
        log.info("   Registered At: {}", event.getRegisteredAt());
    }
}