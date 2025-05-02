package com.conkiri.domain.view.dto.response;

import java.util.List;

import com.conkiri.domain.view.entity.Review;

public record ReviewResponseDTO(
	List<ReviewDetailResponseDTO> reviews
) {
	public static ReviewResponseDTO from(List<Review> reviews) {
		return new ReviewResponseDTO(
			reviews.stream()
				.map(ReviewDetailResponseDTO::from)
				.toList()
		);
	}
}
