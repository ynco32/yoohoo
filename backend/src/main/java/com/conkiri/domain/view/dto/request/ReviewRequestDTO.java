package com.conkiri.domain.view.dto.request;

import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.view.entity.SeatDistance;
import com.conkiri.domain.view.entity.Sound;
import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewRequestDTO {

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long sectionId;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long rowLine;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long columnLine;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Long concertId;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private String content;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private Integer viewScore;

	@NotNull(message = ExceptionMessage.NULL_IS_NOT_ALLOWED)
	private StageType stageType;

	private SeatDistance seatDistance;
	private Sound sound;
}
