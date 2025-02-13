package com.conkiri.global.auth.token;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		if (shouldNotFilter(request)) {
			//System.out.println("필터 X");
			filterChain.doFilter(request, response);
			return;
		}
		//log.info("JwtAuthenticationFilter - Processing request to: {}", request.getServletPath());
		// 토큰 추출 시도
		String token = extractTokenFromRequest(request);
		//log.info("Extracted token: {}", token);  // 디버깅용

		if (token != null) {
			try {
				if (jwtUtil.validateToken(token)) {
					String email = jwtUtil.getEmailFromToken(token);
					//log.info("Email from token: {}", email);  // 디버깅용

					User user = userRepository.findByEmail(email)
						.orElseThrow(() -> new UsernameNotFoundException("User not found"));

					// CustomOAuth2User 생성
					UserPrincipal userPrincipal = new UserPrincipal(
						Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")),
						user
					);

					UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(
							userPrincipal,
							null,
							userPrincipal.getAuthorities()
						);
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

					SecurityContextHolder.getContext().setAuthentication(authentication);
					//log.info("Authentication set in SecurityContext");  // 디버깅용
				}
			} catch (Exception e) {
				//log.error("Cannot set user authentication: {}", e.getMessage());
			}
		} else {
			//log.info("No token found in request");  // 디버깅용
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		filterChain.doFilter(request, response);
	}

	private String extractTokenFromRequest(HttpServletRequest request) {
		// Authorization 헤더에서 토큰 추출
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}

		// 쿠키에서 토큰 확인
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("access_token".equals(cookie.getName())) {
					System.out.println("cookie: " + cookie.getValue());
					return cookie.getValue();
				}
			}
		}

		return null;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getServletPath();
		return path.startsWith("/oauth2") ||
			path.startsWith("/login") ||
			path.equals("/api/v1/auth/refresh");
	}
}