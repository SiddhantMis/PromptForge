package com.promptforge.test.dto;

import com.promptforge.test.entity.TestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TestResponse {
    private String id;
    private String promptId;
    private String userId;
    private String modelProvider;
    private String modelName;
    private Double temperature;
    private Integer maxTokens;
    private TestStatus status;
    private String response;
    private Integer tokenCount;
    private Long responseTimeMs;
    private Double cost;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}