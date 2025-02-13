package com.conkiri.global.auth.service.handler;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.auth.dto.TokenDTO;
import com.conkiri.global.auth.service.AuthService;
import com.conkiri.global.auth.token.UserPrincipal;
import com.conkiri.global.util.JwtUtil;

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
	private final UserReadService userReadService;

	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {
		//log.info("OAuth2 Success Handler 진입");
		//log.info("Authentication Principal: {}", authentication.getPrincipal());
		//log.info("Received State: {}", request.getParameter("state"));
		//log.info("Received Code: {}", request.getParameter("code"));
		//log.info("OAuth2 Success: {}", authentication);
		UserPrincipal oAuth2User = (UserPrincipal) authentication.getPrincipal();
		String email = oAuth2User.getEmail();
		User user = userReadService.findUserByEmailOrElseThrow(email);

		// 토큰 생성
		TokenDTO tokens = jwtUtil.generateTokens(email);

		// Refresh Token DB 저장
		authService.saveRefreshToken(user, tokens.getRefreshToken());

		// Refresh Token 쿠키에 저장
		authService.addRefreshTokenCookie(response, tokens.getRefreshToken());

		// Access Token 쿠키에 저장
		authService.addAccessTokenCookie(response, tokens.getAccessToken());

		// CORS 헤더 설정
		response.setHeader("Access-Control-Allow-Origin", frontendUrl);
		response.setHeader("Access-Control-Allow-Credentials", "true");

		boolean isNewUser = oAuth2User.getNickname() == null;
		String targetUrl = isNewUser ? frontendUrl + "/login/nick" : frontendUrl + "/main";
		//log.info("Redirecting to: {}", targetUrl);  // 로그 추가
		response.sendRedirect(targetUrl);

	}

}