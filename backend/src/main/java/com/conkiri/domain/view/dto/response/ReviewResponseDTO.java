package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.view.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {

	private List<ReviewDetailResponseDTO> reviews;

	public static ReviewResponseDTO from(List<Review> reviews) {
		return ReviewResponseDTO.builder()
			.reviews(reviews.stream()
				.map(ReviewDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
