package com.conkiri.domain.view.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.view.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findBySeatIn(List<Seat> seats);
	List<Review> findBySeat(Seat seat);
}
