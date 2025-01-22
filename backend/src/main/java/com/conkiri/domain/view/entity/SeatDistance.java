package com.conkiri.domain.view.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SeatDistance {

	NARROW("NARROW", "좁아요"),
	AVERAGE("AVERAGE", "평범해요"),
	WIDE("WIDE", "넓어요");

	private final String code;
	private final String description;
}