package com.promptforge.prompt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a user's like on a prompt.
 * Tracks which users have liked which prompts.
 */
@Entity
@Table(name = "prompt_likes", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"prompt_id", "user_id"}),
       indexes = {
           @Index(name = "idx_prompt_like_prompt", columnList = "prompt_id"),
           @Index(name = "idx_prompt_like_user", columnList = "user_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "prompt_id", nullable = false)
    private String promptId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

