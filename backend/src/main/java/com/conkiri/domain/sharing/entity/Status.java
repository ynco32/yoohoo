package com.conkiri.domain.sharing.entity;

import com.conkiri.global.exception.sharing.SharingNotFoundException;
import com.conkiri.global.exception.sharing.StatusInvalidException;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Status {
	BEFORE("BEFORE", "나눔 시작 전"),
	IN_PROGRESS("IN_PROGRESS", "나눔 중"),
	FINISHED("FINISHED", "나눔 완료");

	private final String value;
	private final String responseValue;

	public static Status from(String status) {
		try {
			return Status.valueOf(status);
		} catch (IllegalArgumentException e) {
			throw new StatusInvalidException();
		}
	}
}
