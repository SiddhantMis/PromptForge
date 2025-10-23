package com.promptforge.marketplace.repository;

import com.promptforge.marketplace.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing licenses.
 */
@Repository
public interface LicenseRepository extends JpaRepository<License, String> {
    
    /**
     * Finds all licenses for a buyer.
     */
    List<License> findByBuyerId(String buyerId);
    
    /**
     * Finds all licenses for a specific prompt.
     */
    List<License> findByPromptId(String promptId);
    
    /**
     * Finds an active license for a buyer and prompt.
     */
    Optional<License> findByBuyerIdAndPromptIdAndIsActiveTrue(String buyerId, String promptId);
    
    /**
     * Finds all active licenses for a buyer.
     */
    List<License> findByBuyerIdAndIsActiveTrue(String buyerId);
}

