package com.promptforge.test.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIResponse {
    private String content;
    private int tokenCount;
    private long responseTimeMs;
    private double cost;
    private String model;
    private boolean success;
    private String errorMessage;
}