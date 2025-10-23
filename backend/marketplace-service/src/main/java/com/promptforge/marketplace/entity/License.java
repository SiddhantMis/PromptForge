package com.promptforge.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a license for a purchased prompt.
 * Grants usage rights to the buyer.
 */
@Entity
@Table(name = "licenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class License {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String transactionId;
    
    @Column(nullable = false)
    private String promptId;
    
    @Column(nullable = false)
    private String buyerId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseType licenseType;
    
    @Column
    private LocalDateTime expiresAt;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}

