package com.conkiri.domain.base.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Concert;

public record ConcertResponseDTO(
	List<ConcertDetailResponseDTO> concerts,
	boolean isLastPage
) {
	public static ConcertResponseDTO of(List<Concert> concerts, boolean hasNext) {
		return new ConcertResponseDTO(
			concerts.stream()
				.map(ConcertDetailResponseDTO::from)
				.collect(Collectors.toList()),
			!hasNext
		);
	}
}
