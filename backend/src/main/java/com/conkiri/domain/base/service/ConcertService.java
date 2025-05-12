package com.conkiri.domain.base.service;

import com.conkiri.domain.base.dto.request.ConcertRequestDTO;
import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Artist;
import com.conkiri.domain.base.entity.Cast;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.Platform;
import com.conkiri.domain.base.entity.ConcertDetail;
import com.conkiri.domain.base.entity.VenueKeyword;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.ArtistRepository;
import com.conkiri.domain.base.repository.CastRepository;
import com.conkiri.domain.base.repository.ConcertDetailRepository;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.chatbot.entity.ConcertNotice;
import com.conkiri.domain.chatbot.repository.ConcertNoticeRepository;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
    private final ConcertNoticeRepository concertNoticeRepository;

    public Long createConcert(ConcertRequestDTO dto) {
        log.info("콘서트 생성 요청: {}", dto.concertName());

        Arena arena = findMatchingArena(dto.venueName());
        Platform platform = determineTicketingPlatform(dto.ticketingPlatform());

        Concert concert = createAndSaveConcert(dto, arena, platform);

        saveArtistsForConcert(concert, dto.artists());

        saveConcertStartTimes(concert, dto.startTimes());

        saveConcertNotice(concert, dto);

        return concert.getConcertId();
    }

    private void saveConcertNotice(Concert concert, ConcertRequestDTO dto) {
        if ((dto.noticeImageUrl() != null && !dto.noticeImageUrl().isEmpty()) ||
                (dto.noticeText() != null && !dto.noticeText().isEmpty())) {

            ConcertNotice concertNotice = ConcertNotice.of(
                    concert,
                    dto.originalUrl(),
                    dto.noticeText(),
                    dto.noticeImageUrl()
            );

            concertNoticeRepository.save(concertNotice);
        } else {
            log.info("콘서트 공지사항 정보 없음: 콘서트 ID {}", concert.getConcertId());
        }
    }

    private Platform determineTicketingPlatform(String platformName) {
        if (platformName == null || platformName.isEmpty()) {
            return null;
        }

        try {
            return Platform.valueOf(platformName.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("유효하지 않은 티켓팅 플랫폼: {}", platformName);
            return null;
        }
    }


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

    private Artist findOrCreateArtist(String artistName) {
        return artistRepository.findByArtistName(artistName)
                .orElseGet(() -> artistRepository.save(Artist.of(artistName, null)));
    }

    private Arena findMatchingArena(String arenaName) {
        if (arenaName == null || arenaName.isEmpty()) {
            log.warn("공연장 이름이 비어있음");
            return null;
        }

        VenueKeyword venue = VenueKeyword.findByVenueName(arenaName);

        if (venue != null) {
            return arenaRepository.findById(venue.getArenaId())
                    .orElseThrow(() -> new BaseException(ErrorCode.ARENA_NOT_FOUND));
        } else {
            log.warn("일치하는 공연장 없음: {}", arenaName);
            return null;
        }
    }

    public boolean checkConcertExists(String concertName) {
        return concertRepository.existsByConcertName(concertName);
    }

}