package com.promptforge.user.service;

import com.promptforge.user.dto.AuthResponse;
import com.promptforge.user.dto.LoginRequest;
import com.promptforge.user.dto.RegisterRequest;
import com.promptforge.user.dto.UserResponse;
import com.promptforge.user.entity.User;
import com.promptforge.user.repository.UserRepository;
import com.promptforge.user.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        
        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .active(true)
                .emailVerified(false)
                .build();
        
        // Add default role
        user.addRole("USER");
        
        // Save user
        user = userRepository.save(user);
        
        log.info("User registered successfully with ID: {}", user.getId());
        
        // Generate tokens
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());
        
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), claims);
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getId());
        
        // Build response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration() / 1000) // Convert to seconds
                .user(mapToUserResponse(user))
                .build();
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt with email: {}", request.getEmail());
        
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Get user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User logged in successfully with ID: {}", user.getId());
        
        // Generate tokens
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());
        
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), claims);
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getId());
        
        // Build response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration() / 1000)
                .user(mapToUserResponse(user))
                .build();
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