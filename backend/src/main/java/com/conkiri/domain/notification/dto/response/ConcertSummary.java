package com.conkiri.domain.notification.dto.response;

import com.conkiri.domain.base.entity.Concert;

public record ConcertSummary(
	Long concertId,
	String concertName,
	String artistName,
	String photoUrl
) {
	public static ConcertSummary from(Concert concert) {
		return new ConcertSummary(
			concert.getConcertId(),
			concert.getConcertName(),
			concert.getArtist().getArtistName(),
			concert.getPhotoUrl()
		);
	}
}