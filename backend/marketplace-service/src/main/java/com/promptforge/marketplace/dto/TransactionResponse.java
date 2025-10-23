package com.promptforge.marketplace.dto;

import com.promptforge.marketplace.entity.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for transaction information.
 */
@Data
@Builder
public class TransactionResponse {
    private String id;
    private String listingId;
    private String buyerId;
    private String sellerId;
    private Double amount;
    private TransactionStatus status;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

