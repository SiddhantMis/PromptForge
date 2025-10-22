package com.promptforge.analytics.repository;

import com.promptforge.analytics.entity.PromptActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromptActivityEventRepository extends JpaRepository<PromptActivityEvent, String> {
    
    List<PromptActivityEvent> findByPromptIdOrderByEventTimeDesc(String promptId);
    
    @Query("SELECT p.promptId, p.title, COUNT(p) as viewCount " +
           "FROM PromptActivityEvent p " +
           "WHERE p.eventType = 'VIEWED' AND p.eventTime >= :since " +
           "GROUP BY p.promptId, p.title " +
           "ORDER BY COUNT(p) DESC")
    List<Object[]> findTrendingPromptsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(p) FROM PromptActivityEvent p WHERE p.eventType = :eventType AND p.eventTime >= :since")
    Long countByEventTypeSince(@Param("eventType") String eventType, @Param("since") LocalDateTime since);
}