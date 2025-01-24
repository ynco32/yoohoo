package com.conkiri.domain.view.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.View;

import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.service.ViewService;

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
	public SectionResponseDTO getSections( // 무대 유형에 따른 구역 전체 조회
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType) {
		return viewService.getSectionsByStageType(arenaId, stageType);
	}

	@GetMapping("/arenas/{arenaId}/sections/{sectionId}/reviews")
	public ReviewResponseDTO getReviews(
		@PathVariable Long arenaId,
		@PathVariable Long sectionId,
		@RequestParam(name = "stageType") Integer stageType,
		@RequestParam(name = "row", required = false) Integer rowLine,
		@RequestParam(name = "column", required = false) Integer columnLine) {

		if (rowLine != null && columnLine != null) {
			return viewService.getReviewsBySeatAndSectionAndStageType(arenaId, sectionId, stageType, rowLine, columnLine);
		}
		return viewService.getReviewsBySectionAndStageType(arenaId, sectionId, stageType);
	}
}