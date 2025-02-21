package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class NotStartedTicketingException extends RuntimeException{

	public NotStartedTicketingException() {
		super(ExceptionMessage.NOT_START_TICKETING);
	}
}
