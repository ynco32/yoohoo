package com.conkiri.global.exception.auth;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ExpiredTokenException extends RuntimeException {

	public ExpiredTokenException() {
		super(ExceptionMessage.EXPIRED_TOKEN);
	}
}
