package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Concert;

public record ViewConcertResponseDTO(
	List<ViewConcertDetailResponseDTO> concerts
) {
	public static ViewConcertResponseDTO from(List<Concert> concerts) {
		return new ViewConcertResponseDTO(
			concerts.stream()
				.map(ViewConcertDetailResponseDTO::from)
				.collect(Collectors.toList())
		);
	}
}