package com.conkiri.domain.view.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.view.entity.ArtistGrade;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ScreenGrade;
import com.conkiri.domain.view.entity.StageGrade;

public record ReviewDetailResponseDTO(
	Long reviewId,
	String nickname,
	String concertName,
	Long seatId,
	String section,
	Long rowLine,
	Long columnLine,
	ArtistGrade artistGrade,
	StageGrade stageGrade,
	ScreenGrade screenGrade,
	String content,
	String cameraBrand,
	String cameraModel,
	LocalDateTime createdAt
) {
	public static ReviewDetailResponseDTO from(Review review) {

		Seat seat = review.getSeat();

		return new ReviewDetailResponseDTO(
			review.getReviewId(),
			review.getUser().getNickname(),
			review.getConcert().getConcertName(),
			seat.getSeatId(),
			seat.getSection(),
			seat.getRowLine(),
			seat.getColumnLine(),
			review.getArtistGrade(),
			review.getStageGrade(),
			review.getScreenGrade(),
			review.getContent(),
			review.getCameraBrand(),
			review.getCameraModel(),
			review.getCreatedAt()
		);
	}
}
