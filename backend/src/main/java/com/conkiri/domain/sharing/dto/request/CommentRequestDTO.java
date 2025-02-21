package com.conkiri.domain.sharing.dto.request;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequestDTO {

	@NotBlank(message = ExceptionMessage.BLANK_IS_NOT_ALLOWED)
	private String content;

	private Long sharingId;
}
