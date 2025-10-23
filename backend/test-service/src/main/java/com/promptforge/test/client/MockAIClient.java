package com.promptforge.test.client;

import com.promptforge.test.dto.AIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;

/**
 * Mock AI client for testing purposes.
 * Simulates AI responses without making actual API calls.
 */
@Slf4j
@Component
public class MockAIClient implements AIClient {
    
    private static final String[] MOCK_RESPONSES = {
        "This is a mock response generated for testing purposes. The AI model would analyze your prompt and provide a relevant response.",
        "Mock AI Response: Your prompt has been processed successfully. In a production environment, this would be replaced with actual AI-generated content.",
        "Thank you for testing the prompt. This mock client simulates AI behavior without incurring API costs.",
        "Mock response: The prompt testing service is working correctly. This response demonstrates how the system handles AI interactions.",
        "Demo mode activated. This simulated response shows how your prompt would be processed by a real AI model."
    };
    
    private final Random random = new Random();
    
    @Override
    public AIResponse generateResponse(String prompt, Double temperature, Integer maxTokens) {
        log.info("Generating mock AI response for prompt length: {}", prompt.length());
        long startTime = System.currentTimeMillis();
        
        try {
            // Simulate API delay (500-1500ms)
            int delay = 500 + random.nextInt(1000);
            Thread.sleep(delay);
            
            // Select a random mock response
            String content = MOCK_RESPONSES[random.nextInt(MOCK_RESPONSES.length)];
            
            // Estimate token count (rough approximation: words * 1.3)
            int tokenCount = (int) (prompt.split("\\s+").length * 1.3) + 
                           (int) (content.split("\\s+").length * 1.3);
            
            long responseTimeMs = System.currentTimeMillis() - startTime;
            
            log.info("Mock response generated. Tokens: {}, Time: {}ms", tokenCount, responseTimeMs);
            
            return AIResponse.builder()
                    .content(content)
                    .tokenCount(tokenCount)
                    .responseTimeMs(responseTimeMs)
                    .cost(0.0) // Mock client has no cost
                    .model("mock-model")
                    .success(true)
                    .build();
                    
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            long responseTimeMs = System.currentTimeMillis() - startTime;
            log.error("Mock AI client interrupted", e);
            return AIResponse.builder()
                    .success(false)
                    .errorMessage("Mock AI interrupted: " + e.getMessage())
                    .responseTimeMs(responseTimeMs)
                    .model("mock-model")
                    .build();
        }
    }
    
    @Override
    public String getProviderName() {
        return "MOCK";
    }
    
    @Override
    public boolean isAvailable() {
        // Mock client is always available
        return true;
    }
    
    @Override
    public double estimateCost(int tokens) {
        // Mock client is free
        return 0.0;
    }
}

