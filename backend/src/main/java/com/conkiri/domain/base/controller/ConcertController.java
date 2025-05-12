package com.conkiri.domain.base.controller;

import com.conkiri.domain.base.dto.request.ConcertRequestDTO;
import com.conkiri.domain.base.service.ConcertService;
import com.conkiri.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/concert")
public class ConcertController {

    private final ConcertService concertService;

    /**
     * 콘서트 목록 조회
     *
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
    public ApiResponse<Long> createConcert(@Valid @RequestBody ConcertRequestDTO request) {
        return ApiResponse.success(concertService.createConcert(request));
    }

    @GetMapping("/checkExists")
    public ApiResponse<Boolean> checkConcertExists(@RequestParam String concertName) {
        return ApiResponse.success(concertService.checkConcertExists(concertName));
    }
}
