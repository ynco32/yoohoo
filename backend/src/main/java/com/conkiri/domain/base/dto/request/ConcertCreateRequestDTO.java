package com.conkiri.domain.base.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public record ConcertCreateRequestDTO(
    String concertName,
    List<String> artists,
    String venueName,
    String photoUrl,
    LocalDateTime advanceReservation,
    LocalDateTime reservation,
    String ticketingPlatform,
    List<LocalDateTime> startTimes,
    String noticeImageUrl,
    String noticeText
) {
    
}