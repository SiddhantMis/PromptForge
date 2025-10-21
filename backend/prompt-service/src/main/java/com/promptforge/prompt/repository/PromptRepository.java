package com.promptforge.prompt.repository;

import com.promptforge.prompt.entity.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, String> {
    
    // Find by user
    Page<Prompt> findByUserId(String userId, Pageable pageable);
    
    // Find public prompts
    Page<Prompt> findByIsPublicTrue(Pageable pageable);
    
    // Find by category
    Page<Prompt> findByCategory(String category, Pageable pageable);
    
    // Find by category and public
    Page<Prompt> findByCategoryAndIsPublicTrue(String category, Pageable pageable);
    
    // Find featured prompts
    Page<Prompt> findByIsFeaturedTrueAndIsPublicTrue(Pageable pageable);
    
    // Search by title or description
    @Query("SELECT p FROM Prompt p WHERE " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:isPublic IS NULL OR p.isPublic = :isPublic)")
    Page<Prompt> searchPrompts(@Param("keyword") String keyword, 
                                @Param("isPublic") Boolean isPublic, 
                                Pageable pageable);
    
    // Find by tag
    @Query("SELECT DISTINCT p FROM Prompt p JOIN p.tags t WHERE t = :tag AND p.isPublic = true")
    Page<Prompt> findByTag(@Param("tag") String tag, Pageable pageable);
    
    // Check if user owns prompt
    Optional<Prompt> findByIdAndUserId(String id, String userId);
    
    // Get trending prompts (by view count)
    Page<Prompt> findByIsPublicTrueOrderByViewCountDesc(Pageable pageable);
    
    // Get top rated prompts
    Page<Prompt> findByIsPublicTrueOrderByRatingDesc(Pageable pageable);
}