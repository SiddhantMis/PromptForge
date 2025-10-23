package com.promptforge.test.dto;

import lombok.Data;

@Data
public class CreateTestRequest {
    private String promptId;
    private String promptContent;
    private String modelProvider; // OPENAI, CLAUDE, GEMINI
    private String modelName;
    private Double temperature = 0.7;
    private Integer maxTokens = 1000;
}