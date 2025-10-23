package com.promptforge.marketplace.dto;

import com.promptforge.marketplace.entity.LicenseType;
import lombok.Data;

/**
 * Request DTO for purchasing a prompt.
 */
@Data
public class PurchaseRequest {
    private String listingId;
    private String paymentMethod;
    private LicenseType licenseType = LicenseType.PERSONAL;
}

