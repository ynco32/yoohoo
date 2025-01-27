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

	@GetMapping
	public ConcertResponseDTO getConcertList(
		@RequestParam(required = false, value = "search") String concertSearch,
		@RequestParam(value = "last", required = false) Long lastConcertId)
	{
		return concertService.getConcertList(concertSearch, lastConcertId);
	}
}
