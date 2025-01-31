package com.conkiri.domain.base.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.exception.user.UserNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {

	private final SharingRepository sharingRepository;
	private final UserRepository userRepository;

	public SharingResponseDTO getWroteList(Long lastSharingId, Long userId) {
		Pageable pageable = Pageable.ofSize(10);

		User user = findUserByIdOrElseThrow(userId);

		Slice<Sharing> sharings = sharingRepository.findWroteSharingsInMyPage(user, lastSharingId, pageable);

		return SharingResponseDTO.from(sharings);
	}

	// ====================== 내부 메서드 ======================== //

	/**
	 * 유저를 조회하는 내부 메서드
	 * @param userId
	 */
	private User findUserByIdOrElseThrow(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(UserNotFoundException::new);
	}
}
