package com.conkiri.domain.ticketing.dto.response;

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

	List<SeatDetailResponseDTO> seats;

	public static SeatResponseDTO from(List<SeatDetailResponseDTO> seats) {
		return SeatResponseDTO.builder().seats(seats).build();
	}
}
