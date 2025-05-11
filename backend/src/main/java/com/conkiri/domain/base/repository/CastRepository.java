package com.conkiri.domain.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Cast;

public interface CastRepository extends JpaRepository<Cast, Long> {
	// List<Cast> findConcertByConcertId(Long concertId);
}
