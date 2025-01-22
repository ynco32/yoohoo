package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SharingRequestDTO {

	private Long concertId;
	private Long userId;

	private String title;
	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
