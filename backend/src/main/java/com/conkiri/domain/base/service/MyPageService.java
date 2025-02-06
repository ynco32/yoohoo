package com.conkiri.domain.base.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {

	private final SharingRepository sharingRepository;
	private final UserReadService userReadService;
	private final ReviewRepository reviewRepository;

	/**
	 * 마이페이지에서 회원이 작성한 전체 나눔게시글 목록 조회
	 * @param lastSharingId
	 * @param userId
	 * @return
	 */
	public SharingResponseDTO getWroteList(Long lastSharingId, Long userId) {

		Pageable pageable = Pageable.ofSize(10);
		User user = userReadService.findUserByIdOrElseThrow(userId);

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
		User user = userReadService.findUserByIdOrElseThrow(userId);

		return sharingRepository.findScrappedSharingsInMyPage(user, lastSharingId, pageable);
	}

	// 마이페이지에서 회원이 작성한 후기 게시글 조회
	public ReviewResponseDTO getReviews(Long userId) {

		User user = userReadService.findUserByIdOrElseThrow(userId);
		List<Review> reviews = reviewRepository.findByUser(user);

		return ReviewResponseDTO.from(reviews);
	}

}
