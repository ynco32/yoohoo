package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class SeatNotFoundException extends RuntimeException {
	public SeatNotFoundException() { super(ExceptionMessage.SEAT_NOT_FOUND); }
}
