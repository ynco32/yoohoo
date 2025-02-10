package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class AlreadyReservedSeatException extends RuntimeException {

	public AlreadyReservedSeatException() {
		super(ExceptionMessage.ALREADY_RESERVED_SEAT);
	}
}
