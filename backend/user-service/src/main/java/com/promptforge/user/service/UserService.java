package com.promptforge.user.service;

import com.promptforge.user.dto.UserResponse;
import com.promptforge.user.entity.User;
import com.promptforge.user.entity.UserFollow;
import com.promptforge.user.repository.UserFollowRepository;
import com.promptforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        log.info("Fetching current user with email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToUserResponse(user);
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserById(String userId) {
        log.info("Fetching user by ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToUserResponse(user);
    }
    
    /**
     * Follows a user.
     * Creates a follow relationship from follower to following.
     *
     * @param followerId The ID of the user who is following
     * @param followingId The ID of the user being followed
     * @return The created follow relationship
     */
    @Transactional
    public UserFollow followUser(String followerId, String followingId) {
        log.info("User {} attempting to follow user {}", followerId, followingId);
        
        // Prevent self-follow
        if (followerId.equals(followingId)) {
            log.warn("User {} attempted to follow themselves", followerId);
            throw new RuntimeException("You cannot follow yourself");
        }
        
        // Check if following user exists
        userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        
        // Check if already following
        if (userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            log.warn("User {} is already following user {}", followerId, followingId);
            throw new RuntimeException("You are already following this user");
        }
        
        // Create follow relationship
        UserFollow follow = UserFollow.builder()
                .followerId(followerId)
                .followingId(followingId)
                .build();
        
        follow = userFollowRepository.save(follow);
        log.info("User {} successfully followed user {}", followerId, followingId);
        
        return follow;
    }
    
    /**
     * Unfollows a user.
     * Removes the follow relationship.
     *
     * @param followerId The ID of the user who is unfollowing
     * @param followingId The ID of the user being unfollowed
     */
    @Transactional
    public void unfollowUser(String followerId, String followingId) {
        log.info("User {} attempting to unfollow user {}", followerId, followingId);
        
        // Check if follow relationship exists
        if (!userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            log.warn("User {} is not following user {}", followerId, followingId);
            throw new RuntimeException("You are not following this user");
        }
        
        // Delete follow relationship
        userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
        log.info("User {} successfully unfollowed user {}", followerId, followingId);
    }
    
    /**
     * Gets all followers of a user.
     *
     * @param userId The ID of the user
     * @return List of follow relationships
     */
    @Transactional(readOnly = true)
    public List<UserFollow> getFollowers(String userId) {
        log.debug("Fetching followers for user {}", userId);
        return userFollowRepository.findByFollowingId(userId);
    }
    
    /**
     * Gets all users that a user is following.
     *
     * @param userId The ID of the user
     * @return List of follow relationships
     */
    @Transactional(readOnly = true)
    public List<UserFollow> getFollowing(String userId) {
        log.debug("Fetching following list for user {}", userId);
        return userFollowRepository.findByFollowerId(userId);
    }
    
    /**
     * Gets follow statistics for a user.
     *
     * @param userId The ID of the user
     * @return Map containing followers count and following count
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getFollowStats(String userId) {
        log.debug("Fetching follow stats for user {}", userId);
        
        Long followersCount = userFollowRepository.countByFollowingId(userId);
        Long followingCount = userFollowRepository.countByFollowerId(userId);
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("followersCount", followersCount);
        stats.put("followingCount", followingCount);
        
        return stats;
    }
    
    /**
     * Checks if one user is following another.
     *
     * @param followerId The ID of the potential follower
     * @param followingId The ID of the potential following
     * @return True if following, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isFollowing(String followerId, String followingId) {
        return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles())
                .active(user.getActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}