package com.conkiri.domain.base.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StageType {

	ALL(0, "ALL", "전체"),
	STANDARD(1, "STANDARD", "기본형"),
	EXTENDED(2, "EXTENDED", "돌출형"),
	DEGREE_360(3, "DEGREE_360", "360도형");

	private final Integer value;
	private final String code;
	private final String description;
}
