package com.conkiri.domain.base.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Concert;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConcertResponseDTO {

	private List<ConcertDetailResponseDTO> concerts;
	private boolean isLastPage;

	public static ConcertResponseDTO of(List<Concert> concerts, boolean hasNext) {
		return ConcertResponseDTO.builder()
			.concerts(concerts.stream()
				.map(ConcertDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.isLastPage(!hasNext)
			.build();
	}
}
