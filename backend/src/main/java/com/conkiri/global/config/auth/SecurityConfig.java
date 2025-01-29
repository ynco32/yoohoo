package com.conkiri.global.config.auth;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.conkiri.global.auth.service.handler.OAuth2SuccessHandler;
import com.conkiri.global.auth.oauth.service.OAuth2UserService;
import com.conkiri.global.auth.token.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final OAuth2UserService oAuth2UserService;
	private final OAuth2SuccessHandler oAuth2SuccessHandler;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	@Value("${frontend.url}")
	private String frontendUrl;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			//세션 비활성화
			.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			)
			//요청 권한 설정
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/v1/auth/**", "/oauth2/**", "/login/**", "/error").permitAll()
				.anyRequest().authenticated()
			)
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(userInfo ->
					userInfo.userService(oAuth2UserService)
				)
				.successHandler(oAuth2SuccessHandler)
				.failureHandler((request, response, exception) -> {
					// OAuth 실패 시 401 반환
					log.error("OAuth2 failure: ", exception);
					log.info(request.getRequestURI());
					log.info(request.getQueryString());
					log.info(request.getPathInfo());
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				})
			)
			//jwt 필터 설정
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
			// 인증 실패 핸들러 설정
            .exceptionHandling(handling -> handling
			.authenticationEntryPoint((request, response, authException) -> {
				// JWT 인증 실패 시 401 반환
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			})
		);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(frontendUrl)); // 프론트엔드 도메인
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		// 쿠키 및 Authorization 헤더 노출 허용
		configuration.setExposedHeaders(Arrays.asList("Authorization"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
