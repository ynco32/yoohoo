package com.conkiri.domain.congestion.dto.response;

import com.conkiri.domain.congestion.entity.Location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationDetailResponseDTO {

	private Integer locationNumber;
	private Double latitude;
	private Double longitude;

	public static LocationDetailResponseDTO from(Location location) {
		return LocationDetailResponseDTO.builder()
			.locationNumber(location.getLocationNumber())
			.latitude(location.getLatitude())
			.longitude(location.getLongitude())
			.build();
	}
}
