package com.conkiri.domain.view.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	List<Review> findBySeatIn(List<Seat> seats);

	List<Review> findBySeat(Seat seat);

	List<Review> findByUser(User user);

	boolean existsByUserAndSeatAndConcert(User user, Seat seat, Concert concert);

	boolean existsByUserAndSeatAndConcertAndReviewIdNot(User user, Seat seat, Concert concert, Long reviewId);

	Optional<Review> findReviewByReviewId(Long reviewId);
}
