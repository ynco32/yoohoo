package com.conkiri.domain.ticketing.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.conkiri.domain.ticketing.dto.response.SeatDetailResponseDTO;
import com.conkiri.domain.ticketing.dto.response.SeatResponseDTO;
import com.conkiri.domain.ticketing.entity.Section;
import com.conkiri.domain.ticketing.entity.Status;
import com.conkiri.global.exception.ticketing.AlreadyReservedSeatException;
import com.conkiri.global.exception.ticketing.DuplicateTicketingException;
import com.conkiri.global.exception.ticketing.InvalidSeatException;
import com.conkiri.global.exception.ticketing.InvalidSectionException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TicketingService {

	private final RedisTemplate<String, String> redisTemplate;

	private static final String SEATS_KEY = "ticketing:seats:";          // 구역별 좌석 정보
	private static final String HISTORY_KEY = "ticketing:history:";      // 사용자별 히스토리
	private static final String SEAT_LOCK_KEY = "ticketing:seat:lock:";  // 좌석 락

	private static final long HISTORY_TTL = 24 * 60 * 60; // 24시간
	private static final int MAX_ROW = 7;
	private static final int MAX_COL = 10;

	// 구역 목록 조회
	public List<String> getSections() {
		return Section.getSections();
	}

	// 특정 구역의 모든 좌석을 초기화
	public void initializeSeatsForSection(String section) {

		validateSection(section);
		String sectionKey = SEATS_KEY + section;
		redisTemplate.delete(sectionKey);

		initializeAllSeatsInSection(sectionKey);
	}

	// 모든 좌석을 Available 상태로 초기화
	private void initializeAllSeatsInSection(String sectionKey) {

		for (int row = 1; row <= MAX_ROW; row++) {
			for (int col = 1; col <= MAX_COL; col++) {
				String seat = formatSeatNumber(row, col);
				redisTemplate.opsForHash().put(sectionKey, seat, Status.AVAILABLE.getValue());
			}
		}
	}

	// 좌석 예약
	public void reserveSeat(Long userId, String section, String seat) {

		validateReservationRequest(userId, section, seat);
		String lockKey = generateLockKey(section, seat);

		try {
			acquireLock(lockKey);
			String sectionKey = getSectionKey(section);
			validateSeatAvailability(sectionKey, seat);
			processSeatReservation(userId, section, seat, sectionKey);
		} finally {
			releaseLock(lockKey);
		}
	}

	// 좌석에 대한 락 획득
	private void acquireLock(String lockKey) {

		Boolean acquired = redisTemplate.opsForValue()
			.setIfAbsent(lockKey, "LOCKED", Duration.ofSeconds(3));

		if (acquired == null || !acquired) {
			throw new AlreadyReservedSeatException();
		}
	}

	// 실제 좌석 예약 처리
	// * 1. 좌석 상태를 Reserved로 변경
	// * 2. 예약 히스토리 저장
	// * 3. TTL 설정
	private void processSeatReservation(Long userId, String section, String seat, String sectionKey) {

		String historyKey = HISTORY_KEY + userId;
		redisTemplate.opsForHash().put(sectionKey, seat, Status.RESERVED.getValue());
		saveReservationHistory(historyKey, userId, section, seat);
		redisTemplate.expire(historyKey, HISTORY_TTL, TimeUnit.SECONDS);
	}

	// 예약 정보 저장
	private void saveReservationHistory(String historyKey, Long userId, String section, String seat) {

		redisTemplate.opsForHash().put(historyKey, "section", section);
		redisTemplate.opsForHash().put(historyKey, "seat", seat);
		redisTemplate.opsForHash().put(historyKey, "userId", String.valueOf(userId));
		redisTemplate.opsForHash().put(historyKey, "reserveTime",
			String.valueOf(System.currentTimeMillis()));
	}

	// 특정 구역의 좌석 상태 조회
	public SeatResponseDTO getSeatsForSection(String section) {

		validateSection(section);
		Map<Object, Object> entries = redisTemplate.opsForHash().entries(SEATS_KEY + section);
		List<SeatDetailResponseDTO> seatDetails = entries.entrySet().stream()
			.map(entry -> {
				String seatNumber = entry.getKey().toString();
				String value = entry.getValue().toString();
				return new SeatDetailResponseDTO(
					seatNumber,
					value.equals(Status.AVAILABLE.getValue()) ? Status.AVAILABLE.getValue() : Status.RESERVED.getValue(),
					value.equals(Status.AVAILABLE.getValue()) ? null : Long.parseLong(value)
				);
			})
			.collect(Collectors.toList());

		return SeatResponseDTO.from(seatDetails);
	}


	//  좌석 상태 유효성 검사
	private void validateSeatAvailability(String sectionKey, String seat) {

		String currentStatus = (String) redisTemplate.opsForHash().get(sectionKey, seat);
		if (!Status.AVAILABLE.getValue().equals(currentStatus)) {
			throw new AlreadyReservedSeatException();
		}
	}

	// 예약 요청에 대한 전반적인 유효성 검사
	//  * 1. 구역 유효성 검사
	//  * 2. 좌석 번호 유효성 검사
	//  * 3. 중복 예약 검사
	private void validateReservationRequest(Long userId, String section, String seat) {

		validateSection(section);
		validateSeat(seat);
		validateNoExistingReservation(userId);
	}

	public void validateSection(String section) {

		if (!Section.isValidSection(section)) {
			throw new InvalidSectionException();
		}
	}

	public void validateSeat(String seat) {

		String[] parts = seat.split("-");
		int row = Integer.parseInt(parts[0]);
		int col = Integer.parseInt(parts[1]);
		if (row < 1 || row > MAX_ROW || col < 1 || col > MAX_COL)
			throw new InvalidSeatException();
	}

	private void validateNoExistingReservation(Long userId) {

		String historyKey = HISTORY_KEY + userId;
		if (redisTemplate.opsForHash().hasKey(historyKey, "seat")) {
			log.info("User {} already has a reservation", userId);
			throw new DuplicateTicketingException();
		}
	}

	// 유틸리티 메서드들
	private String formatSeatNumber(int row, int col) {
		return row + "-" + col;
	}

	private String getSectionKey(String section) {
		return SEATS_KEY + section;
	}

	private String generateLockKey(String section, String seat) {
		return SEAT_LOCK_KEY + section + ":" + seat;
	}

	private void releaseLock(String lockKey) {
		redisTemplate.delete(lockKey);
	}

}
