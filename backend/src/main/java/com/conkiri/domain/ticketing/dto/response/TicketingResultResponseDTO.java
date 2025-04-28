package com.conkiri.domain.ticketing.dto.response;

import java.time.LocalDateTime;

public record TicketingResultResponseDTO(
	String section,
	String seat,
	Long ticketRank,
	Long processingTime,
	LocalDateTime reserveTime
) {
}