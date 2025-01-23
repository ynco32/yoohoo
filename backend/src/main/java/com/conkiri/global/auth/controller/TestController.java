package com.conkiri.global.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.user.dto.response.UserResponse;
import com.conkiri.global.auth.CustomOAuth2User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping
@Slf4j
public class TestController {

	@GetMapping("/api/test")
	public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomOAuth2User user) {
		log.info("Accessing /current-user endpoint");
		if (user == null) {
			log.warn("User is null in /current-user endpoint");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		log.info("User found: {}", user.getEmail());
		return ResponseEntity.ok(new UserResponse(
			user.getUserId(),
			user.getEmail(),
			user.getNickname(),
			user.getName(),
			null
		));
	}

	@GetMapping("/")
	public String getAccessToken(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("access_token")) {
					return cookie.getValue();
				}
			}
		}
		throw new RuntimeException("Access token not found");
	}
}