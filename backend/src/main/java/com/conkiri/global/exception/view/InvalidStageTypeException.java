package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class InvalidStageTypeException extends RuntimeException {
	public InvalidStageTypeException() {
		super(ExceptionMessage.INVALID_STAGETYPE);
	}
}
