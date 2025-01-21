package com.conkiri.global.exception.user;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class AlreadyExistUserException extends RuntimeException {

	public AlreadyExistUserException() {
		super(ExceptionMessage.ALREADY_EXIST_USER);
	}
}
