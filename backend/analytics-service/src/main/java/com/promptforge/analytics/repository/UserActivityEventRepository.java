package com.promptforge.analytics.repository;

import com.promptforge.analytics.entity.UserActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserActivityEventRepository extends JpaRepository<UserActivityEvent, String> {
    
    List<UserActivityEvent> findByUserIdOrderByEventTimeDesc(String userId);
    
    @Query("SELECT COUNT(u) FROM UserActivityEvent u WHERE u.eventType = :eventType AND u.eventTime >= :since")
    Long countByEventTypeSince(@Param("eventType") String eventType, @Param("since") LocalDateTime since);
}