package com.promptforge.marketplace.repository;

import com.promptforge.marketplace.entity.Transaction;
import com.promptforge.marketplace.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing marketplace transactions.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    
    /**
     * Finds all transactions for a buyer.
     */
    List<Transaction> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    
    /**
     * Finds all transactions for a seller.
     */
    List<Transaction> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    
    /**
     * Finds transactions by status.
     */
    List<Transaction> findByStatus(TransactionStatus status);
    
    /**
     * Calculates total revenue for a seller.
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.sellerId = :sellerId AND t.status = 'COMPLETED'")
    Double calculateSellerRevenue(@Param("sellerId") String sellerId);
}

