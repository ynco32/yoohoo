package com.conkiri.global.auth.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.auth.dto.TokenDTO;
import com.conkiri.global.auth.entity.Auth;
import com.conkiri.global.auth.repository.AuthRepository;
import com.conkiri.global.exception.auth.InvalidTokenException;
import com.conkiri.global.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

	private final JwtUtil jwtUtil;
	private final AuthRepository authRepository;
	private final UserReadService userReadService;

	@Value("${server.domain}")
	private String serverDomain;

	public void refreshToken(String refreshToken, HttpServletResponse response) {
		if (!jwtUtil.validateToken(refreshToken)) {
			throw new InvalidTokenException();
		}

		String email = jwtUtil.getEmailFromToken(refreshToken);
		User user = userReadService.findUserByEmailOrElseThrow(email);
		Auth savedAuth = authRepository.findByUser(user)
			.orElseThrow(() -> new InvalidTokenException());

		if (!savedAuth.getRefreshToken().equals(refreshToken)) {
			throw new InvalidTokenException();
		}

		TokenDTO newTokens = jwtUtil.generateTokens(email);
		saveRefreshToken(user, newTokens.getRefreshToken());
		addRefreshTokenCookie(response, newTokens.getRefreshToken());
		addAccessTokenCookie(response, newTokens.getAccessToken());
	}

	public void saveRefreshToken(User user, String refreshToken) {

		Auth token = authRepository.findByUser(user)
			.map(existingToken -> {
				existingToken.updateToken(
					refreshToken,
					LocalDateTime.now().plusDays(14)
				);
				return existingToken;
			})
			.orElseGet(() -> Auth.builder()
				.user(user)
				.refreshToken(refreshToken)
				.provider("KAKAO")  // 기본값 설정
				.providerId(user.getEmail())  // 임시 providerId
				.expiryDate(LocalDateTime.now().plusDays(14))
				.build());

		authRepository.save(token);
	}

	public void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
		Cookie cookie = new Cookie("access_token", accessToken);
		cookie.setSecure(false);
		cookie.setPath("/");
		cookie.setDomain(serverDomain);
		cookie.setMaxAge(10800); // 3시간
		response.addCookie(cookie);
	}

	public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
		Cookie cookie = new Cookie("refresh_token", refreshToken);
		cookie.setHttpOnly(false);
		cookie.setSecure(false);
		cookie.setPath("/");
		cookie.setMaxAge(14 * 24 * 60 * 60); // 14일
		cookie.setDomain(serverDomain); // 도메인 설정 추가
		response.addCookie(cookie);
	}

	@Transactional
	public void logout(Long userId) {
		authRepository.deleteByUser_UserId(userId);
	}
}
