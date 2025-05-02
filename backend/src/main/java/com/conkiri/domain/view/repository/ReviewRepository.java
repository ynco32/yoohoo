package com.conkiri.domain.view.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

}
