package com.conkiri.domain.view.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {

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

	@Column(name = "photo_url")
	private String photoUrl;

	@Column(name = "write_time")
	private LocalDateTime writeTime;

	// [외래키] 회원 아이디

	// [외래키] 좌석 아이디
}