package com.promptforge.test.repository;

import com.promptforge.test.entity.PromptTest;
import com.promptforge.test.entity.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptTestRepository extends JpaRepository<PromptTest, String> {
    
    List<PromptTest> findByPromptIdOrderByCreatedAtDesc(String promptId);
    
    List<PromptTest> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<PromptTest> findByStatusOrderByCreatedAtDesc(TestStatus status);
    
    List<PromptTest> findByPromptIdAndUserId(String promptId, String userId);
}