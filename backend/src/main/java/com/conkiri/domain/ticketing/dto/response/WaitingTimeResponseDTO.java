package com.conkiri.domain.ticketing.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WaitingTimeResponseDTO {

	private Long position;           // 대기 순서
	private Long usersAhead;          // 앞에 남은 대기자 수
	private Long estimatedWaitingSeconds;  // 예상 대기 시간(초)
	private Long usersAfter;        // 뒤에 있는 대기자 수

	public static WaitingTimeResponseDTO of(Long position, Long usersAhead, Long estimatedWaitingSeconds, Long usersAfter) {
		return new WaitingTimeResponseDTO(position, usersAhead, estimatedWaitingSeconds, usersAfter);
	}
}
