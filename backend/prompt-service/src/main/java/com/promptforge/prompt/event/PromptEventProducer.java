package com.promptforge.prompt.event;

import com.promptforge.shared.event.PromptCreatedEvent;
import com.promptforge.shared.event.PromptViewedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromptEventProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String PROMPT_CREATED_TOPIC = "prompt.created";
    private static final String PROMPT_VIEWED_TOPIC = "prompt.viewed";
    
    public void publishPromptCreated(String promptId, String title, String userId, String username, 
                                     String category, Boolean isPublic) {
        try {
            PromptCreatedEvent event = PromptCreatedEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .promptId(promptId)
                    .title(title)
                    .userId(userId)
                    .username(username)
                    .category(category)
                    .isPublic(isPublic)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            kafkaTemplate.send(PROMPT_CREATED_TOPIC, promptId, event);
            
            log.info("Published PromptCreatedEvent for prompt: {} to topic: {}", promptId, PROMPT_CREATED_TOPIC);
        } catch (Exception e) {
            log.error("Failed to publish PromptCreatedEvent for prompt: {}", promptId, e);
        }
    }
    
    public void publishPromptViewed(String promptId, String userId) {
        try {
            PromptViewedEvent event = PromptViewedEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .promptId(promptId)
                    .userId(userId)
                    .viewedAt(LocalDateTime.now())
                    .build();
            
            kafkaTemplate.send(PROMPT_VIEWED_TOPIC, promptId, event);
            
            log.debug("Published PromptViewedEvent for prompt: {}", promptId);
        } catch (Exception e) {
            log.error("Failed to publish PromptViewedEvent for prompt: {}", promptId, e);
        }
    }
}