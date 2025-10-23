package com.promptforge.prompt.controller;

import com.promptforge.prompt.dto.*;
import com.promptforge.prompt.entity.PromptLike;
import com.promptforge.prompt.service.SocialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for social features on prompts.
 * Provides endpoints for likes, ratings, and comments.
 */
@Slf4j
@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@Tag(name = "Social Controller", description = "APIs for prompt social features")
public class SocialController {
    
    private final SocialService socialService;
    
    /**
     * Likes a prompt.
     */
    @PostMapping("/likes")
    @Operation(summary = "Like a prompt", description = "Adds a like to a prompt")
    public ResponseEntity<Map<String, Object>> likePrompt(
            @Valid @RequestBody LikeRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId) {
        
        log.info("Received like request from user: {}", userId);
        
        try {
            PromptLike like = socialService.likePrompt(userId, request.getPromptId());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Prompt liked successfully",
                    "likeId", like.getId(),
                    "promptId", like.getPromptId()
            ));
        } catch (RuntimeException e) {
            log.error("Error liking prompt: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Unlikes a prompt.
     */
    @DeleteMapping("/likes/{promptId}")
    @Operation(summary = "Unlike a prompt", description = "Removes a like from a prompt")
    public ResponseEntity<Map<String, String>> unlikePrompt(
            @PathVariable String promptId,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId) {
        
        log.info("Received unlike request from user: {} for prompt: {}", userId, promptId);
        
        try {
            socialService.unlikePrompt(userId, promptId);
            return ResponseEntity.ok(Map.of("message", "Prompt unliked successfully"));
        } catch (RuntimeException e) {
            log.error("Error unliking prompt: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Rates a prompt.
     */
    @PostMapping("/ratings")
    @Operation(summary = "Rate a prompt", description = "Adds a rating to a prompt")
    public ResponseEntity<?> ratePrompt(
            @Valid @RequestBody RatingRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId) {
        
        log.info("Received rating request from user: {} for prompt: {}", userId, request.getPromptId());
        
        try {
            RatingResponse response = socialService.ratePrompt(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error rating prompt: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Gets the average rating for a prompt.
     */
    @GetMapping("/ratings/{promptId}")
    @Operation(summary = "Get prompt rating", description = "Retrieves the average rating for a prompt")
    public ResponseEntity<Map<String, Object>> getPromptRating(@PathVariable String promptId) {
        log.info("Fetching rating for prompt: {}", promptId);
        
        Double averageRating = socialService.getPromptRating(promptId);
        return ResponseEntity.ok(Map.of(
                "promptId", promptId,
                "averageRating", averageRating
        ));
    }
    
    /**
     * Gets all ratings for a prompt.
     */
    @GetMapping("/ratings/{promptId}/all")
    @Operation(summary = "Get all ratings for a prompt", description = "Retrieves all ratings with reviews")
    public ResponseEntity<List<RatingResponse>> getAllPromptRatings(@PathVariable String promptId) {
        log.info("Fetching all ratings for prompt: {}", promptId);
        
        List<RatingResponse> ratings = socialService.getPromptRatings(promptId);
        return ResponseEntity.ok(ratings);
    }
    
    /**
     * Adds a comment to a prompt.
     */
    @PostMapping("/comments")
    @Operation(summary = "Add a comment", description = "Adds a comment to a prompt")
    public ResponseEntity<?> addComment(
            @Valid @RequestBody CommentRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId,
            @RequestHeader(value = "X-Username", defaultValue = "Anonymous") String username) {
        
        log.info("Received comment request from user: {} for prompt: {}", userId, request.getPromptId());
        
        try {
            CommentResponse response = socialService.addComment(userId, username, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error adding comment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Gets all comments for a prompt.
     */
    @GetMapping("/comments/{promptId}")
    @Operation(summary = "Get prompt comments", description = "Retrieves all comments for a prompt")
    public ResponseEntity<List<CommentResponse>> getPromptComments(@PathVariable String promptId) {
        log.info("Fetching comments for prompt: {}", promptId);
        
        List<CommentResponse> comments = socialService.getPromptComments(promptId);
        return ResponseEntity.ok(comments);
    }
    
    /**
     * Gets social statistics for a prompt.
     */
    @GetMapping("/stats/{promptId}")
    @Operation(summary = "Get prompt social stats", description = "Retrieves likes, ratings, and comment counts")
    public ResponseEntity<PromptStatsResponse> getPromptStats(@PathVariable String promptId) {
        log.info("Fetching social stats for prompt: {}", promptId);
        
        PromptStatsResponse stats = socialService.getPromptStats(promptId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Checks if current user has liked a prompt.
     */
    @GetMapping("/likes/{promptId}/check")
    @Operation(summary = "Check if user liked prompt", description = "Checks if the current user has liked a prompt")
    public ResponseEntity<Map<String, Boolean>> checkUserLike(
            @PathVariable String promptId,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-user") String userId) {
        
        log.info("Checking if user {} liked prompt {}", userId, promptId);
        
        boolean hasLiked = socialService.hasUserLikedPrompt(userId, promptId);
        return ResponseEntity.ok(Map.of("hasLiked", hasLiked));
    }
}

