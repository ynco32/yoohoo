package com.conkiri.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.exception.user.DuplicateNicknameException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

	private final UserRepository userRepository;
	private final UserReadService userReadService;

	public void updateNickname(String email, String nickname) {

		User user = userReadService.findUserByEmailOrElseThrow(email);
		validateNicknameDuplicate(nickname);
		user.updateNickname(nickname);
	}

	public boolean checkNicknameExists(String nickname) {
		return !userRepository.existsByNickname(nickname);
	}

	private void validateNicknameDuplicate(String nickname) {

		if (userRepository.existsByNickname(nickname)) {
			throw new DuplicateNicknameException();
		}
	}

}
