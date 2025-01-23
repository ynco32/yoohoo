package com.conkiri.global.auth.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.global.auth.RefreshToken;
import com.conkiri.global.auth.RefreshTokenRepository;
import com.conkiri.global.auth.dto.TokenDto;
import com.conkiri.global.exception.auth.InvalidTokenException;
import com.conkiri.global.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
	private final JwtUtil jwtUtil;
	private final RefreshTokenRepository refreshTokenRepository;

	public TokenDto refreshToken(String refreshToken) {
		if (!jwtUtil.validateToken(refreshToken)) {
			throw new InvalidTokenException();
		}

		String email = jwtUtil.getEmailFromToken(refreshToken);
		RefreshToken savedRefreshToken = refreshTokenRepository.findByUserEmail(email)
			.orElseThrow(() -> new InvalidTokenException());

		if (!savedRefreshToken.getRefreshToken().equals(refreshToken)) {
			throw new InvalidTokenException();
		}

		TokenDto newTokens = jwtUtil.generateTokens(email);
		saveRefreshToken(email, newTokens.getRefreshToken());
		return newTokens;
	}

	public void logout(String email) {
		refreshTokenRepository.deleteByUserEmail(email);
	}

	public void saveRefreshToken(String email, String refreshToken) {
		// 기존 토큰이 있다면 업데이트, 없다면 새로 생성
		RefreshToken token = refreshTokenRepository.findByUserEmail(email)
			.map(existingToken -> {
				existingToken.updateToken(
					refreshToken,
					LocalDateTime.now().plusDays(14)
				);
				return existingToken;
			})
			.orElseGet(() -> RefreshToken.builder()
				.userEmail(email)
				.refreshToken(refreshToken)
				.expiryDate(LocalDateTime.now().plusDays(14))
				.build());

		refreshTokenRepository.save(token);
	}
}
