package com.conkiri.domain.base.dto.response;

import com.conkiri.domain.base.entity.Concert;

public record ConcertDetailResponseDTO(
	Long concertId,
	String concertName,
	//String artist,
	//LocalDateTime startTime,
	String photoUrl,
	String arena
) {
	public static ConcertDetailResponseDTO from(Concert concert) {
		return new ConcertDetailResponseDTO(
			concert.getConcertId(),
			concert.getConcertName(),
			//concert.getArtist(),
			//concert.getStartTime(),
			concert.getPhotoUrl(),
			concert.getArena().getArenaName()
		);
	}
}
