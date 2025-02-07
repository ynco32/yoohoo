package com.conkiri.domain.view.dto.request;

import com.conkiri.domain.view.entity.SeatDistance;
import com.conkiri.domain.view.entity.Sound;
import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewRequestDTO {

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long concertId;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long sectionNumber;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long rowLine;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long columnLine;

	@NotBlank(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private String content;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	@Min(value = 1)
	@Max(value = 7)
	private Integer viewScore;

	private SeatDistance seatDistance;
	private Sound sound;
}
