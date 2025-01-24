package com.conkiri.domain.view.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.Section;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.SeatRepository;
import com.conkiri.domain.base.repository.SectionRepository;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.ReviewResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;
import com.conkiri.domain.view.entity.Review;
import com.conkiri.domain.view.repository.ReviewRepository;
import com.conkiri.global.exception.view.ArenaNotFoundException;
import com.conkiri.global.exception.view.SectionNotFoundException;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ViewService {

	private final ArenaRepository arenaRepository;
	private final SectionRepository sectionRepository;
	private final ReviewRepository reviewRepository;
	private final SeatRepository seatRepository;

	public ArenaResponseDTO getArenas() {
		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}

	public SectionResponseDTO getSectionsByStageType(Long arenaId, Integer stageType) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaId);
		List<Section> sections = sectionRepository.findByArena(arena);
		return SectionResponseDTO.of(sections, stageType);
	}

	public ReviewResponseDTO getReviewsBySectionAndStageType(Long arenaId, Long sectionId, Integer stageType) {
		Arena arena = findArenaByAreaIdOrElseThrow(arenaId);
		Section section = findSectionByArenaAndSectionIdOrElseThrow(arena, sectionId);
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

	private Arena findArenaByAreaIdOrElseThrow(Long arenaId) {
		return arenaRepository.findArenaByArenaId(arenaId)
			.orElseThrow(ArenaNotFoundException::new);
	}

	private Section findSectionByArenaAndSectionIdOrElseThrow(Arena arena, Long sectionId) {
		return sectionRepository.findSectionByArenaAndSectionId(arena, sectionId)
			.orElseThrow(SectionNotFoundException::new);

	}
}