package com.promptforge.user.controller;

import com.promptforge.user.dto.UserResponse;
import com.promptforge.user.security.UserDetailsImpl;
import com.promptforge.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Users", description = "User profile and management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {
    
    private final UserService userService;
    
    @Operation(
            summary = "Get current user profile",
            description = "Retrieves the profile of the authenticated user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        log.info("Fetching current user: {}", userDetails.getEmail());
        UserResponse user = userService.getCurrentUser(userDetails.getEmail());
        return ResponseEntity.ok(user);
    }
    
    @Operation(
            summary = "Get user by ID",
            description = "Retrieves a user's public profile by their ID"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User found",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUserById(
            @Parameter(description = "User ID") @PathVariable String userId) {
        
        log.info("Fetching user by ID: {}", userId);
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @Operation(
            summary = "Follow a user",
            description = "Creates a follow relationship with another user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Successfully followed user"
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request (self-follow, already following, etc.)"),
            @ApiResponse(responseCode = "404", description = "User to follow not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/follow/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> followUser(
            @Parameter(description = "User ID to follow") @PathVariable String userId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        log.info("User {} attempting to follow user {}", userDetails.getId(), userId);
        
        try {
            userService.followUser(userDetails.getId(), userId);
            return ResponseEntity.status(201).body(java.util.Map.of(
                    "message", "Successfully followed user",
                    "followingId", userId
            ));
        } catch (RuntimeException e) {
            log.error("Error following user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(
            summary = "Unfollow a user",
            description = "Removes a follow relationship with another user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully unfollowed user"
            ),
            @ApiResponse(responseCode = "400", description = "Not following this user"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @DeleteMapping("/follow/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unfollowUser(
            @Parameter(description = "User ID to unfollow") @PathVariable String userId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        log.info("User {} attempting to unfollow user {}", userDetails.getId(), userId);
        
        try {
            userService.unfollowUser(userDetails.getId(), userId);
            return ResponseEntity.ok(java.util.Map.of("message", "Successfully unfollowed user"));
        } catch (RuntimeException e) {
            log.error("Error unfollowing user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(
            summary = "Get user followers",
            description = "Retrieves the list of users following a specific user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Followers retrieved successfully"
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/followers/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFollowers(
            @Parameter(description = "User ID") @PathVariable String userId) {
        
        log.info("Fetching followers for user {}", userId);
        var followers = userService.getFollowers(userId);
        return ResponseEntity.ok(java.util.Map.of(
                "userId", userId,
                "followers", followers,
                "count", followers.size()
        ));
    }
    
    @Operation(
            summary = "Get users being followed",
            description = "Retrieves the list of users that a specific user is following"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Following list retrieved successfully"
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/following/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFollowing(
            @Parameter(description = "User ID") @PathVariable String userId) {
        
        log.info("Fetching following list for user {}", userId);
        var following = userService.getFollowing(userId);
        return ResponseEntity.ok(java.util.Map.of(
                "userId", userId,
                "following", following,
                "count", following.size()
        ));
    }
    
    @Operation(
            summary = "Get follow statistics",
            description = "Retrieves follower and following counts for a user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully"
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/stats/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFollowStats(
            @Parameter(description = "User ID") @PathVariable String userId) {
        
        log.info("Fetching follow stats for user {}", userId);
        var stats = userService.getFollowStats(userId);
        stats.put("userId", Long.valueOf(userId.hashCode())); // Add userId to response
        return ResponseEntity.ok(stats);
    }
    
    @Operation(
            summary = "Check follow status",
            description = "Checks if the authenticated user is following another user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Follow status retrieved"
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/following/{userId}/check")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkFollowStatus(
            @Parameter(description = "User ID to check") @PathVariable String userId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        log.info("Checking if user {} is following user {}", userDetails.getId(), userId);
        boolean isFollowing = userService.isFollowing(userDetails.getId(), userId);
        return ResponseEntity.ok(java.util.Map.of(
                "isFollowing", isFollowing,
                "followerId", userDetails.getId(),
                "followingId", userId
        ));
    }
}