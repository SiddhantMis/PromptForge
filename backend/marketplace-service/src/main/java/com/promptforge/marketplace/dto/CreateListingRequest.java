package com.promptforge.marketplace.dto;

import lombok.Data;

/**
 * Request DTO for creating a new prompt listing.
 */
@Data
public class CreateListingRequest {
    private String promptId;
    private String title;
    private String description;
    private Double price;
}

