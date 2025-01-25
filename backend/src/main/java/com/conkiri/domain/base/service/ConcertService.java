package com.conkiri.domain.base.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.repository.ConcertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConcertService {

	private final ConcertRepository concertRepository;

	public ConcertResponseDTO getConcertList(String concertSearch, Long lastConcertId) {
		Pageable pageable = Pageable.ofSize(10);

		Slice<Concert> concerts;

		if (concertSearch == null || concertSearch.isEmpty()) {
			if (lastConcertId == null) {
				concerts = concertRepository.
					findByStartTimeAfter(
						LocalDateTime.now(),
						pageable);
			} else {
				concerts = concertRepository.
					findByStartTimeAfterAndConcertIdGreaterThan(
						LocalDateTime.now(),
						lastConcertId,
						pageable);
			}
		} else {
			if (lastConcertId == null) {
				concerts = concertRepository.
					findByStartTimeAfterAndConcertNameContainingIgnoreCase(
						LocalDateTime.now(),
						concertSearch,
						pageable);
			} else {
				concerts = concertRepository.
					findByStartTimeAfterAndConcertNameContainingIgnoreCaseAndConcertIdGreaterThan(
						LocalDateTime.now(),
						concertSearch,
						lastConcertId,
						pageable);
			}
		}

		return ConcertResponseDTO.from(concerts);
	}
}
