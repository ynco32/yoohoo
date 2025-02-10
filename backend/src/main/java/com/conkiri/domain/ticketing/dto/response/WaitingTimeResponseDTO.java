package com.conkiri.domain.ticketing.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WaitingTimeResponseDTO {

	private Long position;           // 대기 순서
	private int usersAhead;          // 앞에 남은 대기자 수
	private int estimatedWaitingSeconds;  // 예상 대기 시간(초)

	public static WaitingTimeResponseDTO of(Long position, int usersAhead, int estimatedWaitingSeconds) {
		return new WaitingTimeResponseDTO(position, usersAhead, estimatedWaitingSeconds);
	}
}
