package com.conkiri.domain.view.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.SeatDistance;
import com.conkiri.domain.view.entity.Sound;

public record ReviewDetailResponseDTO(
	Long reviewId,
	Long seatId,
	Long rowLine,
	Long columnLine,
	Long concertId,
	String content,
	int viewScore,
	SeatDistance seatDistance,
	Sound sound,
	String photoUrl,
	LocalDateTime writeTime,
	LocalDateTime modifyTime,
	StageType stageType,
	String level,
	String nickname,
	String concertName,
	Long userId
) {
	public static ReviewDetailResponseDTO from(Review review) {
		return new ReviewDetailResponseDTO(
			review.getReviewId(),
			review.getSeat().getSeatId(),
			review.getSeat().getRowLine(),
			review.getSeat().getColumnLine(),
			review.getConcert().getConcertId(),
			review.getContent(),
			review.getViewScore(),
			review.getSeatDistance(),
			review.getSound(),
			review.getPhotoUrl(),
			review.getWriteTime(),
			review.getModifyTime(),
			review.getStageType(),
			review.getUser().getLevel(),
			review.getUser().getNickname(),
			review.getConcert().getConcertName(),
			review.getUser().getUserId()
		);
	}
}
