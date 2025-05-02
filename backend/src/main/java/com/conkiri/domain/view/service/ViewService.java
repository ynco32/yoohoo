package com.conkiri.domain.view.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.base.repository.SeatRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ReviewPhoto;
import com.conkiri.domain.view.repository.ReviewPhotoRepository;
import com.conkiri.domain.view.repository.ReviewRepository;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ViewService {

	private final ConcertRepository concertRepository;
	private final SeatRepository seatRepository;
	private final ReviewRepository reviewRepository;
	private final ReviewPhotoRepository reviewPhotoRepository;

	// 후기 작성
	public Long createReview(ReviewRequestDTO dto, List<MultipartFile> files, User user) {

		Concert concert = findConcertOrThrow(dto.concertId());
		Arena arena = concert.getArena();
		Seat seat = findSeatOrThrow(dto.section(), dto.rowLine(), dto.columnLine(), arena.getArenaId());

		Review review = Review.of(dto, user, concert, seat);

		List<String> photoUrls = files.stream()
			.map(file -> "https://example.com/dummy/" + file.getOriginalFilename())
			.toList();

		List<ReviewPhoto> photos = photoUrls.stream()
			.map(url -> ReviewPhoto.of(review, url))
			.toList();

		reviewRepository.save(review);
		reviewPhotoRepository.saveAll(photos);

		return review.getReviewId();
	}

	// 콘서트 조회
	private Concert findConcertOrThrow(Long concertId) {
		return concertRepository.findById(concertId)
			.orElseThrow(() -> new BaseException(ErrorCode.CONCERT_NOT_FOUND));
	}

	// 좌석 조회
	private Seat findSeatOrThrow(String section, Long rowLine, Long columnLine, Long arenaId) {
		return seatRepository.findSeatBySectionAndRowLineAndColumnLineAndArena_ArenaId(section, rowLine, columnLine, arenaId)
			.orElseThrow(() -> new BaseException(ErrorCode.SEAT_NOT_FOUND));
	}
}