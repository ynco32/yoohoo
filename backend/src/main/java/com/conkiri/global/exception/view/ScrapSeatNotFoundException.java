package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ScrapSeatNotFoundException extends RuntimeException {
	public ScrapSeatNotFoundException() {
		super(ExceptionMessage.SCRAP_SEAT_NOT_FOUND);
	}
}
