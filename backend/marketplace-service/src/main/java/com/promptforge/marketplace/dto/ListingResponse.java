package com.promptforge.marketplace.dto;

import com.promptforge.marketplace.entity.ListingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for prompt listing information.
 */
@Data
@Builder
public class ListingResponse {
    private String id;
    private String promptId;
    private String sellerId;
    private String title;
    private String description;
    private Double price;
    private ListingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

