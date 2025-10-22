package com.promptforge.analytics.controller;

import com.promptforge.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOverallStats() {
        log.info("Fetching overall analytics stats");
        return ResponseEntity.ok(analyticsService.getOverallStats());
    }
    
    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingPrompts(
            @RequestParam(defaultValue = "7") int days) {
        log.info("Fetching trending prompts for last {} days", days);
        return ResponseEntity.ok(analyticsService.getTrendingPrompts(days));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Analytics Service is UP");
    }
}