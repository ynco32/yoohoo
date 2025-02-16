package com.conkiri.domain.ticketing.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.conkiri.domain.ticketing.dto.response.SeatDetailResponseDTO;
import com.conkiri.domain.ticketing.dto.response.SeatResponseDTO;
import com.conkiri.domain.ticketing.dto.response.TicketingResultResponseDTO;
import com.conkiri.domain.ticketing.entity.Result;
import com.conkiri.domain.ticketing.entity.Section;
import com.conkiri.domain.ticketing.entity.Status;
import com.conkiri.domain.ticketing.repository.ResultRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.exception.ticketing.AlreadyReservedSeatException;
import com.conkiri.global.exception.ticketing.DuplicateTicketingException;
import com.conkiri.global.exception.ticketing.InvalidSeatException;
import com.conkiri.global.exception.ticketing.InvalidSectionException;
import com.conkiri.global.exception.ticketing.RecordNotFoundException;
import com.conkiri.global.util.RedisKeys;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TicketingService {

	private static final int MAX_ROW = 7;
	private static final int MAX_COL = 10;
	private final RedisTemplate<String, String> redisTemplate;
	private final UserReadService userReadService;
	private final ResultRepository resultRepository;

	// 특정 구역의 모든 좌석을 초기화
	public void initializeSeatsForSection(String section) {

		validateSection(section);
		String sectionKey = RedisKeys.getSectionKey(section);
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

	// 구역 목록 조회
	public List<String> getSections() {
		return Section.getSections();
	}

	// 특정 구역의 좌석 상태 조회
	public SeatResponseDTO getSeatsForSection(String section) {

		validateSection(section);
		Map<Object, Object> entries = redisTemplate.opsForHash().entries(RedisKeys.getSectionKey(section));
		List<SeatDetailResponseDTO> seatDetails = entries.entrySet().stream()
			.map(entry -> new SeatDetailResponseDTO(
				entry.getKey().toString(),
				entry.getValue().toString()
			))
			.collect(Collectors.toList());

		return SeatResponseDTO.from(seatDetails);
	}

	// 좌석 예약
	// * 1. request 유효성 검증
	// * 2. 좌석 락 획득
	// * 3. 좌석 유효성 검증
	// * 4. 좌석 예매
	// * 5. 좌석 락 해제
	public void reserveSeat(Long userId, String section, String seat) {

		validateReservationRequest(userId, section, seat);
		String lockKey = RedisKeys.getSeatLockKey(section, seat);

		try {
			acquireLock(lockKey);
			String sectionKey = RedisKeys.getSectionKey(section);
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

	// 실제 좌석 예매 처리
	// * 1. 좌석 상태를 Reserved 로 변경
	// * 2. 예매 히스토리 저장
	private void processSeatReservation(Long userId, String section, String seat, String sectionKey) {

		String historyKey = RedisKeys.getUserHistoryKey(userId);
		Long rank = redisTemplate.opsForValue().increment(RedisKeys.RESERVATION) + 1;
		redisTemplate.opsForHash().put(sectionKey, seat, Status.RESERVED.getValue());
		saveReservationHistory(historyKey, userId, section, seat, rank);
	}

	// 예매 정보 저장
	private void saveReservationHistory(String userHistoryKey, Long userId, String section, String seat, Long rank) {
		LocalDateTime now = LocalDateTime.now();

		// 사용자의 예매 내역 저장
		redisTemplate.opsForHash().put(userHistoryKey, "section", section);
		redisTemplate.opsForHash().put(userHistoryKey, "seat", seat);
		redisTemplate.opsForHash().put(userHistoryKey, "reserveTime", now.toString());
		redisTemplate.opsForHash().put(userHistoryKey, "rank", String.valueOf(rank));
		redisTemplate.opsForHash().put(userHistoryKey, "reserveNanoTime", String.valueOf(System.nanoTime()));  // 예매 시점의 나노타임 저장


		// 해당 좌석의 예매 내역 저장
		String seatHistoryKey = RedisKeys.getSeatHistoryKey(section, seat);
		redisTemplate.opsForHash().put(seatHistoryKey, "userId", String.valueOf(userId));
		redisTemplate.opsForHash().put(seatHistoryKey, "reserveTime", now.toString());
	}


	// 티켓팅 결과 조회
	public TicketingResultResponseDTO getTicketingResult(Long userId) {
		String historyKey = RedisKeys.getUserHistoryKey(userId);
		Map<Object, Object> history = redisTemplate.opsForHash().entries(historyKey);

		if (history.isEmpty()) {
			return null;
		}

		String section = (String) history.get("section");
		String seat = (String) history.get("seat");
		Long rank = Long.parseLong((String) history.get("rank"));

		// 소요 시간 계산 (나노초를 초로 변환, 소수점 버림)
		Long queueTime = Long.parseLong((String) history.get("queueTime"));
		Long reserveNanoTime = Long.parseLong((String) history.get("reserveNanoTime"));
		Long processingTime = (reserveNanoTime - queueTime) / 1_000_000_000;  // 나노초를 초로 변환
		LocalDateTime reserveTime = LocalDateTime.parse((String) history.get("reserveTime"));

		return new TicketingResultResponseDTO(section, seat, rank, processingTime, reserveTime);
	}


	// 결과 저장
	public void saveTicketingResult(Long userId) {
		TicketingResultResponseDTO resultDTO = getTicketingResult(userId);
		if (resultDTO == null) {
			throw new RecordNotFoundException();
		}

		User user = userReadService.findUserByIdOrElseThrow(userId);
		Result result = Result.of(resultDTO, user);
		resultRepository.save(result);
	}

	// 마이페이지용 전체 결과 조회
	public List<TicketingResultResponseDTO> getAllTicketingResults(Long userId) {
		return resultRepository.findByUser_UserIdOrderByReserveTimeDesc(userId)
			.stream()
			.map(result -> new TicketingResultResponseDTO(
				result.getSection(),
				result.getSeat(),
				result.getTicketRank(),
				result.getProcessingTime(),
				result.getReserveTime()
			))
			.collect(Collectors.toList());
	}


	//  좌석 상태 유효성 검사
	private void validateSeatAvailability(String sectionKey, String seat) {

		String currentStatus = (String)redisTemplate.opsForHash().get(sectionKey, seat);
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

		try {
			if (seat == null || !seat.matches("\\d+-\\d+")) {
				throw new InvalidSeatException();
			}

			String[] parts = seat.split("-");
			int row = Integer.parseInt(parts[0]);
			int col = Integer.parseInt(parts[1]);

			if (row < 1 || row > MAX_ROW || col < 1 || col > MAX_COL) {
				throw new InvalidSeatException();
			}
		} catch (NumberFormatException e) {
			throw new InvalidSeatException();
		}
	}

	private void validateNoExistingReservation(Long userId) {
		String userHistoryKey = RedisKeys.getUserHistoryKey(userId);
		if (redisTemplate.opsForHash().hasKey(userHistoryKey, "reserveTime")) {
			log.info("User {} already has a reservation", userId);
			throw new DuplicateTicketingException();
		}
	}

	// 유틸리티 메서드
	private String formatSeatNumber(int row, int col) {
		return row + "-" + col;
	}

	private void releaseLock(String lockKey) {
		redisTemplate.delete(lockKey);
	}

}
