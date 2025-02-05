package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.view.entity.ScrapSeat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapSeatResponseDTO {

	private List<ScrapSeatDetailResponseDTO> scraps;

	public static ScrapSeatResponseDTO from(List<ScrapSeat> scraps) {
		return ScrapSeatResponseDTO.builder()
			.scraps(scraps.stream()
				.map(ScrapSeatDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
