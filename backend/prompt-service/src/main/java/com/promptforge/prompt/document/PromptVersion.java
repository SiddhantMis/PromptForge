package com.promptforge.prompt.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "prompt_versions")
@CompoundIndex(name = "prompt_version_idx", def = "{'promptId': 1, 'version': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptVersion {
    
    @Id
    private String id;
    
    private String promptId; // Reference to Prompt entity in PostgreSQL
    
    private String version; // Semantic version: 1.0.0
    
    private String content; // Full prompt content at this version
    
    private String title;
    
    private String description;
    
    private String userId;
    
    private String username;
    
    private String changeLog; // What changed in this version
    
    private LocalDateTime createdAt;
    
    private Map<String, Object> metadata; // Additional version-specific data
}