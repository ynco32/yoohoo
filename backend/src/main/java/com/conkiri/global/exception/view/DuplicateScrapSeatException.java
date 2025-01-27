package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class DuplicateScrapSeatException extends RuntimeException {
	public DuplicateScrapSeatException() { super(ExceptionMessage.DUPLICATE_SCRAP_SEAT); }
}
