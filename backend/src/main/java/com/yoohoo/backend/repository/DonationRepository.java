package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUser_UserId(Long userId); // 특정 사용자의 후원 내역 조회

    // 특정 사용자의 후원 내역을 날짜 범위로 조회
    List<Donation> findByUser_UserIdAndDonationDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}