package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Seat;

public record SeatDetailResponseDTO(
	Long seatId,
	Long rowLine,
	Long columnLine,
	Long sectionNumber,
	boolean isScrapped,
	Long reviewCount
) {
	public static SeatDetailResponseDTO of(Seat seat, Long sectionNumber, Boolean isScrapped, Long reviewCount) {
		return new SeatDetailResponseDTO(
			seat.getSeatId(),
			seat.getRowLine(),
			seat.getColumnLine(),
			sectionNumber,
			isScrapped,
			reviewCount
		);
	}
}