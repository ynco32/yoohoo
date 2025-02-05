package com.conkiri.domain.base.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
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
	@GetMapping
	public ConcertResponseDTO getConcertList(@RequestParam(value = "search", required = false) String concertSearch,
		@RequestParam(value = "last", required = false) Long lastConcertId) {
		return concertService.getConcertList(concertSearch, lastConcertId);
	}
}
