package com.promptforge.prompt.controller;

import com.promptforge.prompt.document.PromptVersion;
import com.promptforge.prompt.dto.CreatePromptRequest;
import com.promptforge.prompt.dto.PromptResponse;
import com.promptforge.prompt.dto.UpdatePromptRequest;
import com.promptforge.prompt.service.PromptService;
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
public class PromptController {
    
    private final PromptService promptService;
    
    // Create prompt (authenticated)
    @PostMapping
    public ResponseEntity<PromptResponse> createPrompt(
            @Valid @RequestBody CreatePromptRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Username") String username) {
        
        log.info("Create prompt request from user: {}", userId);
        
        PromptResponse response = promptService.createPrompt(request, userId, username);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // Get prompt by ID (public if isPublic=true, otherwise owner only)
    @GetMapping("/{promptId}")
    public ResponseEntity<PromptResponse> getPromptById(
            @PathVariable String promptId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Get prompt by ID: {}", promptId);
        
        PromptResponse response = promptService.getPromptById(promptId, userId);
        
        return ResponseEntity.ok(response);
    }
    
    // Get all public prompts
    @GetMapping("/public")
    public ResponseEntity<Page<PromptResponse>> getAllPublicPrompts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Get all public prompts - page: {}, size: {}", page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PromptResponse> prompts = promptService.getAllPrompts(pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Get user's prompts (authenticated)
    @GetMapping("/my-prompts")
    public ResponseEntity<Page<PromptResponse>> getUserPrompts(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Get prompts for user: {}", userId);
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PromptResponse> prompts = promptService.getUserPrompts(userId, pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Get prompts by category
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<PromptResponse>> getPromptsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get prompts by category: {}", category);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.getPromptsByCategory(category, pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Search prompts
    @GetMapping("/search")
    public ResponseEntity<Page<PromptResponse>> searchPrompts(
            @RequestParam String keyword,
            @RequestParam(required = false) Boolean isPublic,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Search prompts with keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.searchPrompts(keyword, isPublic, pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Get prompts by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<PromptResponse>> getPromptsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get prompts by tag: {}", tag);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PromptResponse> prompts = promptService.getPromptsByTag(tag, pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Get trending prompts
    @GetMapping("/trending")
    public ResponseEntity<Page<PromptResponse>> getTrendingPrompts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get trending prompts");
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PromptResponse> prompts = promptService.getTrendingPrompts(pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Get top rated prompts
    @GetMapping("/top-rated")
    public ResponseEntity<Page<PromptResponse>> getTopRatedPrompts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Get top rated prompts");
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PromptResponse> prompts = promptService.getTopRatedPrompts(pageable);
        
        return ResponseEntity.ok(prompts);
    }
    
    // Update prompt (authenticated, owner only)
    @PutMapping("/{promptId}")
    public ResponseEntity<PromptResponse> updatePrompt(
            @PathVariable String promptId,
            @Valid @RequestBody UpdatePromptRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Update prompt: {} by user: {}", promptId, userId);
        
        PromptResponse response = promptService.updatePrompt(promptId, request, userId);
        
        return ResponseEntity.ok(response);
    }
    
    // Delete prompt (authenticated, owner only)
    @DeleteMapping("/{promptId}")
    public ResponseEntity<Void> deletePrompt(
            @PathVariable String promptId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Delete prompt: {} by user: {}", promptId, userId);
        
        promptService.deletePrompt(promptId, userId);
        
        return ResponseEntity.noContent().build();
    }
    
    // Get prompt versions
    @GetMapping("/{promptId}/versions")
    public ResponseEntity<List<PromptVersion>> getPromptVersions(
            @PathVariable String promptId) {
        
        log.info("Get versions for prompt: {}", promptId);
        
        List<PromptVersion> versions = promptService.getPromptVersions(promptId);
        
        return ResponseEntity.ok(versions);
    }
}