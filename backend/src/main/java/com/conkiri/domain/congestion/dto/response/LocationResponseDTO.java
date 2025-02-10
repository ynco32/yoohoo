package com.conkiri.domain.congestion.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.congestion.entity.Location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponseDTO {

	private List<LocationDetailResponseDTO> locations;

	public static LocationResponseDTO from(List<Location> locations) {
		return LocationResponseDTO.builder()
			.locations(locations.stream()
				.map(LocationDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
