package com.conkiri.domain.base.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.request.ConcertRequestDTO;
import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Artist;
import com.conkiri.domain.base.entity.Cast;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.ConcertDetail;
import com.conkiri.domain.base.entity.Platform;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.ArtistRepository;
import com.conkiri.domain.base.repository.CastRepository;
import com.conkiri.domain.base.repository.ConcertDetailRepository;
import com.conkiri.domain.base.repository.ConcertRepository;
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
		return concertRepository.findConcerts(LocalDateTime.now().toLocalDate().atStartOfDay(), concertSearch,
			lastConcertId, pageable);
	}

	/**
	 * 크롤링한 콘서트 정보를 저장하는 메서드
	 *
	 * @param dto 콘서트 생성 요청 DTO
	 * @return 저장된 콘서트 ID
	 */
	public Long createConcert(ConcertRequestDTO dto) {
		log.info("콘서트 생성 요청: {}", dto.concertName());

		// 1. 필요한 엔티티 준비
		Arena arena = findMatchingArena(dto.venueName());
		Platform platform = determineTicketingPlatform(dto.ticketingPlatform());

		// 2. 콘서트 객체 생성 및 저장
		Concert concert = createAndSaveConcert(dto, arena, platform);

		// 3. 아티스트 정보 처리
		saveArtistsForConcert(concert, dto.artists());

		// 4. 콘서트 시작 시간 저장
		saveConcertStartTimes(concert, dto.startTimes());

		return concert.getConcertId();
	}

	/**
	 * 티켓팅 플랫폼 결정
	 */
	private Platform determineTicketingPlatform(String platformName) {
		if (platformName == null || platformName.isEmpty()) {
			return Platform.INTERPARK; // 기본값
		}

		try {
			return Platform.valueOf(platformName.toUpperCase());
		} catch (IllegalArgumentException e) {
			log.warn("유효하지 않은 티켓팅 플랫폼: {}", platformName);
			return Platform.INTERPARK; // 기본값
		}
	}

	/**
	 * 콘서트 생성 및 저장
	 */
	private Concert createAndSaveConcert(ConcertRequestDTO dto, Arena arena, Platform platform) {
		Concert concert = Concert.of(
			arena,
			dto.concertName(),
			dto.advanceReservation(),
			dto.reservation(),
			platform,
			dto.photoUrl()
		);

		return concertRepository.save(concert);
	}

	/**
	 * 콘서트에 출연 아티스트 정보 저장
	 */
	private void saveArtistsForConcert(Concert concert, List<String> artistNames) {
		if (artistNames == null || artistNames.isEmpty()) {
			return;
		}

		artistNames.stream()
			.filter(name -> name != null && !name.trim().isEmpty())
			.map(this::findOrCreateArtist)
			.forEach(artist -> {
				Cast cast = Cast.of(concert, artist);
				castRepository.save(cast);
			});
	}

	/**
	 * 콘서트 시작 시간 저장
	 *
	 * @param concert    저장된 콘서트 엔티티 (부모)
	 * @param startTimes 시작 시간 목록 (여러 공연 회차)
	 */
	private void saveConcertStartTimes(Concert concert, List<LocalDateTime> startTimes) {
		if (startTimes == null || startTimes.isEmpty()) {
			log.info("시작 시간 정보 없음");
			return;
		}

		for (LocalDateTime startTime : startTimes) {
			ConcertDetail detail = ConcertDetail.of(concert, startTime);
			concertDetailRepository.save(detail);
		}
	}

	/**
	 * 아티스트 이름으로 검색하여 존재하면 반환, 없으면 새로 생성
	 *
	 * @param artistName 아티스트 이름
	 * @return 기존 또는 새로 생성된 Artist 엔티티
	 */
	private Artist findOrCreateArtist(String artistName) {
		String finalArtistName = (artistName == null || artistName.isEmpty())
			? "없음"
			: artistName;

		return artistRepository.findByArtistName(finalArtistName)
			.orElseGet(() -> {
				Artist artist = Artist.of(finalArtistName, null);
				return artistRepository.save(artist);
			});
	}

	private Arena findMatchingArena(String arenaName) {
		// 기본값
		Long arenaId = 1L;  // 기본 공연장 ID

		// null 또는 빈 문자열 처리
		if (arenaName == null || arenaName.isEmpty()) {
			log.warn("공연장 이름이 비어있음. 기본 공연장(ID: 1) 사용");
			arenaId = 1L;
		} else {
			// 간단한 switch 문으로 처리
			String key = ""; // 공연장 키워드 추출

			// 공연장 키워드 찾기
			for (String venueKeyword : new String[] {"상암월드컵", "고양종합운동장", "고척",
				"인스파이어", "KSPO", "잠실실내체육관", "핸드볼경기장", "올림픽홀"}) {
				if (arenaName.contains(venueKeyword)) {
					key = venueKeyword;
					break;
				}
			}

			// 키워드 기반 switch
			switch (key) {
				case "상암월드컵" -> arenaId = 1L;
				case "고양종합운동장" -> arenaId = 2L;
				case "고척" -> arenaId = 3L;
				case "인스파이어" -> arenaId = 4L;
				case "KSPO" -> arenaId = 5L;
				case "잠실실내체육관" -> arenaId = 6L;
				case "핸드볼경기장" -> arenaId = 7L;
				case "올림픽홀" -> arenaId = 8L;
				default -> {
					log.warn("일치하는 공연장 없음. 기본 공연장(ID: 1) 사용: {}", arenaName);
					arenaId = 1L;
				}
			}
		}

		return arenaRepository.findById(arenaId)
			.orElseThrow(() -> new BaseException(ErrorCode.RESOURCE_NOT_FOUND));
	}

	public boolean checkConcertExists(String concertName) {
		return concertRepository.existsByConcertName(concertName);
	}

}