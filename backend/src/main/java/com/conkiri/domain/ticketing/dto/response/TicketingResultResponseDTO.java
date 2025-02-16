package com.conkiri.domain.ticketing.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketingResultResponseDTO {

	private String section;          // 구역
	private String seat;            // 좌석
	private Long ticketRank;              // 예매 등수
	private Long processingTime;    // 소요 시간(ms)
	private LocalDateTime reserveTime; // 예매 시간
}
