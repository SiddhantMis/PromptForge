package com.promptforge.prompt.service;

import com.promptforge.prompt.dto.*;
import com.promptforge.prompt.entity.Prompt;
import com.promptforge.prompt.entity.PromptComment;
import com.promptforge.prompt.entity.PromptLike;
import com.promptforge.prompt.entity.PromptRating;
import com.promptforge.prompt.repository.PromptCommentRepository;
import com.promptforge.prompt.repository.PromptLikeRepository;
import com.promptforge.prompt.repository.PromptRatingRepository;
import com.promptforge.prompt.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing social features on prompts.
 * Handles likes, ratings, and comments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SocialService {
    
    private final PromptLikeRepository likeRepository;
    private final PromptRatingRepository ratingRepository;
    private final PromptCommentRepository commentRepository;
    private final PromptRepository promptRepository;
    
    /**
     * Likes a prompt.
     * Increments the like count on the prompt and creates a like record.
     *
     * @param userId The ID of the user liking the prompt
     * @param promptId The ID of the prompt to like
     * @return The created like
     */
    @Transactional
    public PromptLike likePrompt(String userId, String promptId) {
        log.info("User {} liking prompt {}", userId, promptId);
        
        // Check if already liked
        if (likeRepository.existsByPromptIdAndUserId(promptId, userId)) {
            log.warn("User {} has already liked prompt {}", userId, promptId);
            throw new RuntimeException("You have already liked this prompt");
        }
        
        // Verify prompt exists
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Create like
        PromptLike like = PromptLike.builder()
                .promptId(promptId)
                .userId(userId)
                .build();
        
        like = likeRepository.save(like);
        
        // Update prompt like count
        prompt.incrementLikeCount();
        promptRepository.save(prompt);
        
        log.info("User {} successfully liked prompt {}", userId, promptId);
        return like;
    }
    
    /**
     * Unlikes a prompt.
     * Decrements the like count on the prompt and removes the like record.
     *
     * @param userId The ID of the user unliking the prompt
     * @param promptId The ID of the prompt to unlike
     */
    @Transactional
    public void unlikePrompt(String userId, String promptId) {
        log.info("User {} unliking prompt {}", userId, promptId);
        
        // Check if like exists
        if (!likeRepository.existsByPromptIdAndUserId(promptId, userId)) {
            log.warn("User {} has not liked prompt {}", userId, promptId);
            throw new RuntimeException("You have not liked this prompt");
        }
        
        // Delete like
        likeRepository.deleteByPromptIdAndUserId(promptId, userId);
        
        // Update prompt like count
        promptRepository.findById(promptId).ifPresent(prompt -> {
            prompt.decrementLikeCount();
            promptRepository.save(prompt);
        });
        
        log.info("User {} successfully unliked prompt {}", userId, promptId);
    }
    
    /**
     * Rates a prompt.
     * Updates the average rating on the prompt and creates/updates a rating record.
     *
     * @param userId The ID of the user rating the prompt
     * @param request The rating request
     * @return The created or updated rating
     */
    @Transactional
    public RatingResponse ratePrompt(String userId, RatingRequest request) {
        log.info("User {} rating prompt {} with score {}", userId, request.getPromptId(), request.getRating());
        
        // Verify prompt exists
        Prompt prompt = promptRepository.findById(request.getPromptId())
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Check if already rated
        if (ratingRepository.existsByPromptIdAndUserId(request.getPromptId(), userId)) {
            log.warn("User {} has already rated prompt {}", userId, request.getPromptId());
            throw new RuntimeException("You have already rated this prompt");
        }
        
        // Create rating
        PromptRating rating = PromptRating.builder()
                .promptId(request.getPromptId())
                .userId(userId)
                .rating(request.getRating())
                .review(request.getReview())
                .build();
        
        rating = ratingRepository.save(rating);
        
        // Update prompt rating
        prompt.updateRating(request.getRating());
        promptRepository.save(prompt);
        
        log.info("User {} successfully rated prompt {}", userId, request.getPromptId());
        
        return mapToRatingResponse(rating);
    }
    
    /**
     * Adds a comment to a prompt.
     *
     * @param userId The ID of the user commenting
     * @param username The username of the commenter
     * @param request The comment request
     * @return The created comment
     */
    @Transactional
    public CommentResponse addComment(String userId, String username, CommentRequest request) {
        log.info("User {} adding comment to prompt {}", userId, request.getPromptId());
        
        // Verify prompt exists
        promptRepository.findById(request.getPromptId())
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Create comment
        PromptComment comment = PromptComment.builder()
                .promptId(request.getPromptId())
                .userId(userId)
                .username(username)
                .content(request.getContent())
                .build();
        
        comment = commentRepository.save(comment);
        
        log.info("User {} successfully added comment to prompt {}", userId, request.getPromptId());
        
        return mapToCommentResponse(comment);
    }
    
    /**
     * Gets the total number of likes for a prompt.
     *
     * @param promptId The ID of the prompt
     * @return The like count
     */
    @Transactional(readOnly = true)
    public Long getPromptLikes(String promptId) {
        log.debug("Getting like count for prompt {}", promptId);
        return likeRepository.countByPromptId(promptId);
    }
    
    /**
     * Gets the average rating for a prompt.
     *
     * @param promptId The ID of the prompt
     * @return The average rating, or 0.0 if no ratings exist
     */
    @Transactional(readOnly = true)
    public Double getPromptRating(String promptId) {
        log.debug("Getting average rating for prompt {}", promptId);
        Double avgRating = ratingRepository.calculateAverageRating(promptId);
        return avgRating != null ? avgRating : 0.0;
    }
    
    /**
     * Gets all ratings for a prompt.
     *
     * @param promptId The ID of the prompt
     * @return List of ratings
     */
    @Transactional(readOnly = true)
    public List<RatingResponse> getPromptRatings(String promptId) {
        log.debug("Getting ratings for prompt {}", promptId);
        return ratingRepository.findByPromptId(promptId)
                .stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets all comments for a prompt.
     *
     * @param promptId The ID of the prompt
     * @return List of comments
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getPromptComments(String promptId) {
        log.debug("Getting comments for prompt {}", promptId);
        return commentRepository.findByPromptIdOrderByCreatedAtDesc(promptId)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets social statistics for a prompt.
     *
     * @param promptId The ID of the prompt
     * @return Social statistics
     */
    @Transactional(readOnly = true)
    public PromptStatsResponse getPromptStats(String promptId) {
        log.debug("Getting social stats for prompt {}", promptId);
        
        Long likeCount = likeRepository.countByPromptId(promptId);
        Long commentCount = commentRepository.countByPromptId(promptId);
        Long ratingCount = ratingRepository.countByPromptId(promptId);
        Double averageRating = ratingRepository.calculateAverageRating(promptId);
        
        return PromptStatsResponse.builder()
                .promptId(promptId)
                .likeCount(likeCount)
                .commentCount(commentCount)
                .ratingCount(ratingCount)
                .averageRating(averageRating != null ? averageRating : 0.0)
                .build();
    }
    
    /**
     * Checks if a user has liked a prompt.
     *
     * @param userId The user ID
     * @param promptId The prompt ID
     * @return True if liked, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean hasUserLikedPrompt(String userId, String promptId) {
        return likeRepository.existsByPromptIdAndUserId(promptId, userId);
    }
    
    /**
     * Maps a PromptComment entity to a CommentResponse DTO.
     */
    private CommentResponse mapToCommentResponse(PromptComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .promptId(comment.getPromptId())
                .userId(comment.getUserId())
                .username(comment.getUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
    
    /**
     * Maps a PromptRating entity to a RatingResponse DTO.
     */
    private RatingResponse mapToRatingResponse(PromptRating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .promptId(rating.getPromptId())
                .userId(rating.getUserId())
                .rating(rating.getRating())
                .review(rating.getReview())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}

