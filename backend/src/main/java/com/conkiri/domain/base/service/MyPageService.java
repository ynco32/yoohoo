package com.conkiri.domain.base.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {

	private final SharingRepository sharingRepository;

	/**
	 * 마이페이지에서 회원이 작성한 전체 나눔게시글 목록 조회
	 * @param lastSharingId
	 * @param user
	 * @return
	 */
	public SharingResponseDTO getWroteList(Long lastSharingId, User user) {

		Pageable pageable = Pageable.ofSize(10);
		return sharingRepository.findWroteSharingsInMyPage(user, lastSharingId, pageable);
	}

	/**
	 * 마이페이지에서 회원이 스크랩한 전체 나눔게시글 목록 조회
	 * @param lastSharingId
	 * @param user
	 * @return
	 */
	public SharingResponseDTO getScrappedList(Long lastSharingId, User user) {

		Pageable pageable = Pageable.ofSize(10);
		return sharingRepository.findScrappedSharingsInMyPage(user, lastSharingId, pageable);
	}
}
