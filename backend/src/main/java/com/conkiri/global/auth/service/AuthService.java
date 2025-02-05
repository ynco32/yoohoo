package com.conkiri.global.auth.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.auth.dto.TokenDTO;
import com.conkiri.global.auth.entity.Auth;
import com.conkiri.global.auth.repository.AuthRepository;
import com.conkiri.global.exception.auth.InvalidTokenException;
import com.conkiri.global.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

	private final JwtUtil jwtUtil;
	private final AuthRepository authRepository;
	private final UserReadService userReadService;

	public TokenDTO refreshToken(String refreshToken) {
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
		saveRefreshToken(email, newTokens.getRefreshToken());
		return newTokens;
	}

	public void logout(String email) {
		authRepository.deleteByUserEmail(email);
	}

	public void saveRefreshToken(String email, String refreshToken) {

		User user = userReadService.findUserByEmailOrElseThrow(email);
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
}
