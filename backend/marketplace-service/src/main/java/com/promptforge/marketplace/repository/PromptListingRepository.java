package com.promptforge.marketplace.repository;

import com.promptforge.marketplace.entity.ListingStatus;
import com.promptforge.marketplace.entity.PromptListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing prompt listings in the marketplace.
 */
@Repository
public interface PromptListingRepository extends JpaRepository<PromptListing, String> {
    
    /**
     * Finds all listings with a specific status.
     */
    List<PromptListing> findByStatusOrderByCreatedAtDesc(ListingStatus status);
    
    /**
     * Finds all listings by a specific seller.
     */
    List<PromptListing> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    
    /**
     * Finds all active listings.
     */
    List<PromptListing> findByStatus(ListingStatus status);
}

