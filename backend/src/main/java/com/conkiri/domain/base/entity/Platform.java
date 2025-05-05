package com.conkiri.domain.base.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Platform {

	MELON("멜론티켓"),
	YES24("예스24"),
	COUPANG_PLAY("쿠팡플레이"),
	INTERPARK("인터파크");

	private final String displayName;

	public static Platform fromString(String platformName) {
		if (platformName == null) {
			return null;
		}

		return switch (platformName.toUpperCase()) {
			case "멜론", "멜론티켓", "MELON", "MELONTICKET" -> MELON;
			case "예스24", "YES24" -> YES24;
			case "쿠팡", "쿠팡플레이", "COUPANG", "COUPANGPLAY" -> COUPANG_PLAY;
			case "인터파크", "INTERPARK" -> INTERPARK;
			default -> null;
		};
	}
}
