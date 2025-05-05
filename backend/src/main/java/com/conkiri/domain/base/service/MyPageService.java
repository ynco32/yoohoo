package com.conkiri.domain.base.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ReviewPhoto;
import com.conkiri.domain.view.repository.ReviewPhotoRepository;
import com.conkiri.domain.view.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {

	private final SharingRepository sharingRepository;
	private final ReviewRepository reviewRepository;
	private final ReviewPhotoRepository reviewPhotoRepository;

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

	// 마이페이지에서 회원이 작성한 시야 후기 게시글 조회
	public ReviewResponseDTO getMyReviews(User user) {

		List<Review> reviews = reviewRepository.findAllWithUserConcertSeatByUser(user);

		List<Long> reviewIds = reviews.stream()
			.map(Review::getReviewId)
			.toList();

		Map<Long, List<String>> reviewPhotoMap = reviewPhotoRepository.findAllByReviewIdIn(reviewIds).stream()
			.collect(Collectors.groupingBy(
				rp -> rp.getReview().getReviewId(),
				Collectors.mapping(ReviewPhoto::getPhotoUrl, Collectors.toList())
			));

		return ReviewResponseDTO.of(reviews, reviewPhotoMap);
	}
}
