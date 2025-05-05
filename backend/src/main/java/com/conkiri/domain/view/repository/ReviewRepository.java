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
		left join fetch r.user
		left join fetch r.concert
		left join fetch r.seat
		left join fetch r.reviewPhotos
		where r.reviewId = :reviewId
	""")
	Optional<Review> findWithAllDetailsById(@Param("reviewId") Long reviewId);

	@Query("""
		select distinct r from Review r
		left join fetch r.seat
		left join fetch r.concert
		left join fetch r.user
		left join fetch r.reviewPhotos
		where r.user = :user
	""")
	List<Review> findAllWithPhotosByUser(@Param("user") User user);

}
