package com.promptforge.prompt.consumer;

import com.promptforge.shared.event.PromptCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PromptEventConsumer {
    
    private static final Logger log = LoggerFactory.getLogger(PromptEventConsumer.class);
    
    @KafkaListener(topics = "prompt.created", groupId = "prompt-service-group")
    public void handlePromptCreated(PromptCreatedEvent event) {
        log.info(" Received PromptCreatedEvent:");
        log.info("   Prompt ID: {}", event.getPromptId());
        log.info("   Title: {}", event.getTitle());
        log.info("   User: {}", event.getUsername());
        log.info("   Category: {}", event.getCategory());
    }
}