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
	public static final String DUPLICATE_NICKNAME = "중복된 닉네임입니다."; //CONFLICT
	public static final String INVALID_NICKNAME = "사용할 수 없는 닉네임입니다.";

	// Auth
	public static final String INVALID_TOKEN = "유효하지 않는 토큰입니다.";
	public static final String EXPIRED_TOKEN = "만료된 토큰입니다.";
	public static final String UNAUTHORIZED = "권한없는 접근입니다.";

	// OAuth
	public static final String OAUTH_PROCESSING_ERROR = "OAuth 오류입니다."; //HttpStatus.INTERNAL_SERVER_ERROR

	//sharing
	public static final String CONCERT_NOT_FOUND = "콘서트를 찾을 수 없습니다.";
	public static final String SHARING_NOT_FOUND = "나눔 게시글을 찾을 수 없습니다.";
	public static final String STATUS_INVALID = "유효하지 않은 값입니다.";

	//view
	public static final String ARENA_NOT_FOUND = "공연장을 찾을 수 없습니다.";
	public static final String SECTION_NOT_FOUND = "구역을 찾을 수 없습니다.";
}
