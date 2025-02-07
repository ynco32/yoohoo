package com.conkiri.domain.view.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponseDTO {

	private List<SeatDetailResponseDTO> seats;

	public static SeatResponseDTO from(List<SeatDetailResponseDTO> seatDetails) {
		return SeatResponseDTO.builder()
			.seats(seatDetails)
			.build();
	}
}
