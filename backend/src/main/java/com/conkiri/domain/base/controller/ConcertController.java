package com.conkiri.domain.base.controller;

import com.conkiri.domain.base.dto.request.ConcertCreateRequestDTO;
import com.conkiri.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.base.service.ConcertService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/concert")
public class ConcertController {

	private final ConcertService concertService;

	/**
	 * 콘서트 목록 조회
	 * @param concertSearch
	 * @param lastConcertId
	 * @return
	 */
	// @GetMapping
	// public ApiResponse<ConcertResponseDTO> getConcertList(
	// 	@RequestParam(value = "value", required = false) String concertSearch,
	// 	@RequestParam(value = "last", required = false) Long lastConcertId) {
	//
	// 	return ApiResponse.success(concertService.getConcertList(concertSearch, lastConcertId));
	// }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createConcert(@RequestBody ConcertCreateRequestDTO request) {
        Long concertId = concertService.createConcert(request);
        return ResponseEntity.ok(ApiResponse.success(concertId));
    }
}
