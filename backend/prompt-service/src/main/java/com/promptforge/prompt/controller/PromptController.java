package com.promptforge.prompt.controller;

import com.promptforge.prompt.document.PromptVersion;
import com.promptforge.prompt.dto.CreatePromptRequest;
import com.promptforge.prompt.dto.PromptResponse;
import com.promptforge.prompt.dto.UpdatePromptRequest;
import com.promptforge.prompt.service.PromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Prompts", description = "Prompt management, versioning, and search APIs")
public class PromptController {
    
    private final PromptService promptService;
    
    @Operation(
            summary = "Create new prompt",
            description = "Creates a new AI prompt and saves version 1.0.0 to MongoDB"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Prompt created successfully",
                    content = @Content(schema = @Schema(implementation = PromptResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<PromptResponse> createPrompt(
            @Valid @RequestBody CreatePromptRequest request,
            @Parameter(description = "User ID from authentication") @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Username from authentication") @RequestHeader("X-Username") String username) {
        
        log.info("Create prompt request from user: {}", userId);
        PromptResponse response = promptService.createPrompt(request, userId, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @Operation(
            summary = "Get prompt by ID",
            description = "Retrieves a specific prompt by ID. Public prompts accessible to all, private only to owner."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Prompt found",
                    content = @Content(schema = @Schema(implementation = PromptResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Prompt not found")
    })
    @GetMapping("/{promptId}")
    public ResponseEntity<PromptResponse> getPromptById(
            @Parameter(description = "Prompt ID") @PathVariable String promptId,
            @Parameter(description = "User ID (optional)") @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Get prompt by ID: {}", promptId);
        PromptResponse response = promptService.getPromptById(promptId, userId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
            summary = "Get all public prompts",
            description = "Retrieves paginated list of public prompts with sorting"
    )
    @ApiResponse(responseCode = "200", description = "Public prompts retrieved")
    @GetMapping("/public")
    public ResponseEntity<Page<PromptResponse>> getAllPublicPrompts(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (ASC/DESC)") @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Get all public prompts - page: {}, size: {}", page, size);
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PromptResponse> prompts = promptService.getAllPrompts(pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Get user's prompts",
            description = "Retrieves all prompts (public and private) created by the authenticated user"
    )
    @ApiResponse(responseCode = "200", description = "User prompts retrieved")
    @GetMapping("/my-prompts")
    public ResponseEntity<Page<PromptResponse>> getUserPrompts(
            @Parameter(description = "User ID from authentication") @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Get prompts for user: {}", userId);
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PromptResponse> prompts = promptService.getUserPrompts(userId, pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Get prompts by category",
            description = "Retrieves public prompts filtered by category"
    )
    @ApiResponse(responseCode = "200", description = "Category prompts retrieved")
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<PromptResponse>> getPromptsByCategory(
            @Parameter(description = "Category name") @PathVariable String category,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get prompts by category: {}", category);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.getPromptsByCategory(category, pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Search prompts",
            description = "Search prompts by keyword in title and description"
    )
    @ApiResponse(responseCode = "200", description = "Search results retrieved")
    @GetMapping("/search")
    public ResponseEntity<Page<PromptResponse>> searchPrompts(
            @Parameter(description = "Search keyword") @RequestParam String keyword,
            @Parameter(description = "Filter by public/private (optional)") @RequestParam(required = false) Boolean isPublic,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("Search prompts with keyword: {}", keyword);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.searchPrompts(keyword, isPublic, pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Get prompts by tag",
            description = "Retrieves public prompts filtered by tag"
    )
    @ApiResponse(responseCode = "200", description = "Tagged prompts retrieved")
    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<PromptResponse>> getPromptsByTag(
            @Parameter(description = "Tag name") @PathVariable String tag,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get prompts by tag: {}", tag);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.getPromptsByTag(tag, pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Get trending prompts",
            description = "Retrieves public prompts sorted by view count (most viewed first)"
    )
    @ApiResponse(responseCode = "200", description = "Trending prompts retrieved")
    @GetMapping("/trending")
    public ResponseEntity<Page<PromptResponse>> getTrendingPrompts(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get trending prompts");
        Pageable pageable = PageRequest.of(page, size);
        Page<PromptResponse> prompts = promptService.getTrendingPrompts(pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Get top rated prompts",
            description = "Retrieves public prompts sorted by rating (highest first)"
    )
    @ApiResponse(responseCode = "200", description = "Top rated prompts retrieved")
    @GetMapping("/top-rated")
    public ResponseEntity<Page<PromptResponse>> getTopRatedPrompts(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get top rated prompts");
        Pageable pageable = PageRequest.of(page, size);
        Page<PromptResponse> prompts = promptService.getTopRatedPrompts(pageable);
        return ResponseEntity.ok(prompts);
    }
    
    @Operation(
            summary = "Update prompt",
            description = "Updates an existing prompt. Creates a new version if content changes."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Prompt updated successfully",
                    content = @Content(schema = @Schema(implementation = PromptResponse.class))),
            @ApiResponse(responseCode = "403", description = "Not owner of prompt"),
            @ApiResponse(responseCode = "404", description = "Prompt not found")
    })
    @PutMapping("/{promptId}")
    public ResponseEntity<PromptResponse> updatePrompt(
            @Parameter(description = "Prompt ID") @PathVariable String promptId,
            @Valid @RequestBody UpdatePromptRequest request,
            @Parameter(description = "User ID from authentication") @RequestHeader("X-User-Id") String userId) {
        
        log.info("Update prompt: {} by user: {}", promptId, userId);
        PromptResponse response = promptService.updatePrompt(promptId, request, userId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(
            summary = "Delete prompt",
            description = "Deletes a prompt. Only the owner can delete."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Prompt deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Not owner of prompt"),
            @ApiResponse(responseCode = "404", description = "Prompt not found")
    })
    @DeleteMapping("/{promptId}")
    public ResponseEntity<Void> deletePrompt(
            @Parameter(description = "Prompt ID") @PathVariable String promptId,
            @Parameter(description = "User ID from authentication") @RequestHeader("X-User-Id") String userId) {
        
        log.info("Delete prompt: {} by user: {}", promptId, userId);
        promptService.deletePrompt(promptId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(
            summary = "Get prompt version history",
            description = "Retrieves all versions of a prompt from MongoDB"
    )
    @ApiResponse(responseCode = "200", description = "Version history retrieved")
    @GetMapping("/{promptId}/versions")
    public ResponseEntity<List<PromptVersion>> getPromptVersions(
            @Parameter(description = "Prompt ID") @PathVariable String promptId) {
        
        log.info("Get versions for prompt: {}", promptId);
        List<PromptVersion> versions = promptService.getPromptVersions(promptId);
        return ResponseEntity.ok(versions);
    }
}