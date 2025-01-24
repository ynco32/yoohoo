package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Arena;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArenaResponseDTO {

	private List<ArenaDetailResponseDTO> arenas;

	public static ArenaResponseDTO from(List<Arena> arenas) {
		return ArenaResponseDTO.builder()
			.arenas(arenas.stream()
				.map(ArenaDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
