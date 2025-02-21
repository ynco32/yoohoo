package com.conkiri.domain.ticketing.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Status {

	AVAILABLE("AVAILABLE", "예약 가능"),
	RESERVED("RESERVED", "예약됨");

	private final String value;
	private final String description;
}
