package com.conkiri.global.exception.dto;

public final class ExceptionMessage {

	private ExceptionMessage() {
	}

	// common
	public static final String USERNAME_NOT_FOUND = "해당하는 유저가 존재하지 않습니다.";
	public static final String ALREADY_EXIST_USER = "이미 존재하는 회원입니다.";
	public static final String DUPLICATE_NICKNAME = "중복된 닉네임입니다."; //CONFLICT
	public static final String INVALID_NICKNAME = "사용할 수 없는 닉네임입니다.";
	public static final String NICKNAME_NOT_EMPTY = "닉네임은 필수값 입니다.";
	public static final String ERROR_NICKNAME_LENGTH = "닉네임은 2자 이상 10자 이하여야 합니다.";
	public static final String ERROR_NICKNAME_FORMAT = "닉네임은 공백 없이 한글, 영문, 숫자만 가능합니다.";

	// Auth
	public static final String INVALID_TOKEN = "유효하지 않는 토큰입니다.";
	public static final String EXPIRED_TOKEN = "만료된 토큰입니다.";
	public static final String UNAUTHORIZED = "권한없는 접근입니다.";
	public static final String REFRESH_TOKEN_NOT_EMPTY = "refresh token은 필수값 입니다.";

	// sharing
	public static final String CONCERT_NOT_FOUND = "콘서트를 찾을 수 없습니다.";
	public static final String SEARCH_RESULT_NULL = "검색 결과를 찾을 수 없습니다.";
	public static final String SHARING_NOT_FOUND = "나눔 게시글을 찾을 수 없습니다.";
	public static final String STATUS_INVALID = "유효하지 않은 값입니다.";
	public static final String SCRAP_SHARING_NOT_FOUND = "스크랩한 나눔 게시글을 찾을 수 없습니다.";
	public static final String ALREADY_EXIST_SCRAP_SHARING = "이미 스크랩한 나눔 게시글입니다.";
	public static final String BLANK_IS_NOT_ALLOWED = "내용을 입력해주세요.";
	public static final String NULL_IS_NOT_ALLOWED = "필수값입니다.";
	public static final String COMMENT_NOT_FOUND = "댓글을 찾을 수 없습니다.";

	//view
	public static final String ARENA_NOT_FOUND = "공연장을 찾을 수 없습니다.";
	public static final String SECTION_NOT_FOUND = "구역을 찾을 수 없습니다.";
	public static final String SEAT_NOT_FOUND = "좌석을 찾을 수 없습니다.";
	public static final String DUPLICATE_SCRAP_SEAT = "이미 스크랩한 좌석입니다.";
	public static final String SCRAP_SEAT_NOT_FOUND = "스크랩하지 않은 좌석입니다.";
	public static final String DUPLICATE_REVIEW = "이미 해당 공연, 좌석에 대한 리뷰를 남겼습니다.";
	public static final String REVIEW_NOT_FOUND = "리뷰를 찾을 수 없습니다.";
	public static final String UNAUTHORIZED_ACCESS = "해당 사용자에게 권한이 없습니다.";
}
