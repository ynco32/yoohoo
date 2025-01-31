package com.conkiri.global.exception.auth;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class UnAuthorizedException extends RuntimeException {

	public UnAuthorizedException() {
		super(ExceptionMessage.UNAUTHORIZED);
	}
}
