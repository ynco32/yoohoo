package com.conkiri.domain.base.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Concert;

public interface ConcertRepository extends JpaRepository<Concert, Long>, ConcertRepositoryCustom {

	List<Concert> findByArtistContaining(String artist);

	// 특정 시간 범위 내의 startTime을 가지는 Concert조회
	List<Concert> findByStartTimeBetween(LocalDateTime now, LocalDateTime end);
	
	Optional<Concert> findConcertByConcertId(Long concertId);
}
