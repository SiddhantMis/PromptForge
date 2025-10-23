package com.promptforge.test.controller;

import com.promptforge.test.client.AIClientFactory;
import com.promptforge.test.dto.CreateTestRequest;
import com.promptforge.test.dto.TestResponse;
import com.promptforge.test.service.TestExecutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for prompt testing operations.
 * Provides endpoints to create, execute, and retrieve prompt tests.
 */
@Slf4j
@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
@Tag(name = "Test Controller", description = "APIs for prompt testing")
public class TestController {
    
    private final TestExecutionService testExecutionService;
    private final AIClientFactory aiClientFactory;
    
    /**
     * Creates and executes a new prompt test.
     */
    @PostMapping
    @Operation(summary = "Create a new test", description = "Creates and executes a new prompt test")
    public ResponseEntity<TestResponse> createTest(
            @RequestBody CreateTestRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId) {
        
        log.info("Received test creation request from user: {}", userId);
        
        try {
            TestResponse response = testExecutionService.createAndExecuteTest(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Retrieves a test by its ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get test by ID", description = "Retrieves a specific test by its ID")
    public ResponseEntity<TestResponse> getTestById(@PathVariable String id) {
        log.info("Fetching test with ID: {}", id);
        
        return testExecutionService.getTestById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Test not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    /**
     * Retrieves all tests for a specific prompt.
     */
    @GetMapping("/prompt/{promptId}")
    @Operation(summary = "Get tests by prompt ID", description = "Retrieves all tests for a specific prompt")
    public ResponseEntity<List<TestResponse>> getTestsByPromptId(@PathVariable String promptId) {
        log.info("Fetching tests for prompt: {}", promptId);
        
        List<TestResponse> tests = testExecutionService.getTestsByPromptId(promptId);
        return ResponseEntity.ok(tests);
    }
    
    /**
     * Retrieves all tests for a specific user.
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tests by user ID", description = "Retrieves all tests for a specific user")
    public ResponseEntity<List<TestResponse>> getTestsByUserId(@PathVariable String userId) {
        log.info("Fetching tests for user: {}", userId);
        
        List<TestResponse> tests = testExecutionService.getTestsByUserId(userId);
        return ResponseEntity.ok(tests);
    }
    
    /**
     * Retrieves the list of available AI providers.
     */
    @GetMapping("/providers")
    @Operation(summary = "Get available providers", description = "Returns list of available AI providers")
    public ResponseEntity<Map<String, Object>> getAvailableProviders() {
        log.info("Fetching available AI providers");
        
        List<String> providers = aiClientFactory.getAvailableProviders();
        Map<String, Object> response = Map.of(
                "providers", providers,
                "count", providers.size()
        );
        
        return ResponseEntity.ok(response);
    }
}

