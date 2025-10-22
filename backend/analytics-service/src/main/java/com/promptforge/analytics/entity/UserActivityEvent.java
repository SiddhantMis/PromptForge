package com.promptforge.analytics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivityEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String eventId;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String username;
    
    private String email;
    
    @Column(nullable = false)
    private String eventType; // REGISTERED, LOGIN, etc.
    
    @Column(nullable = false)
    private LocalDateTime eventTime;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}