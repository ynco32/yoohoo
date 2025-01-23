package com.conkiri.global.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.conkiri.global.exception.sharing.AlreadyExistScrapSharingException;
import com.conkiri.global.exception.sharing.ScrapSharingNotFoundException;
import com.conkiri.global.exception.view.ArenaNotFoundException;
import com.conkiri.global.exception.auth.ExpiredTokenException;
import com.conkiri.global.exception.auth.InvalidTokenException;
import com.conkiri.global.exception.auth.UnAuthorizedException;
import com.conkiri.global.exception.concert.ConcertNotFoundException;
import com.conkiri.global.exception.dto.ExceptionResponse;

import com.conkiri.global.exception.oauth.OAuthProcessingException;
import com.conkiri.global.exception.sharing.SharingNotFoundException;
import com.conkiri.global.exception.sharing.StatusInvalidException;
import com.conkiri.global.exception.user.AlreadyExistUserException;
import com.conkiri.global.exception.user.DuplicateNicknameException;
import com.conkiri.global.exception.user.InvalidNicknameException;
import com.conkiri.global.exception.user.UserNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidNicknameException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse InvalidNicknameHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(DuplicateNicknameException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public ExceptionResponse DuplicateNicknameHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.CONFLICT, LocalDateTime.now());
	}

	@ExceptionHandler(OAuthProcessingException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ExceptionResponse OAuthProcessingHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, LocalDateTime.now());
	}

	@ExceptionHandler(UnAuthorizedException.class)
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ExceptionResponse UnAuthorizedHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, LocalDateTime.now());
	}

	@ExceptionHandler(InvalidTokenException.class)
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ExceptionResponse InvalidTokenHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, LocalDateTime.now());
	}

	@ExceptionHandler(ExpiredTokenException.class)
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ExceptionResponse ExpiredTokenHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, LocalDateTime.now());
	}

	@ExceptionHandler(AlreadyExistUserException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse alreadyExistUserHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(UserNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse userNotFoundHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(ConcertNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse concertNotFoundHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(SharingNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse sharingNotFoundHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(StatusInvalidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse statusInvalidHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(ArenaNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse arenaNotFoundHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(ScrapSharingNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse scrapSharingNotFoundHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}

	@ExceptionHandler(AlreadyExistScrapSharingException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ExceptionResponse alreadyExistScrapSharingHandler(Exception e) {
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST, LocalDateTime.now());
	}
}