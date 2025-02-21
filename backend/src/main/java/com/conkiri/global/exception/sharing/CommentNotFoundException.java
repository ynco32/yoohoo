package com.conkiri.global.exception.sharing;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class CommentNotFoundException extends RuntimeException {
	public CommentNotFoundException() {
		super(ExceptionMessage.COMMENT_NOT_FOUND);
	}
}
