package com.conkiri.domain.view.dto.response;

import java.util.List;

public record SeatResponseDTO(
	List<SeatDetailResponseDTO> seats
) {
	public static SeatResponseDTO from(List<SeatDetailResponseDTO> seatDetails) {
		return new SeatResponseDTO(seatDetails);
	}
}
