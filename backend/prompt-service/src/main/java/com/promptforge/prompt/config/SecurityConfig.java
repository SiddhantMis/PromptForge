package com.promptforge.prompt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no authentication)
                        .requestMatchers("/health", "/actuator/**").permitAll()
                        .requestMatchers("/prompts/public/**").permitAll()
                        .requestMatchers("/prompts/search/**").permitAll()
                        .requestMatchers("/prompts/category/**").permitAll()
                        .requestMatchers("/prompts/tag/**").permitAll()
                        .requestMatchers("/prompts/trending/**").permitAll()
                        .requestMatchers("/prompts/top-rated/**").permitAll()
                        .requestMatchers("/prompts/*/versions").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().permitAll() // TEMP: Allow all for testing
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        
        return http.build();
    }
}