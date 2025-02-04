package com.conkiri.global.auth.dto;

import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshTokenRequestDTO {

	@NotBlank(message = ExceptionMessage.REFRESH_TOKEN_NOT_EMPTY)
	private String refreshToken;
}
