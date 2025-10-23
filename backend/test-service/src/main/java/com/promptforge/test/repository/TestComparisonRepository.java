package com.promptforge.test.repository;

import com.promptforge.test.entity.TestComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestComparisonRepository extends JpaRepository<TestComparison, String> {
    
    List<TestComparison> findByPromptIdOrderByCreatedAtDesc(String promptId);
    
    List<TestComparison> findByUserIdOrderByCreatedAtDesc(String userId);
}