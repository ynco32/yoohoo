package com.conkiri.global.exception.dto;

public final class ExceptionMessage {

	private ExceptionMessage() {
	}

	// common
	public static final String USERNAME_NOT_FOUND = "해당하는 유저가 존재하지 않습니다.";
	public static final String ALREADY_EXIST_USER = "이미 존재하는 회원입니다.";
	public static final String BAD_CREDENTIAL_USER = "인증정보가 다른 회원입니다.";
	public static final String INVALID_PASSWORD = "비밀번호가 일치하지 않습니다.";
	public static final String NO_AUTHENTICATION = "인증에 실패하였습니다.";
	public static final String USERNAME_NOT_EMPTY = "이름은 필수값 입니다.";
	public static final String LATITUDE_VALUE_NOT_EMPTY = "위도는 필수값 입니다.";
	public static final String LONGITUDE_NOT_EMPTY = "경도는 필수값 입니다.";
	public static final String PASSWORD_NOT_EMPTY = "비밀번호는 필수값 입니다.";
	public static final String CONCERT_NOT_FOUND = "콘서트를 찾을 수 없습니다.";
	public static final String SHARING_NOT_FOUND = "나눔 게시글을 찾을 수 없습니다.";
}
