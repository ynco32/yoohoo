package com.conkiri.domain.base.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.base.service.MyPageService;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.global.auth.token.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mypage")
public class MyPageController {

	private final MyPageService myPageService;

	@GetMapping("/wrote/{lastSharingId}")
	public SharingResponseDTO getWroteList(
		@PathVariable("lastSharingId") Long lastSharingId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		return myPageService.getWroteList(lastSharingId, customOAuth2User.getUserId());
	}
}
