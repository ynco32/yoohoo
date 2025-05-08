package com.conkiri.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotificationType {
	TICKETING_DAY("티켓팅 당일"),
	TICKETING_SOON("티켓팅 1시간 전"),
	CONCERT_DAY("공연 당일"),
	CONCERT_SOON("공연 시작 1시간 전"),
	SYSTEM("시스템 알림");

	private final String description;
}
