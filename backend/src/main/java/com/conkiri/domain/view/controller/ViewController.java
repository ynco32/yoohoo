package com.conkiri.domain.view.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ViewConcertResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSeatResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSectionResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.service.ViewService;
import com.conkiri.global.auth.token.CustomOAuth2User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/view")
public class ViewController {

	private final ViewService viewService;

	// 공연장 목록 조회 API
	@GetMapping("/arenas")
	public ArenaResponseDTO getArenas(){
		return viewService.getArenas();
	}

	// 무대 유형에 따른 구역 정보 조회 API
	@GetMapping("/arenas/{arenaId}/sections")
	public SectionResponseDTO getSections(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType) {
		return viewService.getSectionsByStageType(arenaId, stageType);
	}

	// 스크랩한 구역 전체 조회 API
	@GetMapping("/arenas/{arenaId}/scrapped-sections")
	public ScrapSectionResponseDTO getScrapedSections(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		return viewService.getScrapedSections(arenaId, stageType, userPrincipal.getUserId());
	}

	// 선택한 구역에서 스크랩한 좌석 전체 조회 API
	@GetMapping("/arenas/{arenaId}/scraps")
	public ScrapSeatResponseDTO getScraps(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType,
		@RequestParam(name = "section") Long sectionNumber,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		return viewService.getScrapsBySeat(arenaId, stageType, sectionNumber, userPrincipal.getUserId());
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

	// 해당 영역의 전체 후기 조회 API (구역 / 좌석)
	@GetMapping("/arenas/{arenaId}/reviews")
	public ReviewResponseDTO getReviews(
		@PathVariable Long arenaId,
		@RequestParam(name = "stageType") Integer stageType,
		@RequestParam(name = "section") Long sectionNumber,
		@RequestParam(name = "row", required = false) Long rowLine,
		@RequestParam(name = "column", required = false) Long columnLine) {
		return viewService.getReviews(arenaId, stageType, sectionNumber, rowLine, columnLine);
	}

	// 가수로 검색된 공연 전체 조회 API
	@GetMapping("/concerts")
	public ViewConcertResponseDTO getConcerts(@RequestParam(name = "artist") String artist) {
		return viewService.getConcerts(artist);
	}

	// 후기 작성 API
	@PostMapping("/reviews")
	@ResponseStatus(HttpStatus.CREATED)
	public void createReview(
		@Valid @RequestBody ReviewRequestDTO reviewRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		viewService.createReview(reviewRequestDTO, null, userPrincipal.getUserId());
	}

	// 후기 수정 API
	@PutMapping("/reviews/{reviewId}")
	public void updateReview(
		@PathVariable Long reviewId,
		@Valid @RequestBody ReviewRequestDTO reviewRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		viewService.updateReview(reviewId, reviewRequestDTO, null, userPrincipal.getUserId());
	}

	// 후기 삭제 API
	@DeleteMapping("/reviews/{reviewId}")
	public void deleteReview(
		@PathVariable Long reviewId,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal) {
		viewService.deleteReview(reviewId, userPrincipal.getUserId());
	}
}