package com.conkiri.domain.base.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;

public interface ConcertRepositoryCustom {

	ConcertResponseDTO findConcerts(LocalDateTime now, String concertSearch, Long lastConcertId, Pageable pageable);
}
