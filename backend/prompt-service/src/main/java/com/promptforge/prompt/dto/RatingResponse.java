package com.promptforge.prompt.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for prompt ratings.
 */
@Data
@Builder
public class RatingResponse {
    private String id;
    private String promptId;
    private String userId;
    private Integer rating;
    private String review;
    private LocalDateTime createdAt;
}

