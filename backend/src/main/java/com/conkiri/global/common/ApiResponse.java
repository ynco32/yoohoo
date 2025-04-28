package com.conkiri.global.common;

import com.conkiri.global.exception.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {

	private T data;

	private ErrorCode error;

	private MetaData meta;

	public static <T> ApiResponse<T> success(T data, MetaData meta) {
		return new ApiResponse<>(data, null, meta);
	}

	// 정적 메서드로 실패 응답 생성
	public static <T> ApiResponse<T> fail(ErrorCode error, MetaData meta) {
		return new ApiResponse<>(null, error, meta);
	}
}
