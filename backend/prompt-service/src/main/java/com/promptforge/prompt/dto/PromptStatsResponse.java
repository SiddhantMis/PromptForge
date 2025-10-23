package com.promptforge.prompt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for prompt social statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromptStatsResponse {
    private String promptId;
    private Long likeCount;
    private Long commentCount;
    private Long ratingCount;
    private Double averageRating;
}

