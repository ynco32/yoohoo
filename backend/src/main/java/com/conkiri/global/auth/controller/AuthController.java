package com.conkiri.global.auth.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.global.auth.dto.RefreshTokenRequestDTO;
import com.conkiri.global.auth.service.AuthService;
import com.conkiri.global.auth.token.UserPrincipal;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/refresh")
	public void refreshToken(
		@Valid @RequestBody RefreshTokenRequestDTO request,
		HttpServletResponse response) {
		authService.refreshToken(request.getRefreshToken().trim(), response);
	}

	@PostMapping("/logout")
	public void logout(@AuthenticationPrincipal UserPrincipal user) {
		authService.logout(user.getEmail());
	}

}
