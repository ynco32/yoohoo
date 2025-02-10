package com.conkiri.domain.congestion.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.congestion.dto.response.LocationResponseDTO;
import com.conkiri.domain.congestion.service.CongestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/congestion")
@RequiredArgsConstructor
public class CongestionController {

	private final CongestionService congestionService;

	@GetMapping("/{arenaId}")
	public LocationResponseDTO getCongestionLocation(@PathVariable("arenaId") Long arenaId) {
		return congestionService.getCongestion(arenaId);
	}
}
