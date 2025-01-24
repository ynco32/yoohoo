package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Arena;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArenaDetailResponseDTO {

	private Long arenaId;
	private String arenaName;
	private String photoUrl;

	public static ArenaDetailResponseDTO from(Arena arena) {
		return ArenaDetailResponseDTO.builder()
			.arenaId(arena.getArenaId())
			.arenaName(arena.getArenaName())
			.photoUrl(arena.getPhotoUrl())
			.build();
	}
}
