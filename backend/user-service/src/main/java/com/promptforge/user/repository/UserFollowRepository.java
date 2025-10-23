package com.promptforge.user.repository;

import com.promptforge.user.entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing user follow relationships.
 */
@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, String> {
    
    /**
     * Finds all users that a specific user is following.
     */
    List<UserFollow> findByFollowerId(String followerId);
    
    /**
     * Finds all followers of a specific user.
     */
    List<UserFollow> findByFollowingId(String followingId);
    
    /**
     * Checks if a follow relationship exists.
     */
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
    
    /**
     * Finds a specific follow relationship.
     */
    Optional<UserFollow> findByFollowerIdAndFollowingId(String followerId, String followingId);
    
    /**
     * Deletes a follow relationship.
     */
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
    
    /**
     * Counts how many users a specific user is following.
     */
    Long countByFollowerId(String followerId);
    
    /**
     * Counts how many followers a specific user has.
     */
    Long countByFollowingId(String followingId);
}

