package com.promptforge.analytics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prompt_activity_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptActivityEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String eventId;
    
    @Column(nullable = false)
    private String promptId;
    
    private String title;
    
    @Column(nullable = false)
    private String userId;
    
    private String username;
    
    private String category;
    
    @Column(nullable = false)
    private String eventType; // CREATED, VIEWED, UPDATED, etc.
    
    @Column(nullable = false)
    private LocalDateTime eventTime;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}