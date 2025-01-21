package com.conkiri.domain.view.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ScrapSeat {

	@Id
	@Column(name = "scrap_seat_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long scrapSeatId;

	// [외래키] 회원 아이디

	// [외래키] 좌석 아이디
}
