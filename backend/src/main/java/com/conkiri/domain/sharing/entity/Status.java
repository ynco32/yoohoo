package com.conkiri.domain.sharing.entity;

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
}
