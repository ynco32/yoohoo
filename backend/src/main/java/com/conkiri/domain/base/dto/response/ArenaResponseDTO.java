package com.conkiri.domain.base.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Arena;

public record ArenaResponseDTO(
	List<ArenaDetailResponseDTO> arenas
) {
	public static ArenaResponseDTO from(List<Arena> arenas) {
		return new ArenaResponseDTO(
			arenas.stream()
				.map(ArenaDetailResponseDTO::from)
				.collect(Collectors.toList())
		);
	}
}
