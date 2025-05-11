package com.conkiri.domain.chatbot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.chatbot.entity.ConcertNotice;

public interface ConcertNoticeRepository extends JpaRepository<ConcertNotice, Long> {
	// List<ConcertNotice> findByConcert(Concert concert);

	// 추후 쓸 예정
	// List<ConcertNotice> findConcertByConcertId(Long concertId);
}
