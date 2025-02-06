package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class DuplicateReviewException extends RuntimeException {
	public DuplicateReviewException() {
		super(ExceptionMessage.DUPLICATE_REVIEW);
	}
}
