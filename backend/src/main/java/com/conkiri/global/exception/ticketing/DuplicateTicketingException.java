package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class DuplicateTicketingException extends RuntimeException{

	public DuplicateTicketingException() {
		super(ExceptionMessage.DUPLICATE_TICKETING);
	}
}
