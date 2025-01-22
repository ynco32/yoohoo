package com.conkiri.domain.base.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StageType {

	STANDARD("STANDARD", "기본형"),
	EXTENDED("EXTENDED", "돌출형"),
	DEGREE_360("DEGREE_360", "360도형");

	private final String code;
	private final String description;
}
