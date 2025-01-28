package com.conkiri.domain.view.entity;

import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ScrapSeat {

	@Id
	@Column(name = "scrap_seat_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long scrapSeatId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "seat_id", nullable = false)
	private Seat seat;
}
