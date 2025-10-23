package com.promptforge.prompt.repository;

import com.promptforge.prompt.entity.PromptComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing prompt comments.
 */
@Repository
public interface PromptCommentRepository extends JpaRepository<PromptComment, String> {
    
    /**
     * Finds all comments for a specific prompt, ordered by creation date (newest first).
     */
    List<PromptComment> findByPromptIdOrderByCreatedAtDesc(String promptId);
    
    /**
     * Finds all comments by a specific user.
     */
    List<PromptComment> findByUserId(String userId);
    
    /**
     * Counts the number of comments for a prompt.
     */
    Long countByPromptId(String promptId);
}

