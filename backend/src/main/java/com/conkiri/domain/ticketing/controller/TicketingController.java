package com.conkiri.domain.ticketing.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.ticketing.dto.request.TicketingRequestDTO;
import com.conkiri.domain.ticketing.dto.response.SeatResponseDTO;
import com.conkiri.domain.ticketing.dto.response.TicketingInfoResponseDTO;
import com.conkiri.domain.ticketing.dto.response.TicketingResultResponseDTO;
import com.conkiri.domain.ticketing.service.QueueProcessingService;
import com.conkiri.domain.ticketing.service.TicketingService;
import com.conkiri.global.auth.token.UserPrincipal;
import com.conkiri.global.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/ticketing")
@RequiredArgsConstructor
public class TicketingController {

	private final RedisTemplate<String, String> redisTemplate;
	private final TicketingService ticketingService;
	private final QueueProcessingService queueProcessingService;

	// 활성화 여부
	@GetMapping("/status")
	public ApiResponse<Boolean> getTicketingStatus() {
		return ApiResponse.success(queueProcessingService.isTicketingActive());
	}

	// 서버 시간 제공
	@GetMapping("/time-info")
	public ApiResponse<TicketingInfoResponseDTO> getTimeInfo() {
		return ApiResponse.success(TicketingInfoResponseDTO.from(redisTemplate));
	}

	// 대기열 진입 API
	@PostMapping("/queue")
	public ApiResponse<String> joinQueue(
		@AuthenticationPrincipal UserPrincipal userPrincipal){

		String sessionId = UUID.randomUUID().toString();
		queueProcessingService.addToQueue(userPrincipal.getUserId(), sessionId);
		return ApiResponse.success(sessionId);
	}

	// 구역 조회 API
	@GetMapping("/sections")
	public ApiResponse<List<String>> getSections() {

		return ApiResponse.success(ticketingService.getSections());
	}

	// 특정 구역에 따른 좌석 조회 API
	@GetMapping("/sections/seats")
	public ApiResponse<SeatResponseDTO> getSeatsForSection(
		@RequestParam String section) {

		return ApiResponse.success(ticketingService.getSeatsForSection(section));
	}

	// 좌석 예약 API, 이미 선택된 좌석인지 처리
	@PostMapping("/sections/seats")
	public ApiResponse<Void> reserveSeat(
		@Valid @RequestBody TicketingRequestDTO ticketingRequestDTO,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		ticketingService.reserveSeat(
			userPrincipal.getUserId(),
			ticketingRequestDTO.section(),
			ticketingRequestDTO.seat()
		);
		return ApiResponse.ofSuccess();
	}

	@GetMapping("/result")
	public ApiResponse<TicketingResultResponseDTO> getTicketingResult(
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		return ApiResponse.success(ticketingService.getTicketingResult(userPrincipal.getUserId()));
	}

	@PostMapping("/result")
	public ApiResponse<Void> saveTicketingResult(
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		ticketingService.saveTicketingResult(userPrincipal.getUserId());
		return ApiResponse.ofSuccess();
	}

	// 마이페이지용 전체 결과 조회 API
	@GetMapping("/results")
	public ApiResponse<List<TicketingResultResponseDTO>> getAllResults(
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		return ApiResponse.success(ticketingService.getAllTicketingResults(userPrincipal.getUserId()));
	}

	@DeleteMapping("/result")
	public ApiResponse<Void> deleteTicketingResult(
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		ticketingService.deleteTicketingResult(userPrincipal.getUserId());
		return ApiResponse.ofSuccess();
	}

}