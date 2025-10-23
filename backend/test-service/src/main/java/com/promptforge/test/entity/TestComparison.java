package com.promptforge.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "test_comparisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestComparison {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String promptId;
    
    @Column(nullable = false)
    private String userId;
    
    @ElementCollection
    @CollectionTable(name = "comparison_test_ids", joinColumns = @JoinColumn(name = "comparison_id"))
    @Column(name = "test_id")
    private List<String> testIds;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}