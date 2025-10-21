package com.promptforge.user.controller;

import com.promptforge.user.dto.UserResponse;
import com.promptforge.user.security.UserDetailsImpl;
import com.promptforge.user.service.UserService;
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
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Fetching current user: {}", userDetails.getEmail());
        
        UserResponse user = userService.getCurrentUser(userDetails.getEmail());
        
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String userId) {
        log.info("Fetching user by ID: {}", userId);
        
        UserResponse user = userService.getUserById(userId);
        
        return ResponseEntity.ok(user);
    }
}