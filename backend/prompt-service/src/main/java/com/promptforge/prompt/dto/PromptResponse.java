package com.promptforge.prompt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptResponse {
    
    private String id;
    private String title;
    private String content;
    private String description;
    private String userId;
    private String username;
    private String category;
    private Set<String> tags;
    private Boolean isPublic;
    private Boolean isFeatured;
    private Integer viewCount;
    private Integer forkCount;
    private Integer likeCount;
    private Double rating;
    private Integer ratingCount;
    private String model;
    private String version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}