package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class SharingNotFoundException extends RuntimeException {
	public SharingNotFoundException() {
		super(ExceptionMessage.SHARING_NOT_FOUND);
	}
}

