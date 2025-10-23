package com.promptforge.marketplace.service;

import com.promptforge.marketplace.dto.*;
import com.promptforge.marketplace.entity.*;
import com.promptforge.marketplace.repository.LicenseRepository;
import com.promptforge.marketplace.repository.PromptListingRepository;
import com.promptforge.marketplace.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing marketplace operations.
 * Handles listing creation, purchases, transactions, and licenses.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MarketplaceService {
    
    private final PromptListingRepository listingRepository;
    private final TransactionRepository transactionRepository;
    private final LicenseRepository licenseRepository;
    
    /**
     * Creates a new prompt listing.
     *
     * @param request The listing creation request
     * @param sellerId The ID of the seller
     * @return The created listing response
     */
    @Transactional
    public ListingResponse createListing(CreateListingRequest request, String sellerId) {
        log.info("Creating new listing for seller: {} with promptId: {}", sellerId, request.getPromptId());
        
        PromptListing listing = PromptListing.builder()
                .promptId(request.getPromptId())
                .sellerId(sellerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .status(ListingStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
        
        listing = listingRepository.save(listing);
        log.info("Listing created with ID: {}", listing.getId());
        
        return mapToListingResponse(listing);
    }
    
    /**
     * Retrieves all active listings.
     *
     * @return List of active listings
     */
    @Transactional(readOnly = true)
    public List<ListingResponse> getActiveListings() {
        log.debug("Fetching all active listings");
        return listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.ACTIVE)
                .stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves a listing by its ID.
     *
     * @param listingId The listing ID
     * @return Optional containing the listing if found
     */
    @Transactional(readOnly = true)
    public Optional<ListingResponse> getListingById(String listingId) {
        log.debug("Fetching listing by ID: {}", listingId);
        return listingRepository.findById(listingId)
                .map(this::mapToListingResponse);
    }
    
    /**
     * Retrieves all listings for a seller.
     *
     * @param sellerId The seller ID
     * @return List of seller's listings
     */
    @Transactional(readOnly = true)
    public List<ListingResponse> getListingsBySeller(String sellerId) {
        log.debug("Fetching listings for seller: {}", sellerId);
        return listingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Processes a prompt purchase.
     * Creates a transaction and generates a license upon successful purchase.
     *
     * @param request The purchase request
     * @param buyerId The ID of the buyer
     * @return The transaction response
     */
    @Transactional
    public TransactionResponse purchasePrompt(PurchaseRequest request, String buyerId) {
        log.info("Processing purchase for buyer: {} and listing: {}", buyerId, request.getListingId());
        
        // Find the listing
        PromptListing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> {
                    log.error("Listing not found: {}", request.getListingId());
                    return new RuntimeException("Listing not found");
                });
        
        // Check if listing is active
        if (listing.getStatus() != ListingStatus.ACTIVE) {
            log.error("Listing is not active: {}", request.getListingId());
            throw new RuntimeException("Listing is not available for purchase");
        }
        
        // Check if buyer already owns this prompt
        Optional<License> existingLicense = licenseRepository
                .findByBuyerIdAndPromptIdAndIsActiveTrue(buyerId, listing.getPromptId());
        if (existingLicense.isPresent()) {
            log.warn("Buyer {} already owns prompt {}", buyerId, listing.getPromptId());
            throw new RuntimeException("You already own this prompt");
        }
        
        // Create transaction
        Transaction transaction = Transaction.builder()
                .listingId(request.getListingId())
                .buyerId(buyerId)
                .sellerId(listing.getSellerId())
                .amount(listing.getPrice())
                .status(TransactionStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .createdAt(LocalDateTime.now())
                .build();
        
        try {
            // Simulate payment processing
            // In production, integrate with payment gateway
            log.info("Processing payment for transaction");
            
            // Update transaction status
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setCompletedAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);
            
            // Generate license
            License license = License.builder()
                    .transactionId(transaction.getId())
                    .promptId(listing.getPromptId())
                    .buyerId(buyerId)
                    .licenseType(request.getLicenseType())
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            licenseRepository.save(license);
            log.info("License generated for buyer: {} and prompt: {}", buyerId, listing.getPromptId());
            
            // Update listing status to SOLD
            listing.setStatus(ListingStatus.SOLD);
            listing.setUpdatedAt(LocalDateTime.now());
            listingRepository.save(listing);
            
            log.info("Purchase completed successfully. Transaction ID: {}", transaction.getId());
            
        } catch (Exception e) {
            log.error("Error processing purchase", e);
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(transaction);
            throw new RuntimeException("Purchase failed: " + e.getMessage());
        }
        
        return mapToTransactionResponse(transaction);
    }
    
    /**
     * Retrieves all transactions for a buyer.
     *
     * @param buyerId The buyer ID
     * @return List of buyer's transactions
     */
    @Transactional(readOnly = true)
    public List<TransactionResponse> getBuyerTransactions(String buyerId) {
        log.debug("Fetching transactions for buyer: {}", buyerId);
        return transactionRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves all transactions for a seller.
     *
     * @param sellerId The seller ID
     * @return List of seller's transactions
     */
    @Transactional(readOnly = true)
    public List<TransactionResponse> getSellerTransactions(String sellerId) {
        log.debug("Fetching transactions for seller: {}", sellerId);
        return transactionRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Calculates total revenue for a seller.
     *
     * @param sellerId The seller ID
     * @return Revenue information
     */
    @Transactional(readOnly = true)
    public RevenueResponse getUserRevenue(String sellerId) {
        log.debug("Calculating revenue for seller: {}", sellerId);
        
        Double totalRevenue = transactionRepository.calculateSellerRevenue(sellerId);
        Integer totalSales = transactionRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .filter(t -> t.getStatus() == TransactionStatus.COMPLETED)
                .collect(Collectors.toList())
                .size();
        
        return RevenueResponse.builder()
                .sellerId(sellerId)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .totalSales(totalSales)
                .build();
    }
    
    /**
     * Maps a PromptListing entity to a ListingResponse DTO.
     */
    private ListingResponse mapToListingResponse(PromptListing listing) {
        return ListingResponse.builder()
                .id(listing.getId())
                .promptId(listing.getPromptId())
                .sellerId(listing.getSellerId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .status(listing.getStatus())
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
    
    /**
     * Maps a Transaction entity to a TransactionResponse DTO.
     */
    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .listingId(transaction.getListingId())
                .buyerId(transaction.getBuyerId())
                .sellerId(transaction.getSellerId())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .paymentMethod(transaction.getPaymentMethod())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}

