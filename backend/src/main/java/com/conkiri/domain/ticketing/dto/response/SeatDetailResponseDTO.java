package com.conkiri.domain.ticketing.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatDetailResponseDTO {

	private String seatNumber;
	private String status;
	private Long userId;
}
