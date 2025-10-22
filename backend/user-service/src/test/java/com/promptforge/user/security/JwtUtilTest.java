package com.promptforge.user.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtUtil Tests")
class JwtUtilTest {
    
    private JwtUtil jwtUtil;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final Long testExpiration = 3600000L; // 1 hour
    
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", testSecret);
        ReflectionTestUtils.setField(jwtUtil, "accessTokenExpiration", testExpiration);
        ReflectionTestUtils.setField(jwtUtil, "refreshTokenExpiration", 86400000L);
    }
    
    @Test
    @DisplayName("Should generate valid access token")
    void shouldGenerateValidAccessToken() {
        // Given
        String email = "test@example.com";
        String userId = "user-123";
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", "USER");
        
        // When
        String token = jwtUtil.generateAccessToken(email, userId, claims);
        
        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        
        String extractedEmail = jwtUtil.extractUsername(token);
        String extractedUserId = jwtUtil.extractUserId(token);
        
        assertThat(extractedEmail).isEqualTo(email);
        assertThat(extractedUserId).isEqualTo(userId);
    }
    
    @Test
    @DisplayName("Should generate valid refresh token")
    void shouldGenerateValidRefreshToken() {
        // Given
        String email = "test@example.com";
        String userId = "user-123";
        
        // When
        String token = jwtUtil.generateRefreshToken(email, userId);
        
        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        
        String extractedEmail = jwtUtil.extractUsername(token);
        String extractedUserId = jwtUtil.extractUserId(token);
        
        assertThat(extractedEmail).isEqualTo(email);
        assertThat(extractedUserId).isEqualTo(userId);
    }
    
    @Test
    @DisplayName("Should extract username from token")
    void shouldExtractUsername() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateAccessToken(email, "user-123", new HashMap<>());
        
        // When
        String extractedEmail = jwtUtil.extractUsername(token);
        
        // Then
        assertThat(extractedEmail).isEqualTo(email);
    }
    
    @Test
    @DisplayName("Should extract user ID from token")
    void shouldExtractUserId() {
        // Given
        String userId = "user-123";
        String token = jwtUtil.generateAccessToken("test@example.com", userId, new HashMap<>());
        
        // When
        String extractedUserId = jwtUtil.extractUserId(token);
        
        // Then
        assertThat(extractedUserId).isEqualTo(userId);
    }
    
    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateToken() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateAccessToken(email, "user-123", new HashMap<>());
        UserDetails userDetails = User.builder()
                .username(email)
                .password("password")
                .roles("USER")
                .build();
        
        // When
        Boolean isValid = jwtUtil.validateToken(token, userDetails);
        
        // Then
        assertThat(isValid).isTrue();
    }
    
    @Test
    @DisplayName("Should invalidate token with wrong username")
    void shouldInvalidateTokenWithWrongUsername() {
        // Given
        String token = jwtUtil.generateAccessToken("test@example.com", "user-123", new HashMap<>());
        UserDetails userDetails = User.builder()
                .username("different@example.com")
                .password("password")
                .roles("USER")
                .build();
        
        // When
        Boolean isValid = jwtUtil.validateToken(token, userDetails);
        
        // Then
        assertThat(isValid).isFalse();
    }
    
    @Test
    @DisplayName("Should extract expiration date")
    void shouldExtractExpiration() {
        // Given
        String token = jwtUtil.generateAccessToken("test@example.com", "user-123", new HashMap<>());
        
        // When
        Date expiration = jwtUtil.extractExpiration(token);
        
        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(new Date());
    }
}