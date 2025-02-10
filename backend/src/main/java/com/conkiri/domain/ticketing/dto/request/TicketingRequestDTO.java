package com.conkiri.domain.ticketing.dto.request;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TicketingRequestDTO {

	@NotBlank(message = ExceptionMessage.BLANK_IS_NOT_ALLOWED)
	private String section;

	@NotBlank(message = ExceptionMessage.BLANK_IS_NOT_ALLOWED)
	private String seat;
}
