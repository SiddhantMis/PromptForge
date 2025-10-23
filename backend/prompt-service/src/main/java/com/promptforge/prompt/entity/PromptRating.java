package com.promptforge.prompt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a user's rating of a prompt.
 * Each user can rate a prompt once with a score from 1-5 and optional review text.
 */
@Entity
@Table(name = "prompt_ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"prompt_id", "user_id"}),
       indexes = {
           @Index(name = "idx_prompt_rating_prompt", columnList = "prompt_id"),
           @Index(name = "idx_prompt_rating_user", columnList = "user_id"),
           @Index(name = "idx_prompt_rating_score", columnList = "rating")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptRating {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "prompt_id", nullable = false)
    private String promptId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String review;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

