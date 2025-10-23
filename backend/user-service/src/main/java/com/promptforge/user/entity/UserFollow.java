package com.promptforge.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a follow relationship between users.
 * One user (follower) follows another user (following).
 */
@Entity
@Table(name = "user_follows",
       uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}),
       indexes = {
           @Index(name = "idx_follower", columnList = "follower_id"),
           @Index(name = "idx_following", columnList = "following_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFollow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "follower_id", nullable = false)
    private String followerId;
    
    @Column(name = "following_id", nullable = false)
    private String followingId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

