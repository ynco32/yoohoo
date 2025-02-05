package com.conkiri.domain.base.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.repository.ConcertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConcertService {

	private final ConcertRepository concertRepository;

	public ConcertResponseDTO getConcertList(String concertSearch, Long lastConcertId) {

		Pageable pageable = Pageable.ofSize(10);

		return concertRepository.findConcerts(LocalDateTime.now().toLocalDate().atStartOfDay(), concertSearch, lastConcertId, pageable);
	}
}
