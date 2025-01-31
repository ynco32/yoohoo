package com.conkiri.domain.base.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Concert;

public interface ConcertRepository extends JpaRepository<Concert, Long>, ConcertRepositoryCustom {
	// 검색어가 있는 경우
	// 초기 요청 시
	Slice<Concert> findByStartTimeAfterAndConcertNameContainingIgnoreCase(LocalDateTime now, String concertSearch, Pageable pageable);

	// No-Offset 방식(2번째 부터 조회 시)
	Slice<Concert> findByStartTimeAfterAndConcertNameContainingIgnoreCaseAndConcertIdGreaterThan(
		LocalDateTime now, String concertSearch, Long concertId, Pageable pageable);
	
	// 검색어가 없을 경우
	// 초기 요청 시
	Slice<Concert> findByStartTimeAfter(LocalDateTime now, Pageable pageable);
	
	// No-Offset 방식(2번째 부터 조회 시)
	Slice<Concert> findByStartTimeAfterAndConcertIdGreaterThan(LocalDateTime now, Long concertId, Pageable pageable);

	// 가수 이름으로 공연 찾기
	List<Concert> findByArtist(String artist);

	List<Concert> findByArtistContaining(String artist);
}
