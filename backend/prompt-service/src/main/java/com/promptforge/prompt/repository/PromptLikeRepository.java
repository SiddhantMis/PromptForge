package com.promptforge.prompt.repository;

import com.promptforge.prompt.entity.PromptLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing prompt likes.
 */
@Repository
public interface PromptLikeRepository extends JpaRepository<PromptLike, String> {
    
    /**
     * Counts the number of likes for a specific prompt.
     */
    Long countByPromptId(String promptId);
    
    /**
     * Checks if a user has already liked a prompt.
     */
    boolean existsByPromptIdAndUserId(String promptId, String userId);
    
    /**
     * Finds a like by prompt and user.
     */
    Optional<PromptLike> findByPromptIdAndUserId(String promptId, String userId);
    
    /**
     * Deletes a like by prompt and user.
     */
    void deleteByPromptIdAndUserId(String promptId, String userId);
    
    /**
     * Finds all likes by a specific user.
     */
    List<PromptLike> findByUserId(String userId);
    
    /**
     * Finds all likes for a specific prompt.
     */
    List<PromptLike> findByPromptId(String promptId);
}

