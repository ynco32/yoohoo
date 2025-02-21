package com.conkiri.domain.base.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.base.entity.Concert;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConcertDetailResponseDTO {

	private Long concertId;
	private String concertName;
	private String artist;
	private LocalDateTime startTime;
	private String photoUrl;
	private String stageType;
	private String arena;

	public static ConcertDetailResponseDTO from(Concert concert) {
		return ConcertDetailResponseDTO.builder()
			.concertId(concert.getConcertId())
			.concertName(concert.getConcertName())
			.artist(concert.getArtist())
			.startTime(concert.getStartTime())
			.photoUrl(concert.getPhotoUrl())
			.stageType(concert.getStageType().name())
			.arena(concert.getArena().getArenaName())
			.build();
	}
}
