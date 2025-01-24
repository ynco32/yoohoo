package com.conkiri.domain.user.service;

import org.springframework.stereotype.Service;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.exception.user.UserNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public void updateNickname(String email, String nickname) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserNotFoundException());
		user.updateNickname(nickname);
	}

	public boolean checkNickname(String nickname) {
		return !userRepository.existsByNickname(nickname);
	}
}
