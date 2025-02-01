package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ScrapSharingNotFoundException extends RuntimeException {
	public ScrapSharingNotFoundException() {
		super(ExceptionMessage.SCRAP_SHARING_NOT_FOUND);
	}
}
