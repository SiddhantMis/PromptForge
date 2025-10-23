package com.promptforge.test.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptforge.test.dto.AIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * OpenAI API client implementation.
 * Integrates with OpenAI's GPT models via REST API.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAIClient implements AIClient {
    
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-3.5-turbo";
    private static final double COST_PER_1K_TOKENS = 0.002;
    private static final Duration TIMEOUT = Duration.ofSeconds(30);
    
    @Value("${openai.api.key:demo}")
    private String apiKey;
    
    private final ObjectMapper objectMapper;
    
    @Override
    public AIResponse generateResponse(String prompt, Double temperature, Integer maxTokens) {
        log.info("Generating OpenAI response for prompt length: {}", prompt.length());
        long startTime = System.currentTimeMillis();
        
        try {
            // Check if API key is available
            if (!isAvailable()) {
                log.warn("OpenAI API key not configured, cannot generate response");
                return AIResponse.builder()
                        .success(false)
                        .errorMessage("OpenAI API key not configured")
                        .responseTimeMs(System.currentTimeMillis() - startTime)
                        .build();
            }
            
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL);
            requestBody.put("temperature", temperature != null ? temperature : 0.7);
            requestBody.put("max_tokens", maxTokens != null ? maxTokens : 1000);
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            requestBody.put("messages", List.of(message));
            
            // Create WebClient
            WebClient webClient = WebClient.builder()
                    .baseUrl(OPENAI_API_URL)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();
            
            // Make API call
            String responseBody = webClient.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(TIMEOUT)
                    .onErrorResume(error -> {
                        log.error("OpenAI API call failed: {}", error.getMessage());
                        return Mono.just("{\"error\":\"" + error.getMessage() + "\"}");
                    })
                    .block();
            
            long responseTimeMs = System.currentTimeMillis() - startTime;
            
            // Parse response
            JsonNode rootNode = objectMapper.readTree(responseBody);
            
            // Check for errors
            if (rootNode.has("error")) {
                String errorMessage = rootNode.get("error").asText();
                log.error("OpenAI API error: {}", errorMessage);
                return AIResponse.builder()
                        .success(false)
                        .errorMessage(errorMessage)
                        .responseTimeMs(responseTimeMs)
                        .model(MODEL)
                        .build();
            }
            
            // Extract response data
            String content = rootNode.path("choices").get(0)
                    .path("message").path("content").asText();
            int tokenCount = rootNode.path("usage").path("total_tokens").asInt(0);
            double cost = estimateCost(tokenCount);
            
            log.info("OpenAI response generated successfully. Tokens: {}, Cost: ${}", tokenCount, cost);
            
            return AIResponse.builder()
                    .content(content)
                    .tokenCount(tokenCount)
                    .responseTimeMs(responseTimeMs)
                    .cost(cost)
                    .model(MODEL)
                    .success(true)
                    .build();
                    
        } catch (Exception e) {
            long responseTimeMs = System.currentTimeMillis() - startTime;
            log.error("Error calling OpenAI API", e);
            return AIResponse.builder()
                    .success(false)
                    .errorMessage("OpenAI API error: " + e.getMessage())
                    .responseTimeMs(responseTimeMs)
                    .model(MODEL)
                    .build();
        }
    }
    
    @Override
    public String getProviderName() {
        return "OPENAI";
    }
    
    @Override
    public boolean isAvailable() {
        // Check if API key is configured and not the default "demo" value
        return apiKey != null && !apiKey.isEmpty() && !apiKey.equals("demo");
    }
    
    @Override
    public double estimateCost(int tokens) {
        return (tokens / 1000.0) * COST_PER_1K_TOKENS;
    }
}

