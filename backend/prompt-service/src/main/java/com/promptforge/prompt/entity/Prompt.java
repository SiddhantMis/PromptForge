package com.promptforge.prompt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "prompts", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_is_public", columnList = "is_public"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prompt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @NotBlank(message = "User ID is required")
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String username; // Denormalized for display
    
    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 50)
    private String category;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "prompt_tags", joinColumns = @JoinColumn(name = "prompt_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();
    
    @Column(name = "is_public", nullable = false)
    @Builder.Default
    private Boolean isPublic = false;
    
    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer forkCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer likeCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;
    
    @Column(length = 50)
    private String model; // GPT-4, Claude, Gemini, etc.
    
    @Column(length = 20)
    private String version; // Semantic versioning: 1.0.0
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Helper methods
    public void addTag(String tag) {
        if (this.tags == null) {
            this.tags = new HashSet<>();
        }
        this.tags.add(tag.toLowerCase());
    }
    
    public void removeTag(String tag) {
        if (this.tags != null) {
            this.tags.remove(tag.toLowerCase());
        }
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public void incrementForkCount() {
        this.forkCount++;
    }
    
    public void incrementLikeCount() {
        this.likeCount++;
    }
    
    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }
    
    public void updateRating(double newRating) {
        this.rating = ((this.rating * this.ratingCount) + newRating) / (this.ratingCount + 1);
        this.ratingCount++;
    }
}