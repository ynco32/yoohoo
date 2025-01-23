package com.conkiri.domain.sharing.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.sharing.entity.Sharing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharingResponseDTO {

	private List<SharingDetailResponseDTO> sharings;

	public static SharingResponseDTO from(List<Sharing> sharings) {
		return SharingResponseDTO.builder()
			.sharings(sharings.stream()
				.map(SharingDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
