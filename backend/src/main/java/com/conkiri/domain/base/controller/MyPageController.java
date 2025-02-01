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

	/**
	 * 마이페이지에서 회원이 등록한 나눔 게시글 조회
	 * @param lastSharingId
	 * @param customOAuth2User
	 * @return
	 */
	@GetMapping("/wrote/{lastSharingId}")
	public SharingResponseDTO getWroteList(
		@PathVariable("lastSharingId") Long lastSharingId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		return myPageService.getWroteList(lastSharingId, customOAuth2User.getUserId());
	}

	/**
	 * 마이페이지에서 회원이 스크랩한 나눔 게시글 조회
	 * @param lastSharingId
	 * @param customOAuth2User
	 * @return
	 */
	@GetMapping("/scrap/{lastSharingId}")
	public SharingResponseDTO getScrappedList(
		@PathVariable("lastSharingId") Long lastSharingId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		return myPageService.getScrappedList(lastSharingId, customOAuth2User.getUserId());
	}
}
