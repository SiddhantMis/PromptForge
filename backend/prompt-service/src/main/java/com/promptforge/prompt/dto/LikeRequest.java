package com.promptforge.prompt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO for liking a prompt.
 */
@Data
public class LikeRequest {
    
    @NotBlank(message = "Prompt ID is required")
    private String promptId;
}

