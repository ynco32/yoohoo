package com.conkiri.global.exception.auth;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class InvalidTokenException extends RuntimeException{

	public InvalidTokenException() {
		super(ExceptionMessage.INVALID_TOKEN);
	}
}
