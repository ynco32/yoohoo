package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class InvalidSeatException extends RuntimeException{

	public InvalidSeatException() {
		super(ExceptionMessage.INVALID_SEAT);
	}
}
