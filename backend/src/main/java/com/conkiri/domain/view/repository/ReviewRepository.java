package com.conkiri.domain.view.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.view.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
