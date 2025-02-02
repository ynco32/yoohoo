package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class UnauthorizedAccessException extends RuntimeException {
	public UnauthorizedAccessException() {
		super(ExceptionMessage.UNAUTHORIZED_ACCESS);
	}
}
