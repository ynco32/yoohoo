package com.conkiri.domain.view.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.view.dto.response.RowDTO;
import com.conkiri.domain.view.dto.response.SeatDTO;
import com.conkiri.domain.view.dto.response.SectionSeatsResponseDTO;
import com.conkiri.domain.view.entity.Seat;
import com.conkiri.domain.view.entity.SectionLayout;
import com.conkiri.domain.view.repository.SeatRepository;
import com.conkiri.domain.view.repository.SectionLayoutRepository;
import com.conkiri.domain.view.repository.ReviewRepository;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SectionLayoutService {

	private final SectionLayoutRepository sectionLayoutRepository;
	private final SeatRepository seatRepository;
	private final ReviewRepository reviewRepository;
	private final ObjectMapper objectMapper;

	public SectionSeatsResponseDTO getSectionSeats(Long arenaId, String section) {
		SectionLayout layout = findSectionLayout(arenaId, section);
		List<Seat> seats = findSeats(arenaId, section);
		Set<Long> reviewedSeatIds = findReviewedSeatIds(seats);

		Map<String, Seat> seatMap = seats.stream()
			.collect(Collectors.toMap(this::getSeatKey, seat -> seat));

		List<RowDTO> rowDTOs = parseLayout(layout.getLayoutData(), seatMap, reviewedSeatIds);

		return new SectionSeatsResponseDTO(section, rowDTOs);
	}

	private SectionLayout findSectionLayout(Long arenaId, String section) {
		return sectionLayoutRepository.findByArena_ArenaIdAndSection(arenaId, section)
			.orElseThrow(() -> new BaseException(ErrorCode.ENTITY_NOT_FOUND));
	}

	private List<Seat> findSeats(Long arenaId, String section) {
		return seatRepository.findByArena_ArenaIdAndSection(arenaId, section);
	}

	private Set<Long> findReviewedSeatIds(List<Seat> seats) {
		List<Long> seatIds = seats.stream()
			.map(Seat::getSeatId)
			.toList();
		return new HashSet<>(reviewRepository.findSeatIdsWithReviews(seatIds));
	}

	private List<RowDTO> parseLayout(String layoutData, Map<String, Seat> seatMap, Set<Long> reviewedSeatIds) {
		try {
			JsonNode seatMapNode = objectMapper.readTree(layoutData).path("seatMap");

			List<RowDTO> rowDTOs = new ArrayList<>();
			for (JsonNode rowNode : seatMapNode) {
				rowDTOs.add(parseRow(rowNode, seatMap, reviewedSeatIds));
			}
			return rowDTOs;
		} catch (Exception e) {
			throw new BaseException(ErrorCode.SERVER_ERROR);
		}
	}

	private RowDTO parseRow(JsonNode rowNode, Map<String, Seat> seatMap, Set<Long> reviewedSeatIds) {
		String rowName = rowNode.path("row").asText();
		List<SeatDTO> seatDTOs = new ArrayList<>();

		for (JsonNode seatNode : rowNode.path("activeSeats")) {
			int seatNumber = seatNode.path("seat").asInt();
			seatDTOs.add(createSeatDTO(rowName, seatNumber, seatMap, reviewedSeatIds));
		}

		return new RowDTO(rowName, seatDTOs);
	}

	private SeatDTO createSeatDTO(String rowName, int seatNumber, Map<String, Seat> seatMap, Set<Long> reviewedSeatIds) {
		if (seatNumber == 0) {
			return new SeatDTO(0, null, false);
		}

		String key = rowName + "-" + seatNumber;
		Seat seat = seatMap.get(key);

		if (seat == null) {
			return new SeatDTO(seatNumber, null, false);
		}

		boolean hasReview = reviewedSeatIds.contains(seat.getSeatId());
		return new SeatDTO(seatNumber, seat.getSeatId(), hasReview);
	}

	private String getSeatKey(Seat seat) {
		return convertNumberToRowName(seat.getRowLine()) + "-" + seat.getColumnLine();
	}

	private String convertNumberToRowName(Long rowNumber) {
		return String.valueOf((char) ('A' + rowNumber - 1));
	}
}

// CREATE INDEX idx_review_seat_id ON review(seat_id);