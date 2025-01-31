package com.conkiri.global.exception.oauth;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class OAuthProcessingException extends RuntimeException {

	public OAuthProcessingException() {
		super(ExceptionMessage.INVALID_TOKEN);
	}
}
