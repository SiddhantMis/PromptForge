package com.promptforge.prompt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for adding a comment to a prompt.
 */
@Data
public class CommentRequest {
    
    @NotBlank(message = "Prompt ID is required")
    private String promptId;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 5000, message = "Comment must be between 1 and 5000 characters")
    private String content;
}

