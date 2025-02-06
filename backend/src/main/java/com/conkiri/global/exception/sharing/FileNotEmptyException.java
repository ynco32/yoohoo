package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class FileNotEmptyException extends RuntimeException {
	public FileNotEmptyException() {
		super(ExceptionMessage.FILE_NOT_EMPTY);
	}
}
