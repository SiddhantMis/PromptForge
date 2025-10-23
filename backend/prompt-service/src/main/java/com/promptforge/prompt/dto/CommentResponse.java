package com.promptforge.prompt.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for prompt comments.
 */
@Data
@Builder
public class CommentResponse {
    private String id;
    private String promptId;
    private String userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

