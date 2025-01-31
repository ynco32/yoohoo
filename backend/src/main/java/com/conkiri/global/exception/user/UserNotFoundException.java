package com.conkiri.global.exception.user;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class UserNotFoundException extends RuntimeException {

	public UserNotFoundException() {
		super(ExceptionMessage.USERNAME_NOT_FOUND);
	}
}
