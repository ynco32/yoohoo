package com.conkiri.domain.view.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Sound {

	POOR("POOR", "잘 안 들려요"),
	AVERAGE("AVERAGE", "평범해요"),
	CLEAR("CLEAR", "선명해요");

	private final String code;
	private final String description;
}