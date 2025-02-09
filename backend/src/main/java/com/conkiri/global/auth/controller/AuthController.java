package com.conkiri.global.auth.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.global.auth.dto.RefreshTokenRequestDTO;
import com.conkiri.global.auth.dto.TokenDTO;
import com.conkiri.global.auth.service.AuthService;
import com.conkiri.global.auth.token.UserPrincipal;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest; // 리프레시 토큰 때문에 추가가
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

@PostMapping("/refresh")
public TokenDTO refreshToken(HttpServletRequest request) {
    // 쿠키에서 refresh_token 읽기
    String refreshToken = Arrays.stream(request.getCookies())
        .filter(cookie -> cookie.getName().equals("refresh_token"))
        .findFirst()
        .map(Cookie::getValue)
        .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));
        
    return authService.refreshToken(refreshToken.trim());
}

	@PostMapping("/refresh")
public TokenDTO refreshToken(HttpServletRequest request) {
    // 1. 쿠키에서 리프레시 토큰 추출
    String refreshToken = Arrays.stream(request.getCookies())
        .filter(cookie -> cookie.getName().equals("refresh_token"))
        .findFirst()
        .map(Cookie::getValue)
        .orElseThrow(() -> new RuntimeException("Refresh token not found"));

    // 2. 기존 서비스 로직 사용
    return authService.refreshToken(refreshToken.trim());
}

	@PostMapping("/logout")
	public void logout(@AuthenticationPrincipal UserPrincipal user) {
		authService.logout(user.getEmail());
	}

}
