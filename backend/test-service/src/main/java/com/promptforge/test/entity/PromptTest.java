package com.promptforge.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prompt_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptTest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String promptId;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String promptContent;
    
    @Column(nullable = false)
    private String modelProvider; // OPENAI, CLAUDE, GEMINI, etc.
    
    @Column(nullable = false)
    private String modelName; // gpt-4, claude-3, gemini-pro, etc.
    
    @Column
    private Double temperature;
    
    @Column
    private Integer maxTokens;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status; // PENDING, RUNNING, COMPLETED, FAILED
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    @Column
    private Integer tokenCount;
    
    @Column
    private Long responseTimeMs;
    
    @Column
    private Double cost; // Estimated API cost
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime completedAt;
}