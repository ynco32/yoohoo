package com.conkiri.domain.ticketing.entity;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Section {

	A, B, C;

	public static List<String> getSections() {
		return Arrays.stream(values())
			.map(Enum::name)
			.collect(Collectors.toList());
	}

	public static boolean isValidSection(String section) {
		return Arrays.stream(values())
			.map(Enum::name)
			.anyMatch(s -> s.equals(section));
	}

}
