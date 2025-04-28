package com.conkiri.domain.view.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.StageType;

public record ViewConcertDetailResponseDTO(
	Long concertId,
	Long arenaId,
	String concertName,
	String artist,
	LocalDateTime startTime,
	StageType stageType
) {
	public static ViewConcertDetailResponseDTO from(Concert concert) {
		return new ViewConcertDetailResponseDTO(
			concert.getConcertId(),
			concert.getArena().getArenaId(),
			concert.getConcertName(),
			concert.getArtist(),
			concert.getStartTime(),
			concert.getStageType()
		);
	}
}
