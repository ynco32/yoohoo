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
	private Long reviewCount;
	private boolean isScrapped;

	public static SeatDetailResponseDTO of(Seat seat, Boolean isScrapped) {
		return SeatDetailResponseDTO.builder()
			.seatId(seat.getSeatId())
			.rowLine(seat.getRowLine())
			.columnLine(seat.getColumnLine())
			.reviewCount(seat.getReviewCount())
			.isScrapped(isScrapped)
			.build();
	}
}
