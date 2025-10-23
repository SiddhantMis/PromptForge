package com.promptforge.test.service;

import com.promptforge.test.client.AIClient;
import com.promptforge.test.client.AIClientFactory;
import com.promptforge.test.dto.AIResponse;
import com.promptforge.test.dto.CreateTestRequest;
import com.promptforge.test.dto.TestResponse;
import com.promptforge.test.entity.PromptTest;
import com.promptforge.test.entity.TestStatus;
import com.promptforge.test.repository.PromptTestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for executing and managing prompt tests.
 * Handles test creation, execution, and result storage.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TestExecutionService {
    
    private final PromptTestRepository promptTestRepository;
    private final AIClientFactory aiClientFactory;
    
    /**
     * Creates a new test and executes it asynchronously.
     *
     * @param request The test creation request
     * @param userId The ID of the user creating the test
     * @return Initial test response with PENDING status
     */
    @Transactional
    public TestResponse createAndExecuteTest(CreateTestRequest request, String userId) {
        log.info("Creating new test for user: {} with provider: {}", userId, request.getModelProvider());
        
        // Create test entity
        PromptTest test = PromptTest.builder()
                .promptId(request.getPromptId())
                .userId(userId)
                .promptContent(request.getPromptContent())
                .modelProvider(request.getModelProvider())
                .modelName(request.getModelName())
                .temperature(request.getTemperature())
                .maxTokens(request.getMaxTokens())
                .status(TestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        
        test = promptTestRepository.save(test);
        log.info("Test created with ID: {}", test.getId());
        
        // Execute test asynchronously
        executeTestAsync(test.getId());
        
        return mapToResponse(test);
    }
    
    /**
     * Executes a test asynchronously.
     * Updates the test status and results in the database.
     *
     * @param testId The ID of the test to execute
     */
    @Async
    @Transactional
    public void executeTestAsync(String testId) {
        log.info("Starting async execution of test: {}", testId);
        
        Optional<PromptTest> testOpt = promptTestRepository.findById(testId);
        if (testOpt.isEmpty()) {
            log.error("Test not found: {}", testId);
            return;
        }
        
        PromptTest test = testOpt.get();
        
        try {
            // Update status to RUNNING
            test.setStatus(TestStatus.RUNNING);
            promptTestRepository.save(test);
            log.info("Test status updated to RUNNING: {}", testId);
            
            // Get appropriate AI client
            AIClient client = aiClientFactory.getClient(test.getModelProvider());
            log.info("Using AI client: {}", client.getProviderName());
            
            // Generate response
            AIResponse aiResponse = client.generateResponse(
                    test.getPromptContent(),
                    test.getTemperature(),
                    test.getMaxTokens()
            );
            
            // Update test with results
            if (aiResponse.isSuccess()) {
                test.setStatus(TestStatus.COMPLETED);
                test.setResponse(aiResponse.getContent());
                test.setTokenCount(aiResponse.getTokenCount());
                test.setResponseTimeMs(aiResponse.getResponseTimeMs());
                test.setCost(aiResponse.getCost());
                test.setCompletedAt(LocalDateTime.now());
                log.info("Test completed successfully: {}", testId);
            } else {
                test.setStatus(TestStatus.FAILED);
                test.setErrorMessage(aiResponse.getErrorMessage());
                test.setCompletedAt(LocalDateTime.now());
                log.error("Test failed: {} - Error: {}", testId, aiResponse.getErrorMessage());
            }
            
        } catch (Exception e) {
            log.error("Error executing test: {}", testId, e);
            test.setStatus(TestStatus.FAILED);
            test.setErrorMessage("Execution error: " + e.getMessage());
            test.setCompletedAt(LocalDateTime.now());
        } finally {
            promptTestRepository.save(test);
        }
    }
    
    /**
     * Retrieves a test by its ID.
     *
     * @param testId The test ID
     * @return Optional containing the test response if found
     */
    @Transactional(readOnly = true)
    public Optional<TestResponse> getTestById(String testId) {
        log.debug("Fetching test by ID: {}", testId);
        return promptTestRepository.findById(testId)
                .map(this::mapToResponse);
    }
    
    /**
     * Retrieves all tests for a specific prompt.
     *
     * @param promptId The prompt ID
     * @return List of test responses
     */
    @Transactional(readOnly = true)
    public List<TestResponse> getTestsByPromptId(String promptId) {
        log.debug("Fetching tests for prompt: {}", promptId);
        return promptTestRepository.findByPromptIdOrderByCreatedAtDesc(promptId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves all tests for a specific user.
     *
     * @param userId The user ID
     * @return List of test responses
     */
    @Transactional(readOnly = true)
    public List<TestResponse> getTestsByUserId(String userId) {
        log.debug("Fetching tests for user: {}", userId);
        return promptTestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Maps a PromptTest entity to a TestResponse DTO.
     *
     * @param test The test entity
     * @return The test response DTO
     */
    private TestResponse mapToResponse(PromptTest test) {
        return TestResponse.builder()
                .id(test.getId())
                .promptId(test.getPromptId())
                .userId(test.getUserId())
                .modelProvider(test.getModelProvider())
                .modelName(test.getModelName())
                .temperature(test.getTemperature())
                .maxTokens(test.getMaxTokens())
                .status(test.getStatus())
                .response(test.getResponse())
                .tokenCount(test.getTokenCount())
                .responseTimeMs(test.getResponseTimeMs())
                .cost(test.getCost())
                .errorMessage(test.getErrorMessage())
                .createdAt(test.getCreatedAt())
                .completedAt(test.getCompletedAt())
                .build();
    }
}

