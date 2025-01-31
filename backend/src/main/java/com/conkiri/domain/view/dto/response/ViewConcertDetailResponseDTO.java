package com.conkiri.domain.view.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.StageType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViewConcertDetailResponseDTO {

	private Long concertId;
	private Long arenaId;
	private String concertName;
	private LocalDateTime startTime;
	private StageType stageType;

	public static ViewConcertDetailResponseDTO from(Concert concert) {
		return ViewConcertDetailResponseDTO.builder()
			.concertId(concert.getConcertId())
			.arenaId(concert.getArena().getArenaId())
			.concertName(concert.getConcertName())
			.startTime(concert.getStartTime())
			.stageType(concert.getStageType())
			.build();
	}
}
