package com.conkiri.global.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.global.auth.dto.LoginDTO;
import com.conkiri.global.auth.service.AuthService;
import com.conkiri.global.auth.token.UserPrincipal;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/refresh")
	public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
		authService.refreshToken(request, response);
	}

	@GetMapping("/login")
	public LoginDTO checkAuthStatus(
		@CookieValue(value = "access_token") String accessToken, @AuthenticationPrincipal UserPrincipal user) {
		return authService.loginStatus(accessToken, user.getNickname());
	}

	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PostMapping("/logout")
	public void logout(@AuthenticationPrincipal UserPrincipal user, HttpServletResponse response) {
		authService.logout(user.getUser(), response);
	}
}
