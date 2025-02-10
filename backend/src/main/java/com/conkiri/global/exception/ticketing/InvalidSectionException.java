package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class InvalidSectionException extends RuntimeException{

	public InvalidSectionException() {
		super(ExceptionMessage.INVALID_SECTION);
	}
}
