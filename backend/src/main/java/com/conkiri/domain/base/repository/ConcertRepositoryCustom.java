package com.conkiri.domain.base.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.entity.Concert;

public interface ConcertRepositoryCustom {

	ConcertResponseDTO findConcerts(LocalDateTime now, String concertSearch, Long lastConcertId, Pageable pageable);
}
