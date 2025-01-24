package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SharingRequestDTO {

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long concertId;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long userId;

	@NotBlank(message = ExceptionMessage.BLANK_IS_NOT_ALLOWED)
	private String title;

	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
