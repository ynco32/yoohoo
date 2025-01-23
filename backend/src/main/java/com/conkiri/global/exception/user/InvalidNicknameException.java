package com.conkiri.global.exception.user;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class InvalidNicknameException extends RuntimeException {

	public InvalidNicknameException() {
		super(ExceptionMessage.INVALID_NICKNAME);
	}
}
