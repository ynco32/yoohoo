package com.conkiri.global.exception.ticketing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class RecordNotFoundException extends RuntimeException{
	public RecordNotFoundException() {
		super(ExceptionMessage.RECORD_NOT_FOUND);
	}
}
