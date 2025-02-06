package com.conkiri.domain.view.dto.response;

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
public class ViewConcertResponseDTO {

	private List<ViewConcertDetailResponseDTO> concerts;

	public static ViewConcertResponseDTO from(List<Concert> concerts) {
		return ViewConcertResponseDTO.builder()
			.concerts(concerts.stream()
				.map(ViewConcertDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
