package com.promptforge.marketplace.controller;

import com.promptforge.marketplace.dto.*;
import com.promptforge.marketplace.service.MarketplaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for marketplace operations.
 * Provides endpoints for listing prompts, purchasing, and managing transactions.
 */
@Slf4j
@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
@Tag(name = "Marketplace Controller", description = "APIs for marketplace operations")
public class MarketplaceController {
    
    private final MarketplaceService marketplaceService;
    
    /**
     * Creates a new prompt listing.
     */
    @PostMapping("/listings")
    @Operation(summary = "Create a new listing", description = "Creates a new prompt listing in the marketplace")
    public ResponseEntity<ListingResponse> createListing(
            @RequestBody CreateListingRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-seller") String sellerId) {
        
        log.info("Received listing creation request from seller: {}", sellerId);
        
        try {
            ListingResponse response = marketplaceService.createListing(request, sellerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating listing", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Retrieves all active listings.
     */
    @GetMapping("/listings")
    @Operation(summary = "Get all active listings", description = "Retrieves all active prompt listings")
    public ResponseEntity<List<ListingResponse>> getActiveListings() {
        log.info("Fetching all active listings");
        
        List<ListingResponse> listings = marketplaceService.getActiveListings();
        return ResponseEntity.ok(listings);
    }
    
    /**
     * Retrieves a listing by its ID.
     */
    @GetMapping("/listings/{id}")
    @Operation(summary = "Get listing by ID", description = "Retrieves a specific listing by its ID")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable String id) {
        log.info("Fetching listing with ID: {}", id);
        
        return marketplaceService.getListingById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Listing not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    /**
     * Retrieves all listings for a specific seller.
     */
    @GetMapping("/listings/seller/{sellerId}")
    @Operation(summary = "Get listings by seller", description = "Retrieves all listings for a specific seller")
    public ResponseEntity<List<ListingResponse>> getListingsBySeller(@PathVariable String sellerId) {
        log.info("Fetching listings for seller: {}", sellerId);
        
        List<ListingResponse> listings = marketplaceService.getListingsBySeller(sellerId);
        return ResponseEntity.ok(listings);
    }
    
    /**
     * Processes a prompt purchase.
     */
    @PostMapping("/purchase")
    @Operation(summary = "Purchase a prompt", description = "Processes the purchase of a prompt listing")
    public ResponseEntity<TransactionResponse> purchasePrompt(
            @RequestBody PurchaseRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "test-buyer") String buyerId) {
        
        log.info("Received purchase request from buyer: {}", buyerId);
        
        try {
            TransactionResponse response = marketplaceService.purchasePrompt(request, buyerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error processing purchase: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error processing purchase", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Retrieves all transactions for a buyer.
     */
    @GetMapping("/transactions/buyer/{userId}")
    @Operation(summary = "Get buyer transactions", description = "Retrieves all transactions for a specific buyer")
    public ResponseEntity<List<TransactionResponse>> getBuyerTransactions(@PathVariable String userId) {
        log.info("Fetching transactions for buyer: {}", userId);
        
        List<TransactionResponse> transactions = marketplaceService.getBuyerTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Retrieves all transactions for a seller.
     */
    @GetMapping("/transactions/seller/{userId}")
    @Operation(summary = "Get seller transactions", description = "Retrieves all transactions for a specific seller")
    public ResponseEntity<List<TransactionResponse>> getSellerTransactions(@PathVariable String userId) {
        log.info("Fetching transactions for seller: {}", userId);
        
        List<TransactionResponse> transactions = marketplaceService.getSellerTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Retrieves revenue information for a seller.
     */
    @GetMapping("/revenue/{sellerId}")
    @Operation(summary = "Get seller revenue", description = "Retrieves total revenue and sales count for a seller")
    public ResponseEntity<RevenueResponse> getSellerRevenue(@PathVariable String sellerId) {
        log.info("Fetching revenue for seller: {}", sellerId);
        
        RevenueResponse revenue = marketplaceService.getUserRevenue(sellerId);
        return ResponseEntity.ok(revenue);
    }
}

