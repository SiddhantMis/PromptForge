package com.promptforge.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private String id;
    
    private String username;
    
    private String email;
    
    private String firstName;
    
    private String lastName;
    
    private String bio;
    
    private String avatarUrl;
    
    private Set<String> roles;
    
    private Boolean active;
    
    private Boolean emailVerified;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLoginAt;
}