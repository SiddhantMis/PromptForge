package com.promptforge.marketplace.entity;

/**
 * Status of a marketplace transaction.
 */
public enum TransactionStatus {
    PENDING,    // Transaction initiated but not completed
    COMPLETED,  // Transaction successfully completed
    FAILED      // Transaction failed
}

