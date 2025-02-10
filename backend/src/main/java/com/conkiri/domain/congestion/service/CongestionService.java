package com.conkiri.domain.congestion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.service.ArenaReadService;
import com.conkiri.domain.congestion.dto.response.LocationResponseDTO;
import com.conkiri.domain.congestion.entity.Location;
import com.conkiri.domain.congestion.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CongestionService {

	private final LocationRepository locationRepository;
	private final ArenaReadService arenaReadService;

	public LocationResponseDTO getCongestion(Long areaId) {
		Arena arena = arenaReadService.findArenaByAreaIdOrElseThrow(areaId);

		List<Location> locations = locationRepository.findByArena(arena);

		return LocationResponseDTO.from(locations);
	}
}
