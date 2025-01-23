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
import com.conkiri.global.auth.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

	private final UserRepository userRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oauth2User = super.loadUser(userRequest);

		String provider = userRequest.getClientRegistration().getRegistrationId();  // "kakao"
		String providerId = oauth2User.getName();  // OAuth2 제공자의 고유 ID

		Map<String, Object> attributes = oauth2User.getAttributes();
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

		String email = (String) kakaoAccount.get("email");
		String nickname = (String) profile.get("nickname");
		String profileImageUrl = (String) profile.get("profile_image_url");

		User user = userRepository.findByEmail(email)
			.orElseGet(() -> userRepository.save(User.builder()
				.email(email)
				.userName(nickname)
				.profileUrl(profileImageUrl)
				.provider(provider)
				.providerId(providerId)
				.build()));

		return new CustomOAuth2User(oauth2User, user);
	}
}
