package com.conkiri.domain.view.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.SeatDistance;
import com.conkiri.domain.view.entity.Sound;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDetailResponseDTO {

	private Long reviewId;
	private Long seatId;
	private Long concertId;
	private String content;
	private int viewScore;
	private SeatDistance seatDistance;
	private Sound sound;
	private String photoUrl;
	private LocalDateTime writeTime;
	private LocalDateTime modifyTime;
	private StageType stageType;

	public static ReviewDetailResponseDTO from(Review review) {
		return ReviewDetailResponseDTO.builder()
			.reviewId(review.getReviewId())
			.seatId(review.getSeat().getSeatId())
			.concertId(review.getConcert().getConcertId())
			.content(review.getContent())
			.viewScore(review.getViewScore())
			.seatDistance(review.getSeatDistance())
			.sound(review.getSound())
			.photoUrl(review.getPhotoUrl())
			.writeTime(review.getWriteTime())
			.modifyTime(review.getModifyTime())
			.stageType(review.getStageType())
			.build();
	}
}
