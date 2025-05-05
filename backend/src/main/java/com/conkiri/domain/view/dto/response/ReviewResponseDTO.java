package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.Map;

import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ReviewPhoto;

public record ReviewResponseDTO(
	List<ReviewDetailResponseDTO> reviews
) {
	public static ReviewResponseDTO of(List<Review> reviews) {
		return new ReviewResponseDTO(
			reviews.stream()
				.map(review -> ReviewDetailResponseDTO.of(
					review,
					review.getReviewPhotos().stream()
						.map(ReviewPhoto::getPhotoUrl)
						.toList()
				))
				.toList()
		);
	}
}
