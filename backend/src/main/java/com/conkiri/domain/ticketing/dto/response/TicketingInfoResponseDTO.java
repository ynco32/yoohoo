package com.conkiri.domain.ticketing.dto.response;

import java.time.LocalDateTime;
import java.time.ZoneId;

import lombok.Getter;

@Getter
public class TicketingInfoResponseDTO {

	private LocalDateTime startTime;        // 티켓팅 시작 시간
	private LocalDateTime serverTime;       // 현재 서버 시간
	private boolean isWithin10Minutes;      // 시작 10분 전 여부
	private boolean isFinished;            // 티켓팅 종료 여부

	public TicketingInfoResponseDTO() {
		this.serverTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		this.startTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"))
			.withHour(12)
			.withMinute(15)
			.withSecond(0)
			.withNano(0);
		this.isWithin10Minutes = serverTime.isAfter(startTime.minusMinutes(10))
			&& serverTime.isBefore(startTime);
		;
		this.isFinished = serverTime.isAfter(startTime.plusHours(10));
	}
}
