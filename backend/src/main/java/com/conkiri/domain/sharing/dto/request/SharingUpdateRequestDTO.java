package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SharingUpdateRequestDTO {

	@NotBlank(message = ExceptionMessage.BLANK_IS_NOT_ALLOWED)
	private String title;

	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
