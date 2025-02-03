package com.conkiri.domain.view.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.Section;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.base.repository.SeatRepository;
import com.conkiri.domain.base.repository.SectionRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.domain.view.dto.request.ReviewRequestDTO;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ViewConcertResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSeatResponseDTO;
import com.conkiri.domain.view.dto.response.ScrapSectionResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.entity.ScrapSeat;
import com.conkiri.domain.view.repository.ReviewRepository;
import com.conkiri.domain.view.repository.ScrapSeatRepository;
import com.conkiri.global.exception.auth.UnAuthorizedException;
import com.conkiri.global.exception.concert.ConcertNotFoundException;
import com.conkiri.global.exception.user.UserNotFoundException;
import com.conkiri.global.exception.view.ArenaNotFoundException;
import com.conkiri.global.exception.view.DuplicateReviewException;
import com.conkiri.global.exception.view.DuplicateScrapSeatException;
import com.conkiri.global.exception.view.ReviewNotFoundException;
import com.conkiri.global.exception.view.ScrapSeatNotFoundException;
import com.conkiri.global.exception.view.SeatNotFoundException;
import com.conkiri.global.exception.view.SectionNotFoundException;
import com.conkiri.global.exception.view.UnauthorizedAccessException;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ViewService {

	private final ArenaRepository arenaRepository;
	private final SectionRepository sectionRepository;
	private final ReviewRepository reviewRepository;
	private final SeatRepository seatRepository;
	private final UserRepository userRepository;
	private final ScrapSeatRepository scrapSeatRepository;
	private final ConcertRepository concertRepository;

	public ArenaResponseDTO getArenas() {
		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}

	public SectionResponseDTO getSectionsByStageType(Long arenaId, Integer stageType) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaId);
		List<Section> sections = sectionRepository.findByArena(arena);
		return SectionResponseDTO.of(sections, stageType);
	}

	public ReviewResponseDTO getReviews(Long arenaId, Long sectionId, Integer stageType, Long rowLine, Long columnLine) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaId);
		Section section = findSectionByArenaAndSectionIdOrElseThrow(arena, sectionId);

		if (rowLine != null && columnLine != null) {
			Seat seat = findSeatByRowAndColumnAndSectionOrElseThrow(rowLine, columnLine, section);
			return getReviewsBySeat(seat, stageType);
		}
		return getReviewsBySection(section, stageType);
	}

	public ReviewResponseDTO getReviewsBySection(Section section, Integer stageType) {
		List<Seat> seats = seatRepository.findBySection(section);
		List<Review> reviews = reviewRepository.findBySeatIn(seats);

		if (stageType != 0) { // '전체'가 아닐 경우 stageType으로 필터링
			StageType selectedType = StageType.values()[stageType];
			reviews = reviews.stream()
				.filter(review -> review.getStageType() == selectedType)
				.collect(Collectors.toList());
		}
		return ReviewResponseDTO.from(reviews);
	}

	public ReviewResponseDTO getReviewsBySeat(Seat seat, Integer stageType) {
		List<Review> reviews = reviewRepository.findBySeat(seat);

		if (stageType != 0) {
			StageType selectedType = StageType.values()[stageType];
			reviews = reviews.stream()
				.filter(review -> review.getStageType() == selectedType)
				.collect(Collectors.toList());
		}
		return ReviewResponseDTO.from(reviews);
	}

	public ScrapSectionResponseDTO getScrapedSections(Long arenaID, Integer stageType, Long userId) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaID);
		StageType selectedType = StageType.values()[stageType];
		User user = findUserByUserIdOrElseThrow(userId);

		List<ScrapSeat> scraps = scrapSeatRepository.findByUserAndStageTypeAndSeat_Section_Arena(user, selectedType, arena);
		List<Section> sections = scraps.stream()
			.map(scrapSeat -> scrapSeat.getSeat().getSection())
			.distinct()
			.collect(Collectors.toList());

		return ScrapSectionResponseDTO.from(sections);
	}

	public ScrapSeatResponseDTO getScrapsBySeat(Long arenaId, Long sectionId, Integer stageType, Long userId) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaId);
		Section section = findSectionByArenaAndSectionIdOrElseThrow(arena, sectionId);
		User user = findUserByUserIdOrElseThrow(userId);
		StageType selectedType = StageType.values()[stageType];

		List<ScrapSeat> scraps = scrapSeatRepository.findByUserAndStageTypeAndSeat_Section(user, selectedType, section);
		return ScrapSeatResponseDTO.from(scraps);
	}

	public void createScrapSeat(Long seatId, Integer stageType, Long userId) {
		Seat seat = findSeatBySeatIdOrElseThrow(seatId);
		StageType selectedType = StageType.values()[stageType];
		User user = findUserByUserIdOrElseThrow(userId);

		if (scrapSeatRepository.existsByUserAndSeatAndStageType(user, seat, selectedType)) {
			throw new DuplicateScrapSeatException();
		}

		ScrapSeat scrapSeat = ScrapSeat.createScrapSeat(user, seat, selectedType);
		scrapSeatRepository.save(scrapSeat);
	}

	public void deleteScrapSeat(Long seatId, Integer stageType, Long userId) {
		Seat seat = findSeatBySeatIdOrElseThrow(seatId);
		StageType selectedType = StageType.values()[stageType];
		User user = findUserByUserIdOrElseThrow(userId);

		ScrapSeat scrapSeat = scrapSeatRepository.findByUserAndSeatAndStageType(user, seat, selectedType)
			.orElseThrow(ScrapSeatNotFoundException::new);

		scrapSeatRepository.delete(scrapSeat);
	}

	public ViewConcertResponseDTO getConcerts(String artist) {
		List<Concert> concerts = concertRepository.findByArtistContaining(artist);
		return ViewConcertResponseDTO.from(concerts);
	}

	public void createReview(ReviewRequestDTO reviewRequestDTO, String photoUrl, Long userId) {

		User user = findUserByUserIdOrElseThrow(userId);
		Concert concert = findConcertByConcertIdOrElseThrow(reviewRequestDTO.getConcertId());
		Section section = sectionRepository.findSecctionBySectionId(reviewRequestDTO.getSectionId());

		Seat seat = findSeatByRowAndColumnAndSectionOrElseThrow(
			reviewRequestDTO.getRowLine(),
			reviewRequestDTO.getColumnLine(),
			section
		);

		if(reviewRepository.existsByUserAndSeatAndConcert(user, seat, concert)) {
			throw new DuplicateReviewException();
		}

		reviewRepository.save(Review.of(reviewRequestDTO, photoUrl, user, seat, concert));
	}

	public void updateReview(Long reviewId, ReviewRequestDTO reviewRequestDTO, String photoUrl, Long userId) {
		Review review = findReviewByReviewIdOrElseThrow(reviewId);
		User user = findUserByUserIdOrElseThrow(userId);

		// 작성자 본인 여부 확인
		if(!review.getUser().getUserId().equals(userId)) {
			throw new UnauthorizedAccessException();
		}

		Section section = sectionRepository.findSecctionBySectionId(reviewRequestDTO.getSectionId());
		Seat seat = findSeatByRowAndColumnAndSectionOrElseThrow(
			reviewRequestDTO.getRowLine(),
			reviewRequestDTO.getColumnLine(),
			section
		);

		Concert concert = findConcertByConcertIdOrElseThrow(reviewRequestDTO.getConcertId());

		if (reviewRepository.existsByUserAndSeatAndConcertAndReviewIdNot(user, seat, concert, reviewId)) {
			throw new DuplicateReviewException();
		}

		review.update(reviewRequestDTO, photoUrl, seat, concert);
	}

	public void deleteReview(Long reviewId, Long userId) {
		Review review = findReviewByReviewIdOrElseThrow(reviewId);

		if(!review.getUser().getUserId().equals(userId)) {
			throw new UnauthorizedAccessException();
		}

		reviewRepository.deleteById(reviewId);
	}

	// ---------- 내부 메서드 ----------

	private User findUserByUserIdOrElseThrow(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(UserNotFoundException::new);
	}

	private Arena findArenaByAreaIdOrElseThrow(Long arenaId) {
		return arenaRepository.findArenaByArenaId(arenaId)
			.orElseThrow(ArenaNotFoundException::new);
	}

	private Section findSectionByArenaAndSectionIdOrElseThrow(Arena arena, Long sectionId) {
		return sectionRepository.findSectionByArenaAndSectionId(arena, sectionId)
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

	private Concert findConcertByConcertIdOrElseThrow(Long concertId) {
		return concertRepository.findConcertByConcertId(concertId)
			.orElseThrow(ConcertNotFoundException::new);
	}

	private Review findReviewByReviewIdOrElseThrow(Long reviewId) {
		return reviewRepository.findReviewByReviewId(reviewId)
			.orElseThrow(ReviewNotFoundException::new);
	}
}