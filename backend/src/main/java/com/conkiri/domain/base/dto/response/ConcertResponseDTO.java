package com.conkiri.domain.base.dto.response;

import org.springframework.data.domain.Slice;

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

	private Slice<ConcertDetailResponseDTO> concerts;
	private boolean isLastPage;

	public static ConcertResponseDTO from(Slice<Concert> concerts) {
		return ConcertResponseDTO.builder()
			.concerts(concerts.map(ConcertDetailResponseDTO::from))
			.isLastPage(!concerts.hasNext())
			.build();
	}
}
