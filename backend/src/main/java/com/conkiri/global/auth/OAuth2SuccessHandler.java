package com.conkiri.global.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.conkiri.global.auth.dto.TokenDto;
import com.conkiri.global.auth.service.AuthService;
import com.conkiri.global.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;
	private final AuthService authService;

	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {
		CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
		String email = oAuth2User.getEmail();

		log.info("OAuth2 Login Success for email: {}", email);  // 로그 추가

		// 토큰 생성
		TokenDto tokens = jwtUtil.generateTokens(email);
		log.info("Generated tokens - Access: {}, Refresh: {}", tokens.getAccessToken(), tokens.getRefreshToken());  // 로그 추가

		// Refresh Token DB 저장
		authService.saveRefreshToken(email, tokens.getRefreshToken());

		// Refresh Token은 httpOnly 쿠키로 저장
		addRefreshTokenCookie(response, tokens.getRefreshToken());


		// Access Token을 secure 쿠키로 저장
		addAccessTokenCookie(response, tokens.getAccessToken());

		// CORS 헤더 설정
		response.setHeader("Access-Control-Allow-Origin", frontendUrl);
		response.setHeader("Access-Control-Allow-Credentials", "true");

		boolean isNewUser = oAuth2User.getNickname() == null;
		String targetUrl = isNewUser ? frontendUrl + "/nick" : frontendUrl + "/";
		log.info("Redirecting to: {}", targetUrl);  // 로그 추가
		response.sendRedirect(targetUrl);

	}

	private void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
		Cookie cookie = new Cookie("access_token", accessToken);
		cookie.setSecure(true);
		cookie.setPath("/");
		cookie.setDomain("localhost");
		cookie.setMaxAge(3600); // 1시간
		response.addCookie(cookie);
	}

	private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
		Cookie cookie = new Cookie("refresh_token", refreshToken);
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setPath("/");
		cookie.setMaxAge(14 * 24 * 60 * 60); // 14일
		cookie.setDomain("localhost"); // 도메인 설정 추가
		response.addCookie(cookie);
	}
}