package com.conkiri.domain.view.dto.request;

import com.conkiri.domain.view.entity.SeatDistance;
import com.conkiri.domain.view.entity.Sound;
import com.conkiri.global.exception.ValidationMessage;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewRequestDTO(
	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED) Long concertId,
	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED) Long sectionNumber,
	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED) Long rowLine,
	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED) Long columnLine,
	@NotBlank(message = ValidationMessage.NULL_IS_NOT_ALLOWED) String content,
	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED)
	@Min(1)
	@Max(7) Integer viewScore,
	SeatDistance seatDistance,
	Sound sound
) {
}
