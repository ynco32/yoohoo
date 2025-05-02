package com.conkiri.domain.view.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.domain.view.service.ViewService;
import com.conkiri.global.auth.token.UserPrincipal;
import com.conkiri.global.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/view")
public class ViewController {

	private final ViewService viewService;

	// 후기 작성
	@PostMapping(value = "/reviews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<Long> createReview(
		@Valid @RequestPart ReviewRequestDTO reviewRequestDTO,
		@RequestPart List<MultipartFile> files,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {

		return ApiResponse.success(viewService.createReview(reviewRequestDTO, files, userPrincipal.getUser()));
	}
}