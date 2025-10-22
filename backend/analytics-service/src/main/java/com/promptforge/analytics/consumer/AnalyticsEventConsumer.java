package com.promptforge.analytics.consumer;

import com.promptforge.analytics.entity.PromptActivityEvent;
import com.promptforge.analytics.entity.UserActivityEvent;
import com.promptforge.analytics.repository.PromptActivityEventRepository;
import com.promptforge.analytics.repository.UserActivityEventRepository;
import com.promptforge.shared.event.PromptCreatedEvent;
import com.promptforge.shared.event.PromptViewedEvent;
import com.promptforge.shared.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsEventConsumer {
    
    private final UserActivityEventRepository userActivityRepo;
    private final PromptActivityEventRepository promptActivityRepo;
    
    @KafkaListener(topics = "user.registered", groupId = "analytics-service-group", 
                   containerFactory = "userEventKafkaListenerFactory")
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info(" Analytics: Processing UserRegisteredEvent - {}", event.getUserId());
        
        UserActivityEvent analyticsEvent = UserActivityEvent.builder()
                .eventId(event.getEventId())
                .userId(event.getUserId())
                .username(event.getUsername())
                .email(event.getEmail())
                .eventType("REGISTERED")
                .eventTime(event.getRegisteredAt())
                .createdAt(LocalDateTime.now())
                .build();
        
        userActivityRepo.save(analyticsEvent);
        log.info(" Analytics: User registration event saved");
    }
    
    @KafkaListener(topics = "prompt.created", groupId = "analytics-service-group",
                   containerFactory = "promptCreatedKafkaListenerFactory")
    public void handlePromptCreated(PromptCreatedEvent event) {
        log.info(" Analytics: Processing PromptCreatedEvent - {}", event.getPromptId());
        
        PromptActivityEvent analyticsEvent = PromptActivityEvent.builder()
                .eventId(event.getEventId())
                .promptId(event.getPromptId())
                .title(event.getTitle())
                .userId(event.getUserId())
                .username(event.getUsername())
                .category(event.getCategory())
                .eventType("CREATED")
                .eventTime(event.getCreatedAt())
                .createdAt(LocalDateTime.now())
                .build();
        
        promptActivityRepo.save(analyticsEvent);
        log.info(" Analytics: Prompt creation event saved");
    }
    
    @KafkaListener(topics = "prompt.viewed", groupId = "analytics-service-group",
                   containerFactory = "promptViewedKafkaListenerFactory")
    public void handlePromptViewed(PromptViewedEvent event) {
        log.info(" Analytics: Processing PromptViewedEvent - {}", event.getPromptId());
        
        PromptActivityEvent analyticsEvent = PromptActivityEvent.builder()
                .eventId(event.getEventId())
                .promptId(event.getPromptId())
                .userId(event.getUserId())
                .eventType("VIEWED")
                .eventTime(event.getViewedAt())
                .createdAt(LocalDateTime.now())
                .build();
        
        promptActivityRepo.save(analyticsEvent);
        log.info(" Analytics: Prompt view event saved");
    }
}