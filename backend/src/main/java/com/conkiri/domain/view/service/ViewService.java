package com.conkiri.domain.view.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.Section;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.base.repository.SeatRepository;
import com.conkiri.domain.base.repository.SectionRepository;
import com.conkiri.domain.base.service.ArenaReadService;
import com.conkiri.domain.base.service.ConcertReadService;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.SeatDetailResponseDTO;
import com.conkiri.domain.view.dto.response.SeatResponseDTO;
import com.conkiri.domain.view.dto.response.SectionDetailResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.dto.response.ViewConcertResponseDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ScrapSeat;
import com.conkiri.domain.view.repository.ReviewRepository;
import com.conkiri.domain.view.repository.ScrapSeatRepository;
import com.conkiri.global.exception.view.DuplicateReviewException;
import com.conkiri.global.exception.view.DuplicateScrapSeatException;
import com.conkiri.global.exception.view.ReviewNotFoundException;
import com.conkiri.global.exception.view.ScrapSeatNotFoundException;
import com.conkiri.global.exception.view.SeatNotFoundException;
import com.conkiri.global.exception.view.SectionNotFoundException;
import com.conkiri.global.exception.view.UnauthorizedAccessException;
import com.conkiri.global.s3.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ViewService {

	private final ArenaRepository arenaRepository;
	private final SectionRepository sectionRepository;
	private final ReviewRepository reviewRepository;
	private final SeatRepository seatRepository;
	private final ScrapSeatRepository scrapSeatRepository;
	private final ConcertRepository concertRepository;
	private final UserReadService userReadService;

	private final ArenaReadService arenaReadService;
	private final ConcertReadService concertReadService;
	private final S3Service s3Service;

	public ArenaResponseDTO getArenas() {

		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}

	public SectionResponseDTO getSections(Long arenaId, Integer stageType, Long userId) {

		Arena arena = arenaReadService.findArenaByAreaIdOrElseThrow(arenaId);
		User user = userReadService.findUserByIdOrElseThrow(userId);
		StageType selectedType = StageType.fromValue(stageType);

		List<Section> sections = sectionRepository.findByArena(arena);

		return SectionResponseDTO.from(sections.stream()
			.map(section -> {
				boolean isScrapped = scrapSeatRepository.existsByUserAndSeat_SectionAndStageType(user, section, selectedType);
				return SectionDetailResponseDTO.of(section, stageType, isScrapped);
			})
			.collect(Collectors.toList()));
	}

	public SeatResponseDTO getSeats(Long arenaId, Integer stageType, Long sectionNumber, Long userId) {

		Arena arena = arenaReadService.findArenaByAreaIdOrElseThrow(arenaId);
		Section section = findSectionByArenaAndSectionNumberOrElseThrow(arena, sectionNumber);
		User user = userReadService.findUserByIdOrElseThrow(userId);
		StageType selectedType = StageType.fromValue(stageType);

		List<Seat> seats = seatRepository.findBySection(section);

		return SeatResponseDTO.from(seats.stream()
			.map(seat -> {
				boolean isScrapped = scrapSeatRepository.existsByUserAndSeatAndStageType(user, seat, selectedType);
				return SeatDetailResponseDTO.of(seat, section.getSectionNumber(), isScrapped);
			})
			.collect(Collectors.toList()));
	}

	public void createScrapSeat(Long seatId, Integer stageType, Long userId) {

		Seat seat = findSeatBySeatIdOrElseThrow(seatId);
		StageType selectedType = StageType.fromValue(stageType);
		User user = userReadService.findUserByIdOrElseThrow(userId);

		if (scrapSeatRepository.existsByUserAndSeatAndStageType(user, seat, selectedType)) {
			throw new DuplicateScrapSeatException();
		}

		ScrapSeat scrapSeat = ScrapSeat.of(user, seat, selectedType);
		scrapSeatRepository.save(scrapSeat);
	}

	public void deleteScrapSeat(Long seatId, Integer stageType, Long userId) {

		Seat seat = findSeatBySeatIdOrElseThrow(seatId);
		StageType selectedType = StageType.fromValue(stageType);
		User user = userReadService.findUserByIdOrElseThrow(userId);

		ScrapSeat scrapSeat = scrapSeatRepository.findByUserAndSeatAndStageType(user, seat, selectedType)
			.orElseThrow(ScrapSeatNotFoundException::new);

		scrapSeatRepository.delete(scrapSeat);
	}

	public ReviewResponseDTO getReviews(Long arenaId, Integer stageType, Long sectionNumber, Long seatId) {

		Arena arena = arenaReadService.findArenaByAreaIdOrElseThrow(arenaId);
		Section section = findSectionByArenaAndSectionNumberOrElseThrow(arena, sectionNumber);

		if (seatId != null) {
			Seat seat = findSeatBySeatIdOrElseThrow(seatId);
			return getReviewsBySeat(seat, stageType);
		}
		return getReviewsBySection(section, stageType);
	}

	public ReviewResponseDTO getReviewsBySection(Section section, Integer stageType) {

		List<Seat> seats = seatRepository.findBySection(section);
		List<Review> reviews = reviewRepository.findBySeatIn(seats);

		if (stageType != 0) { // '전체'가 아닐 경우 stageType으로 필터링
			StageType selectedType = StageType.fromValue(stageType);
			reviews = reviews.stream()
				.filter(review -> review.getStageType() == selectedType)
				.collect(Collectors.toList());
		}
		return ReviewResponseDTO.from(reviews);
	}

	public ReviewResponseDTO getReviewsBySeat(Seat seat, Integer stageType) {

		List<Review> reviews = reviewRepository.findBySeat(seat);

		if (stageType != 0) {
			StageType selectedType = StageType.fromValue(stageType);
			reviews = reviews.stream()
				.filter(review -> review.getStageType() == selectedType)
				.collect(Collectors.toList());
		}
		return ReviewResponseDTO.from(reviews);
	}

	public ViewConcertResponseDTO getConcerts(String artist) {

		List<Concert> concerts = concertRepository.findByArtistContaining(artist);
		return ViewConcertResponseDTO.from(concerts);
	}

	public void createReview(ReviewRequestDTO reviewRequestDTO, MultipartFile file, Long userId) {

		User user = userReadService.findUserByIdOrElseThrow(userId);
		Concert concert = concertReadService.findConcertByIdOrElseThrow(reviewRequestDTO.getConcertId());
		Arena arena = concert.getArena();
		Section section = findSectionByArenaAndSectionNumberOrElseThrow(arena, reviewRequestDTO.getSectionNumber());
		String photoUrl = s3Service.uploadImage(file, "reviews");

		Seat seat = findSeatByRowAndColumnAndSectionOrElseThrow(
			reviewRequestDTO.getRowLine(),
			reviewRequestDTO.getColumnLine(),
			section
		);

		if(reviewRepository.existsByUserAndSeatAndConcert(user, seat, concert)) {
			throw new DuplicateReviewException();
		}

		seat.increaseReviewCount();
		seatRepository.save(seat);

		reviewRepository.save(Review.of(reviewRequestDTO, photoUrl, user, seat, concert));
	}

	public void updateReview(Long reviewId, ReviewRequestDTO reviewRequestDTO, MultipartFile file, Long userId) {

		Review review = findReviewByReviewIdOrElseThrow(reviewId);
		User user = userReadService.findUserByIdOrElseThrow(userId);
		Concert concert = concertReadService.findConcertByIdOrElseThrow(reviewRequestDTO.getConcertId());
		Arena arena = concert.getArena();
		Section section = findSectionByArenaAndSectionNumberOrElseThrow(arena, reviewRequestDTO.getSectionNumber());

		// 작성자 본인 여부 확인
		if(!review.getUser().getUserId().equals(userId)) {
			throw new UnauthorizedAccessException();
		}

		Seat seat = findSeatByRowAndColumnAndSectionOrElseThrow(
			reviewRequestDTO.getRowLine(),
			reviewRequestDTO.getColumnLine(),
			section
		);

		if (reviewRepository.existsByUserAndSeatAndConcertAndReviewIdNot(user, seat, concert, reviewId)) {
			throw new DuplicateReviewException();
		}

		String oldPhotoUrl = review.getPhotoUrl();
		String newPhotoUrl = s3Service.uploadImage(file, "reviews");

		review.update(reviewRequestDTO, newPhotoUrl, seat, concert);

		if (oldPhotoUrl != null) {
			s3Service.deleteImage(oldPhotoUrl);
		}
	}

	public void deleteReview(Long reviewId, Long userId) {

		Review review = findReviewByReviewIdOrElseThrow(reviewId);

		if(!review.getUser().getUserId().equals(userId)) {
			throw new UnauthorizedAccessException();
		}

		String photoUrl = review.getPhotoUrl();
		Seat seat = review.getSeat();

		reviewRepository.deleteById(reviewId);

		seat.decreaseReviewCount();
		seatRepository.save(seat);

		if (photoUrl != null) {
			s3Service.deleteImage(photoUrl);
		}
	}

	// ---------- 내부 메서드 ----------

	private Section findSectionByArenaAndSectionNumberOrElseThrow(Arena arena, Long sectionNumber) {
		return sectionRepository.findSectionByArenaAndSectionNumber(arena, sectionNumber)
			.orElseThrow(SectionNotFoundException::new);
	}

	private Seat findSeatByRowAndColumnAndSectionOrElseThrow(Long rowLine, Long columnLine, Section section) {
		return seatRepository.findByRowLineAndColumnLineAndSection(rowLine, columnLine, section)
			.orElseThrow(SeatNotFoundException::new);
	}

	private Seat findSeatBySeatIdOrElseThrow(Long seatId) {
		return seatRepository.findById(seatId)
			.orElseThrow(SeatNotFoundException::new);
	}

	private Review findReviewByReviewIdOrElseThrow(Long reviewId) {
		return reviewRepository.findReviewByReviewId(reviewId)
			.orElseThrow(ReviewNotFoundException::new);
	}
}