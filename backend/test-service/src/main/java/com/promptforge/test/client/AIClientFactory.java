package com.promptforge.test.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Factory for creating and managing AI client instances.
 * Routes requests to appropriate AI provider based on availability and configuration.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AIClientFactory {
    
    private final OpenAIClient openAIClient;
    private final MockAIClient mockAIClient;
    
    /**
     * Gets an AI client based on the specified provider name.
     * Falls back to MockAIClient if the requested provider is unavailable.
     *
     * @param provider The provider name (OPENAI, MOCK, etc.)
     * @return An available AIClient instance
     */
    public AIClient getClient(String provider) {
        if (provider == null || provider.isEmpty()) {
            log.info("No provider specified, using MockAIClient");
            return mockAIClient;
        }
        
        String providerUpper = provider.toUpperCase();
        
        switch (providerUpper) {
            case "OPENAI":
                if (openAIClient.isAvailable()) {
                    log.info("Using OpenAI client");
                    return openAIClient;
                } else {
                    log.warn("OpenAI client not available (API key missing), falling back to Mock client");
                    return mockAIClient;
                }
                
            case "MOCK":
                log.info("Using Mock client");
                return mockAIClient;
                
            default:
                log.warn("Unknown provider: {}, falling back to Mock client", provider);
                return mockAIClient;
        }
    }
    
    /**
     * Returns a list of available AI providers.
     * Checks which providers are currently configured and available.
     *
     * @return List of provider names
     */
    public List<String> getAvailableProviders() {
        List<String> providers = new ArrayList<>();
        
        // Always add MOCK as it's always available
        providers.add("MOCK");
        
        // Add OpenAI if available
        if (openAIClient.isAvailable()) {
            providers.add("OPENAI");
        }
        
        log.debug("Available providers: {}", providers);
        return providers;
    }
}

