package com.promptforge.user.event;

import com.promptforge.shared.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserEventProducer {
    
    private static final Logger log = LoggerFactory.getLogger(UserEventProducer.class);
    private final KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;
    private static final String USER_REGISTERED_TOPIC = "user.registered";
    
    public UserEventProducer(KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    public void publishUserRegistered(String userId, String username, String email) {
        try {
            UserRegisteredEvent event = UserRegisteredEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .userId(userId)
                    .username(username)
                    .email(email)
                    .registeredAt(LocalDateTime.now())
                    .build();
            
            kafkaTemplate.send(USER_REGISTERED_TOPIC, userId, event);
            
            log.info("Published UserRegisteredEvent for user: {} to topic: {}", userId, USER_REGISTERED_TOPIC);
        } catch (Exception e) {
            log.error("Failed to publish UserRegisteredEvent for user: {}", userId, e);
        }
    }
}