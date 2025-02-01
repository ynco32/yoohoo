package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class StatusInvalidException extends RuntimeException {
	public StatusInvalidException() {
		super(ExceptionMessage.STATUS_INVALID);
	}
}
