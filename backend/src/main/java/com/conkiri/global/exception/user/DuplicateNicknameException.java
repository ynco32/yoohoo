package com.conkiri.global.exception.user;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class DuplicateNicknameException extends RuntimeException {

	public DuplicateNicknameException() {
		super(ExceptionMessage.DUPLICATE_NICKNAME);
	}
}
