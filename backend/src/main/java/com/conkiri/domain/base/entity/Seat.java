package com.conkiri.domain.base.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Seat {

	@Id
	@Column(name = "seat_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long seatId;

	@Column(name = "row_number")
	private Long rowNumber;

	@Column(name = "column_number")
	private Long columnNumber;

	@Column(name = "section_number")
	private Long sectionNumber;

	@Column(name = "review_count")
	private Long reviewCount;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arena_id", nullable = false)
	private Arena arena;
}
