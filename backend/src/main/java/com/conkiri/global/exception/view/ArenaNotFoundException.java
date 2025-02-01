package com.conkiri.global.exception.view;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ArenaNotFoundException extends RuntimeException{
	public ArenaNotFoundException() {
		super(ExceptionMessage.ARENA_NOT_FOUND);
	}
}
