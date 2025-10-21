package com.promptforge.prompt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromptRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    private String content;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private Set<String> tags;
    
    private Boolean isPublic = false;
    
    private String model; // GPT-4, Claude, etc.
}