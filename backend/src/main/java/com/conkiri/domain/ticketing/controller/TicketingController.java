package com.conkiri.domain.ticketing.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.ticketing.dto.request.TicketingRequestDTO;
import com.conkiri.domain.ticketing.dto.response.SeatResponseDTO;
import com.conkiri.domain.ticketing.service.QueueProcessingService;
import com.conkiri.domain.ticketing.service.TicketingService;
import com.conkiri.global.auth.token.UserPrincipal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/ticketing")
@RequiredArgsConstructor
public class TicketingController {

	private final TicketingService ticketingService;
	private final QueueProcessingService queueProcessingService;

	// 티켓팅 활성화여부 API, 응답으로 활성화 여부
	@GetMapping("/status")
	public boolean getTicketingStatus() {
		return queueProcessingService.isTicketingActive();
	}

	// 대기열 진입 API, 응답으로 대기번호
	@PostMapping("/queue")
	public Long joinQueue(@AuthenticationPrincipal UserPrincipal userPrincipal) {
		return queueProcessingService.addToQueue(userPrincipal.getUserId());
	}

	// 구역 조회 API
	@GetMapping("/sections")
	public List<String> getSections() {
		return ticketingService.getSections();
	}

	// 특정 구역에 따른 좌석 조회 API
	@GetMapping("/sections/seats")
	public SeatResponseDTO getSeatsForSection(@RequestParam String section) {
		return ticketingService.getSeatsForSection(section);
	}

	// 좌석 예약 API, 이미 선택된 좌석인지 처리
	@PostMapping("/sections/seats")
	public void reserveSeat(
		@Valid @RequestBody TicketingRequestDTO ticketingRequestDTO,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		ticketingService.reserveSeat(
			userPrincipal.getUserId(),
			ticketingRequestDTO.getSection(),
			ticketingRequestDTO.getSeat()
		);
	}

}