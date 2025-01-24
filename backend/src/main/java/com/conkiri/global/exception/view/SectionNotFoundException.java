package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class SectionNotFoundException extends RuntimeException {
	public SectionNotFoundException() {
		super(ExceptionMessage.SECTION_NOT_FOUND);
	}
}
