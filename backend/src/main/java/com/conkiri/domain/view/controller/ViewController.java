package com.conkiri.domain.view.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.service.ViewService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/view")
public class ViewController {

	private final ViewService viewService;

	@GetMapping("/arenas")
	public ArenaResponseDTO getArenas(){
		return viewService.getArenas();
	}

	@GetMapping("/arenas/{arenaId}")
	public SectionResponseDTO getSectionsByStageType(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType) {
		return viewService.getSectionsByStageType(arenaId, stageType);
	}
}