package com.conkiri.domain.view.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSeatResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSectionResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.service.ViewService;
import com.conkiri.global.auth.token.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/view")
public class ViewController {

	private final ViewService viewService;

	// 공연장 목록 전체 조회 API
	@GetMapping("/arenas")
	public ArenaResponseDTO getArenas(){
		return viewService.getArenas();
	}

	// 무대 유형에 따른 구역 정보 전체 조회 API
	@GetMapping("/arenas/{arenaId}")
	public SectionResponseDTO getSections(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType) {
		return viewService.getSectionsByStageType(arenaId, stageType);
	}

	// 후기 조회 API (구역 전체 / 좌석 전체)
	@GetMapping("/arenas/{arenaId}/sections/{sectionId}/reviews")
	public ReviewResponseDTO getReviews(
		@PathVariable Long arenaId,
		@PathVariable Long sectionId,
		@RequestParam(name = "stageType") Integer stageType,
		@RequestParam(name = "row", required = false) Integer rowLine,
		@RequestParam(name = "column", required = false) Integer columnLine) {
		return viewService.getReviews(arenaId, sectionId, stageType, rowLine, columnLine);
	}

	// 구역 조회 시 스크랩한 좌석이 존재하는 구역 전체 조회 API
	@GetMapping("/arenas/{arenaId}/scraps")
	public ScrapSectionResponseDTO getScrapedSections(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		return viewService.getScrapedSections(arenaId, stageType, userPrincipal.getUserId());
	}

	// 좌석 조회 시 스크랩한 좌석 전제 조회 API
	@GetMapping("/arenas/{arenaId}/sections/{sectionId}/scraps")
	public ScrapSeatResponseDTO getScraps(
		@PathVariable Long arenaId,
		@PathVariable Long sectionId,
		@RequestParam(name = "stageType") Integer stageType,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		return viewService.getScrapsBySeat(arenaId, sectionId, stageType, userPrincipal.getUserId());
	}

	// 좌석 스크랩 등록 API
	@PostMapping("/scraps/{seatId}")
	public void createScrapSeat(
		@PathVariable Long seatId,
		@RequestParam(name = "stageType") Integer stageType,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		viewService.createScrapSeat(seatId, stageType, userPrincipal.getUserId());
	}

	// 좌석 스크랩 해제 API
	@DeleteMapping("/scraps/{seatId}")
	public void deleteScrapSeat(
		@PathVariable Long seatId,
		@RequestParam(name = "stageType") Integer stageType,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		viewService.deleteScrapSeat(seatId, stageType, userPrincipal.getUserId());
	}
}