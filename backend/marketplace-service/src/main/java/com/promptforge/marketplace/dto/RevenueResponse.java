package com.promptforge.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for seller revenue information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponse {
    private String sellerId;
    private Double totalRevenue;
    private Integer totalSales;
}

