package com.conkiri.domain.user.dto.request;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NicknameRequestDTO {

	@NotBlank(message = ExceptionMessage.NICKNAME_NOT_EMPTY)
	@Size(min = 2, max = 10, message = ExceptionMessage.ERROR_NICKNAME_LENGTH)
	@Pattern(regexp = "^[가-힣a-zA-Z0-9]{2,10}$", message = ExceptionMessage.ERROR_NICKNAME_FORMAT)
	private String nickname;

}
