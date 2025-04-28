package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Arena;

public record ArenaDetailResponseDTO(
	Long arenaId,
	String arenaName,
	String photoUrl
) {
	public static ArenaDetailResponseDTO from(Arena arena) {
		return new ArenaDetailResponseDTO(
			arena.getArenaId(),
			arena.getArenaName(),
			arena.getPhotoUrl()
		);
	}
}
