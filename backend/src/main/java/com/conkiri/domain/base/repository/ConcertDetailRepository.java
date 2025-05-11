package com.conkiri.domain.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.ConcertDetail;

public interface ConcertDetailRepository extends JpaRepository<ConcertDetail, Long> {
	// // 특정 콘서트에 속한 모든 상세 정보 조회
	// List<ConcertDetail> findByConcert(Concert concert);
	//
	// // 콘서트 ID로 모든 상세 정보 조회
	// List<ConcertDetail> findConcertByConcertId(Long concertId);
}