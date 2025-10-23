package com.promptforge.prompt.repository;

import com.promptforge.prompt.entity.PromptRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing prompt ratings.
 */
@Repository
public interface PromptRatingRepository extends JpaRepository<PromptRating, String> {
    
    /**
     * Finds all ratings for a specific prompt.
     */
    List<PromptRating> findByPromptId(String promptId);
    
    /**
     * Finds all ratings by a specific user.
     */
    List<PromptRating> findByUserId(String userId);
    
    /**
     * Checks if a user has already rated a prompt.
     */
    boolean existsByPromptIdAndUserId(String promptId, String userId);
    
    /**
     * Finds a rating by prompt and user.
     */
    Optional<PromptRating> findByPromptIdAndUserId(String promptId, String userId);
    
    /**
     * Calculates the average rating for a prompt.
     */
    @Query("SELECT AVG(r.rating) FROM PromptRating r WHERE r.promptId = :promptId")
    Double calculateAverageRating(@Param("promptId") String promptId);
    
    /**
     * Counts the number of ratings for a prompt.
     */
    Long countByPromptId(String promptId);
}

