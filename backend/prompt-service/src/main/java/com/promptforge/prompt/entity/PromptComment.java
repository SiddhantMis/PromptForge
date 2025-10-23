package com.promptforge.prompt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a comment on a prompt.
 * Users can leave multiple comments on prompts to provide feedback or discussion.
 */
@Entity
@Table(name = "prompt_comments",
       indexes = {
           @Index(name = "idx_prompt_comment_prompt", columnList = "prompt_id"),
           @Index(name = "idx_prompt_comment_user", columnList = "user_id"),
           @Index(name = "idx_prompt_comment_created", columnList = "created_at")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "prompt_id", nullable = false)
    private String promptId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @NotBlank(message = "Username is required")
    @Column(nullable = false)
    private String username;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 5000, message = "Comment must be between 1 and 5000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

