package com.promptforge.test.client;

import com.promptforge.test.dto.AIResponse;

/**
 * Interface for AI service clients.
 * Implementations provide integration with different AI providers (OpenAI, Claude, etc.)
 */
public interface AIClient {
    
    /**
     * Generates a response from the AI model based on the provided prompt.
     *
     * @param prompt The input prompt text
     * @param temperature The randomness of the response (0.0 to 2.0)
     * @param maxTokens Maximum number of tokens to generate
     * @return AIResponse containing the generated content and metadata
     */
    AIResponse generateResponse(String prompt, Double temperature, Integer maxTokens);
    
    /**
     * Returns the name of the AI provider.
     *
     * @return Provider name (e.g., "OPENAI", "MOCK")
     */
    String getProviderName();
    
    /**
     * Checks if the AI client is available for use.
     * Returns false if API keys are missing or service is unavailable.
     *
     * @return true if the client is ready to use, false otherwise
     */
    boolean isAvailable();
    
    /**
     * Estimates the cost of processing a given number of tokens.
     *
     * @param tokens The number of tokens to estimate cost for
     * @return Estimated cost in USD
     */
    double estimateCost(int tokens);
}

