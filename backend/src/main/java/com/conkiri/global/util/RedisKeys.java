package com.conkiri.global.util;

public class RedisKeys {

	public static final String PREFIX = "ticketing:";
	public static final String SEATS = PREFIX + "seats:";
	public static final String HISTORY = PREFIX + "history:";
	public static final String SEAT_LOCK = PREFIX + "seat:lock:";
	public static final String QUEUE = PREFIX + "queue";
	public static final String TIME = PREFIX + "time";

	public static String getSectionKey(String section) {
		return SEATS + section;
	}

	public static String getHistoryKey(Long userId) {
		return HISTORY + userId;
	}

	public static String getSeatLockKey(String section, String seat) {
		return SEAT_LOCK + section + ":" + seat;
	}
}