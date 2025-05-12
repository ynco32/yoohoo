package com.conkiri.domain.base.dto.request;

import java.util.List;
import java.util.Map;

import com.conkiri.global.exception.ValidationMessage;

import jakarta.validation.constraints.NotNull;

public record ConcertListRequestDTO(

	@NotNull(message = ValidationMessage.NULL_IS_NOT_ALLOWED)
	List<Long> concertIds,
	List<Long> concertDetailIds,
	Map<Long, Boolean> entranceNotifications
) {

	public boolean isEntranceNotificationEnabled(Long concertDetailId) {
		if (entranceNotifications == null) return false;
		return entranceNotifications.getOrDefault(concertDetailId, false);
	}
}