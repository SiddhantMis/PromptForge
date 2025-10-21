package com.promptforge.prompt.service;

import com.promptforge.prompt.document.PromptVersion;
import com.promptforge.prompt.dto.CreatePromptRequest;
import com.promptforge.prompt.dto.PromptResponse;
import com.promptforge.prompt.dto.UpdatePromptRequest;
import com.promptforge.prompt.entity.Prompt;
import com.promptforge.prompt.repository.PromptRepository;
import com.promptforge.prompt.repository.PromptVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromptService {
    
    private final PromptRepository promptRepository;
    private final PromptVersionRepository promptVersionRepository;
    
    @Transactional
    public PromptResponse createPrompt(CreatePromptRequest request, String userId, String username) {
        log.info("Creating new prompt for user: {}", userId);
        
        // Create prompt entity
        Prompt prompt = Prompt.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .description(request.getDescription())
                .userId(userId)
                .username(username)
                .category(request.getCategory())
                .tags(request.getTags())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .model(request.getModel())
                .version("1.0.0")
                .build();
        
        prompt = promptRepository.save(prompt);
        
        // Save first version to MongoDB
        saveVersion(prompt, "Initial version");
        
        log.info("Prompt created with ID: {}", prompt.getId());
        
        return mapToResponse(prompt);
    }
    
    @Transactional(readOnly = true)
    public PromptResponse getPromptById(String promptId, String userId) {
        log.info("Fetching prompt by ID: {}", promptId);
        
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Check if user has access (public or owner)
        if (!prompt.getIsPublic() && !prompt.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        // Increment view count
        prompt.incrementViewCount();
        promptRepository.save(prompt);
        
        return mapToResponse(prompt);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getAllPrompts(Pageable pageable) {
        log.info("Fetching all public prompts");
        
        return promptRepository.findByIsPublicTrue(pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getUserPrompts(String userId, Pageable pageable) {
        log.info("Fetching prompts for user: {}", userId);
        
        return promptRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getPromptsByCategory(String category, Pageable pageable) {
        log.info("Fetching prompts by category: {}", category);
        
        return promptRepository.findByCategoryAndIsPublicTrue(category, pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> searchPrompts(String keyword, Boolean isPublic, Pageable pageable) {
        log.info("Searching prompts with keyword: {}", keyword);
        
        return promptRepository.searchPrompts(keyword, isPublic, pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getPromptsByTag(String tag, Pageable pageable) {
        log.info("Fetching prompts by tag: {}", tag);
        
        return promptRepository.findByTag(tag.toLowerCase(), pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getTrendingPrompts(Pageable pageable) {
        log.info("Fetching trending prompts");
        
        return promptRepository.findByIsPublicTrueOrderByViewCountDesc(pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PromptResponse> getTopRatedPrompts(Pageable pageable) {
        log.info("Fetching top rated prompts");
        
        return promptRepository.findByIsPublicTrueOrderByRatingDesc(pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional
    public PromptResponse updatePrompt(String promptId, UpdatePromptRequest request, String userId) {
        log.info("Updating prompt: {}", promptId);
        
        // Find and validate ownership
        Prompt prompt = promptRepository.findByIdAndUserId(promptId, userId)
                .orElseThrow(() -> new RuntimeException("Prompt not found or access denied"));
        
        // Track if content changed (for versioning)
        boolean contentChanged = false;
        
        // Update fields
        if (request.getTitle() != null) {
            prompt.setTitle(request.getTitle());
        }
        
        if (request.getContent() != null && !request.getContent().equals(prompt.getContent())) {
            prompt.setContent(request.getContent());
            contentChanged = true;
        }
        
        if (request.getDescription() != null) {
            prompt.setDescription(request.getDescription());
        }
        
        if (request.getCategory() != null) {
            prompt.setCategory(request.getCategory());
        }
        
        if (request.getTags() != null) {
            prompt.setTags(request.getTags());
        }
        
        if (request.getIsPublic() != null) {
            prompt.setIsPublic(request.getIsPublic());
        }
        
        if (request.getModel() != null) {
            prompt.setModel(request.getModel());
        }
        
        // If content changed, create new version
        if (contentChanged) {
            String newVersion = incrementVersion(prompt.getVersion());
            prompt.setVersion(newVersion);
            saveVersion(prompt, request.getChangeLog() != null ? request.getChangeLog() : "Updated prompt");
        }
        
        prompt = promptRepository.save(prompt);
        
        log.info("Prompt updated: {}", promptId);
        
        return mapToResponse(prompt);
    }
    
    @Transactional
    public void deletePrompt(String promptId, String userId) {
        log.info("Deleting prompt: {}", promptId);
        
        // Find and validate ownership
        Prompt prompt = promptRepository.findByIdAndUserId(promptId, userId)
                .orElseThrow(() -> new RuntimeException("Prompt not found or access denied"));
        
        // Delete from PostgreSQL
        promptRepository.delete(prompt);
        
        // Note: Versions in MongoDB are kept for audit purposes
        
        log.info("Prompt deleted: {}", promptId);
    }
    
    @Transactional(readOnly = true)
    public List<PromptVersion> getPromptVersions(String promptId) {
        log.info("Fetching versions for prompt: {}", promptId);
        
        return promptVersionRepository.findByPromptIdOrderByCreatedAtDesc(promptId);
    }
    
    // Helper methods
    
    private void saveVersion(Prompt prompt, String changeLog) {
        PromptVersion version = PromptVersion.builder()
                .promptId(prompt.getId())
                .version(prompt.getVersion())
                .content(prompt.getContent())
                .title(prompt.getTitle())
                .description(prompt.getDescription())
                .userId(prompt.getUserId())
                .username(prompt.getUsername())
                .changeLog(changeLog)
                .createdAt(LocalDateTime.now())
                .metadata(new HashMap<>())
                .build();
        
        promptVersionRepository.save(version);
        
        log.info("Version {} saved for prompt: {}", prompt.getVersion(), prompt.getId());
    }
    
    private String incrementVersion(String currentVersion) {
        String[] parts = currentVersion.split("\\.");
        int major = Integer.parseInt(parts[0]);
        int minor = Integer.parseInt(parts[1]);
        int patch = Integer.parseInt(parts[2]);
        
        // Increment patch version
        patch++;
        
        return major + "." + minor + "." + patch;
    }
    
    private PromptResponse mapToResponse(Prompt prompt) {
        return PromptResponse.builder()
                .id(prompt.getId())
                .title(prompt.getTitle())
                .content(prompt.getContent())
                .description(prompt.getDescription())
                .userId(prompt.getUserId())
                .username(prompt.getUsername())
                .category(prompt.getCategory())
                .tags(prompt.getTags())
                .isPublic(prompt.getIsPublic())
                .isFeatured(prompt.getIsFeatured())
                .viewCount(prompt.getViewCount())
                .forkCount(prompt.getForkCount())
                .likeCount(prompt.getLikeCount())
                .rating(prompt.getRating())
                .ratingCount(prompt.getRatingCount())
                .model(prompt.getModel())
                .version(prompt.getVersion())
                .createdAt(prompt.getCreatedAt())
                .updatedAt(prompt.getUpdatedAt())
                .build();
    }
}