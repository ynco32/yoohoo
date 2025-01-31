package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class AlreadyExistScrapSharingException extends RuntimeException {

	public AlreadyExistScrapSharingException() {
		super(ExceptionMessage.ALREADY_EXIST_SCRAP_SHARING);
	}
}
