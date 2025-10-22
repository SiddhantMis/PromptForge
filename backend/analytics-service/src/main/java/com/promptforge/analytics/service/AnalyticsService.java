package com.promptforge.analytics.service;

import com.promptforge.analytics.repository.PromptActivityEventRepository;
import com.promptforge.analytics.repository.UserActivityEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {
    
    private final UserActivityEventRepository userActivityRepo;
    private final PromptActivityEventRepository promptActivityRepo;
    
    public Map<String, Object> getOverallStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalUserEvents", userActivityRepo.count());
        stats.put("totalPromptEvents", promptActivityRepo.count());
        
        // Last 24 hours
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        stats.put("newUsersLast24h", userActivityRepo.countByEventTypeSince("REGISTERED", last24Hours));
        stats.put("promptsCreatedLast24h", promptActivityRepo.countByEventTypeSince("CREATED", last24Hours));
        stats.put("promptViewsLast24h", promptActivityRepo.countByEventTypeSince("VIEWED", last24Hours));
        
        // Last 7 days
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        stats.put("newUsersLast7d", userActivityRepo.countByEventTypeSince("REGISTERED", last7Days));
        stats.put("promptsCreatedLast7d", promptActivityRepo.countByEventTypeSince("CREATED", last7Days));
        stats.put("promptViewsLast7d", promptActivityRepo.countByEventTypeSince("VIEWED", last7Days));
        
        log.info("Generated overall analytics stats");
        return stats;
    }
    
    public Map<String, Object> getTrendingPrompts(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        
        Map<String, Object> result = new HashMap<>();
        result.put("period", days + " days");
        result.put("trending", promptActivityRepo.findTrendingPromptsSince(since));
        
        log.info("Retrieved trending prompts for last {} days", days);
        return result;
    }
}