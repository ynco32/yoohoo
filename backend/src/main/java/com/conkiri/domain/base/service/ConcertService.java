package com.conkiri.domain.base.service;

import java.time.LocalDateTime;
import java.util.List;

import com.conkiri.domain.base.dto.request.ConcertCreateRequestDTO;
import com.conkiri.domain.base.entity.*;
import com.conkiri.domain.base.repository.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;

import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ConcertService {

	private final ConcertRepository concertRepository;
	private final ConcertDetailRepository concertDetailRepository;
	private final ArtistRepository artistRepository;
	private final ArenaRepository arenaRepository;
	private final CastRepository castRepository;

	@Transactional(readOnly = true)
	public ConcertResponseDTO getConcertList(String concertSearch, Long lastConcertId) {

		Pageable pageable = Pageable.ofSize(10);
		return concertRepository.findConcerts(LocalDateTime.now().toLocalDate().atStartOfDay(), concertSearch, lastConcertId, pageable);
	}

	/**
     * 크롤링한 콘서트 정보를 저장하는 메서드
     * @param dto 콘서트 생성 요청 DTO
     * @return 저장된 콘서트 ID
     */
	public Long createConcert(ConcertCreateRequestDTO dto) {
		log.info("콘서트 생성 요청: {}", dto.concertName());

		Arena arena = findMatchingArena(dto.venueName());

		Platform platform = null;
        if (dto.ticketingPlatform() != null && !dto.ticketingPlatform().isEmpty()) {
            try {
                platform = Platform.valueOf(dto.ticketingPlatform().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("유효하지 않은 티켓팅 플랫폼: {}", dto.ticketingPlatform());
                platform = Platform.INTERPARK; // 기본값: 인터파크
            }
        }
		Concert concert = Concert.builder()
            .concertName(dto.concertName())
            .arena(arena)                     
            .photoUrl(dto.photoUrl())         
            .advancedReservation(dto.advanceReservation()) 
            .reservation(dto.reservation())   
            .ticketingPlatform(platform)     
            .build();

		Concert savedConcert = concertRepository.save(concert);
        log.info("콘서트 기본 정보 저장 완료: ID = {}", savedConcert.getConcertId());

		if (dto.artists() != null && !dto.artists().isEmpty()) {
			for (String artistName : dto.artists()) {
				if (artistName != null && !artistName.trim().isEmpty()) {
					Artist artist = findOrCreateArtist(artistName);
					Cast cast = Cast.builder()
							.concert(savedConcert)
							.artist(artist)
							.build();
					castRepository.save(cast);
					log.info("출연진 정보 저장: {}", artist.getArtistName());
				}
			}
		}

		saveConcertStartTimes(savedConcert, dto.startTimes());
		return savedConcert.getConcertId();
	}

	/**
     * 콘서트 시작 시간 저장
     * @param concert 저장된 콘서트 엔티티 (부모)
     * @param startTimes 시작 시간 목록 (여러 공연 회차)
     */
	private void saveConcertStartTimes(Concert concert, List<LocalDateTime> startTimes) {
		if (startTimes == null || startTimes.isEmpty()) {
            log.info("시작 시간 정보 없음");
            return;
        }
		log.info("콘서트 시작 시간 저장: {}개", startTimes.size());

		for (LocalDateTime startTime : startTimes) {
            ConcertDetail detail = ConcertDetail.builder()
                .concert(concert)      
                .startTime(startTime)  
                .build();

            concertDetailRepository.save(detail);
        }
	}

	/**
     * 아티스트 이름으로 검색하여 존재하면 반환, 없으면 새로 생성
     * @param artistName 아티스트 이름
     * @return 기존 또는 새로 생성된 Artist 엔티티
     */
	private Artist findOrCreateArtist(String artistName) {
		String finalArtistName = (artistName == null || artistName.isEmpty())
				? "없음"
				: artistName;

		return artistRepository.findByArtistName(finalArtistName)
            .orElseGet(() -> {
                // 존재하지 않으면 새 아티스트 생성
                log.info("새 아티스트 생성: {}", finalArtistName);
                return artistRepository.save(
                    Artist.builder()
                        .artistName(finalArtistName)
                        .build()
                );
            });
	}

	private Arena findMatchingArena(String arenaName) {
		// 기본값
		Long arenaId = 1L;  // 기본 공연장 ID
		
		if (arenaName == null || arenaName.isEmpty()) {
			log.warn("공연장 이름이 비어있음. 기본 공연장(ID: 1) 사용");
		}
		// 키워드 기반 매칭
		else if (arenaName.contains("고양종합운동장")) {
			arenaId = 1L;  // 고양종합운동장 ID
		}
		else if (arenaName.contains("인스파이어")) {
			arenaId = 2L;  // 인스파이어 ID
		}
		else if (arenaName.contains("잠실실내체육관")) {
			arenaId = 3L;  // 잠실실내체육관 ID
		}
		else if (arenaName.contains("올림픽홀")) {
			arenaId = 4L;  // 올림픽홀 ID
		}
		else if (arenaName.contains("핸드볼경기장")) {
			arenaId = 5L;  // 핸드볼경기장 ID
		}
		else if (arenaName.contains("상암월드컵")) {
			arenaId = 6L;  // 상암월드컵 ID
		}
		else if (arenaName.contains("고척")) {
			arenaId = 7L;  // 고척 ID
		}
		else if (arenaName.contains("KSPO")) {
			arenaId = 8L;  // KSPO ID
		}
		else {
			log.warn("일치하는 공연장 없음. 기본 공연장(ID: 1) 사용: {}", arenaName);
		}

		return arenaRepository.findById(arenaId)
        	.orElseThrow(() -> new BaseException(ErrorCode.RESOURCE_NOT_FOUND));
	}

	public boolean checkConcertExists(String concertName) {
    return concertRepository.existsByConcertName(concertName);
	}


}