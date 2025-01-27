package com.conkiri.global.exception.concert;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class SearchResultNullException extends RuntimeException {
	public SearchResultNullException() {
		super(ExceptionMessage.SEARCH_RESULT_NULL);
	}
}
