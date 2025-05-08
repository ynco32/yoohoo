package com.conkiri.domain.chatbot.repository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.chatbot.entity.ConcertNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConcertNoticeRepository extends JpaRepository<ConcertNotice, Long> {
    List<ConcertNotice> findByConcert(Concert concert);
    List<ConcertNotice> findByConcertConcertId(Long concertId);
}
