package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ReviewNotFoundException extends RuntimeException {
	public ReviewNotFoundException() {
		super(ExceptionMessage.REVIEW_NOT_FOUND);
	}
}
