package com.conkiri.global.util;

public class MapUtil {

	public static <T> T cast(Object obj, Class<T> clazz) {
		if (clazz.isInstance(obj)) {
			return (T) obj;
		}
		throw new ClassCastException("Cannot cast to " + clazz.getName());
	}
}
