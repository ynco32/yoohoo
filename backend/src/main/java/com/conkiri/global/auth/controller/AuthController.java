package com.conkiri.global.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.global.auth.CustomOAuth2User;
import com.conkiri.global.auth.RefreshTokenRequest;
import com.conkiri.global.auth.dto.TokenDto;
import com.conkiri.global.auth.service.AuthService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/refresh")
	public ResponseEntity<TokenDto> refreshToken(@RequestBody RefreshTokenRequest request) {
		return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(@AuthenticationPrincipal CustomOAuth2User user) {
		authService.logout(user.getEmail());
		return ResponseEntity.ok().build();
	}

}
