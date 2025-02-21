package com.conkiri.domain.base.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.global.exception.concert.ConcertNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConcertReadService {

	private final ConcertRepository concertRepository;

	public Concert findConcertByIdOrElseThrow(Long concertId) {
		return concertRepository.findById(concertId)
			.orElseThrow(ConcertNotFoundException::new);
	}


}
