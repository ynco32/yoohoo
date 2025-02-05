package com.conkiri.domain.view.entity;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.global.domain.BaseTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseTime {

	@Id
	@Column(name = "review_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reviewId;

	@Column(name = "content", length = 500)
	private String content;

	@Column(name = "view_score")
	private int viewScore;

	@Enumerated(EnumType.STRING)
	@Column(name = "seat_distance")
	private SeatDistance seatDistance;

	@Enumerated(EnumType.STRING)
	@Column(name = "sound")
	private Sound sound;

	@Column(name = "photo_url", length = 300)
	private String photoUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "stage_type")
	private StageType stageType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "seat_id", nullable = false)
	private Seat seat;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "concert_id", nullable = false)
	private Concert concert;

	private Review(ReviewRequestDTO reviewRequestDTO, String photoUrl, User user, Seat seat, Concert concert) {
		this.content = reviewRequestDTO.getContent();
		this.viewScore = reviewRequestDTO.getViewScore();
		this.seatDistance = reviewRequestDTO.getSeatDistance();
		this.sound = reviewRequestDTO.getSound();
		this.photoUrl = photoUrl;
		this.user = user;
		this.seat = seat;
		this.concert = concert;
		this.stageType = concert.getStageType();
	}

	public static Review of(ReviewRequestDTO reviewRequestDTO, String photoUrl, User user, Seat seat, Concert concert) {
		return new Review(reviewRequestDTO, photoUrl, user, seat, concert);
	}

	public void update(ReviewRequestDTO reviewRequestDTO, String photoUrl, Seat seat, Concert concert) {
		this.content = reviewRequestDTO.getContent();
		this.viewScore = reviewRequestDTO.getViewScore();
		this.seatDistance = reviewRequestDTO.getSeatDistance();
		this.sound = reviewRequestDTO.getSound();
		this.photoUrl = photoUrl;
		this.seat = seat;
		this.concert = concert;
		this.stageType = concert.getStageType();
	}
}