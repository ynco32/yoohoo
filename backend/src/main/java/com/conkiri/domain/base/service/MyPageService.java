package com.conkiri.domain.base.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
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

	/**
	 * 마이페이지에서 회원이 작성한 전체 나눔게시글 목록 조회
	 * @param lastSharingId
	 * @param userId
	 * @return
	 */
	public SharingResponseDTO getWroteList(Long lastSharingId, Long userId) {
		Pageable pageable = Pageable.ofSize(10);

		User user = findUserByIdOrElseThrow(userId);

		return sharingRepository.findWroteSharingsInMyPage(user, lastSharingId, pageable);
	}

	/**
	 * 마이페이지에서 회원이 스크랩한 전체 나눔게시글 목록 조회
	 * @param lastSharingId
	 * @param userId
	 * @return
	 */
	public SharingResponseDTO getScrappedList(Long lastSharingId, Long userId) {
		Pageable pageable = Pageable.ofSize(10);

		User user = findUserByIdOrElseThrow(userId);

		return sharingRepository.findScrappedSharingsInMyPage(user, lastSharingId, pageable);
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
