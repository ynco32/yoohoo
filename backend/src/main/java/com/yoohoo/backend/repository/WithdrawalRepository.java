package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    boolean existsByTransactionUniqueNo(String transactionUniqueNo);
}