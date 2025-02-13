package com.conkiri.global.auth.oauth.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.auth.entity.Auth;
import com.conkiri.global.auth.repository.AuthRepository;
import com.conkiri.global.auth.token.UserPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

	private final UserRepository userRepository;
	private final AuthRepository authRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oauth2User = super.loadUser(userRequest);
		//log.info("OAuth2 Request: {}", userRequest);

		String provider = userRequest.getClientRegistration().getRegistrationId();  // "kakao"
		String providerId = oauth2User.getName();  // OAuth2 제공자의 고유 ID

		Map<String, Object> attributes = oauth2User.getAttributes();
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

		String email = (String) kakaoAccount.get("email");
		String nickname = (String) profile.get("nickname");
		String profileImageUrl = (String) profile.get("profile_image_url");

		User user = findOrCreateUser(email, nickname, profileImageUrl);
		findOrCreateAuth(user, provider, providerId);
		return new UserPrincipal(oauth2User, user);
	}

	private User findOrCreateUser(String email, String nickname, String profileImageUrl) {
		return userRepository.findByEmail(email)
			.orElseGet(() -> createUser(email, nickname, profileImageUrl));
	}

	private User createUser(String email, String nickname, String profileImageUrl) {
		User user = User.builder()
			.email(email)
			.userName(nickname)
			.profileUrl(profileImageUrl)
			.build();
		return userRepository.save(user);
	}

	private void findOrCreateAuth(User user, String provider, String providerId) {
		authRepository.findByUser(user)
			.orElseGet(() -> createAuth(user, provider, providerId));
	}

	private Auth createAuth(User user, String provider, String providerId) {
		Auth auth = Auth.builder()
			.user(user)
			.provider(provider)
			.providerId(providerId)
			.build();
		return authRepository.save(auth);
	}
}
