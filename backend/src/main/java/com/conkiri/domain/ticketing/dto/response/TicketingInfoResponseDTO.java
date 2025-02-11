package com.conkiri.domain.ticketing.dto.response;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class TicketingInfoResponseDTO {

	private LocalDateTime startTime;        // 티켓팅 시작 시간
	private LocalDateTime serverTime;       // 현재 서버 시간
	private boolean isWithin10Minutes;      // 시작 10분 전 여부

	public TicketingInfoResponseDTO () {
		this.serverTime = LocalDateTime.now();
		this.startTime = LocalDateTime.now()
			.withHour(19)
			.withMinute(0)
			.withSecond(0)
			.withNano(0);
		this.isWithin10Minutes = startTime.minusMinutes(10).isBefore(serverTime) && startTime.isAfter(serverTime);
	}
}
