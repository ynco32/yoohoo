package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Seat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatDetailResponseDTO {

	private Long seatId;
	private Long rowLine;
	private Long columnLine;
	private Long sectionNumber;
	private boolean isScrapped;
	private Long reviewCount;

	public static SeatDetailResponseDTO of(Seat seat, Long sectionNumber, Boolean isScrapped, Long reviewCount) {
		return SeatDetailResponseDTO.builder()
			.seatId(seat.getSeatId())
			.rowLine(seat.getRowLine())
			.columnLine(seat.getColumnLine())
			.sectionNumber(sectionNumber)
			.isScrapped(isScrapped)
			.reviewCount(reviewCount)
			.build();
	}
}
