package com.conkiri.global.exception.concert;

import com.conkiri.global.exception.dto.ExceptionMessage;

public class ConcertNotFoundException extends RuntimeException {

  public ConcertNotFoundException() {
    super(ExceptionMessage.CONCERT_NOT_FOUND);
  }
}

