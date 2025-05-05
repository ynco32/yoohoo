package com.conkiri.domain.view.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	@Query("""
		select r from Review r
		join fetch r.user
		join fetch r.concert
		join fetch r.seat s
		where r.reviewId = :reviewId
	""")
	Optional<Review> findWithUserConcertSeatById(@Param("reviewId") Long reviewId);

	@Query("""
    SELECT r FROM Review r
    JOIN FETCH r.user
    JOIN FETCH r.concert
    JOIN FETCH r.seat
    WHERE r.user = :user
""")
	List<Review> findAllWithUserConcertSeatByUser(@Param("user") User user);
}
