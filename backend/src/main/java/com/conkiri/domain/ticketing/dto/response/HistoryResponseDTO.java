package com.conkiri.domain.ticketing.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HistoryResponseDTO {

	private String section;
	private String seat;
	private Long queueTime;
	private Long position;
	private Long totalQueue;
	private Long enterTime;
	private Long reserveTime;
}
