package com.conkiri.global.scheduler;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import com.conkiri.domain.ticketing.entity.Section;
import com.conkiri.domain.ticketing.service.QueueProcessingService;
import com.conkiri.domain.ticketing.service.TicketingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketingScheduler {

	private static final int TICKETING_START_HOUR = 0;
	private static final int TICKETING_START_MINUTE = 0;  // 추가
	private static final int TICKETING_DURATION_HOURS = 10;
	private static final String TICKETING_KEY_PATTERN = "ticketing:*";

	private final RedisTemplate<String, String> redisTemplate;
	private final TicketingService ticketingService;
	private final QueueProcessingService queueProcessingService;
	private final ThreadPoolTaskScheduler taskScheduler;

	// 애플리케이션 시작 시 티켓팅 초기화
	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		LocalDateTime todayStart = getTodayTicketingStartTime();
		LocalDateTime endTime = todayStart.plusHours(TICKETING_DURATION_HOURS);

		log.info("onReady");
		log.info("todayStart: {}", todayStart);
		log.info("endTime: {}", endTime);
		if (isWithinTicketingHours(now, todayStart, endTime)) {
			initializeTicketing(todayStart, endTime);
		}
	}

	// 매일 지정된 시작 시간(19시)에 티켓팅 시작
	@Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
	public void startTicketing() {
		LocalDateTime startTime = getTodayTicketingStartTime();
		LocalDateTime endTime = startTime.plusHours(TICKETING_DURATION_HOURS);

		initializeTicketing(startTime, endTime);
	}

	// 매일 23시에 티켓팅 데이터 정리
	@Scheduled(cron = "0 0 23 * * *", zone = "Asia/Seoul")
	public void clearTicketingData() {
		Set<String> keys = redisTemplate.keys(TICKETING_KEY_PATTERN);
		if (keys != null && !keys.isEmpty()) {
			redisTemplate.delete(keys);
			log.info("Ticketing data cleared at the end of the day");
		}
	}

	// 티켓팅 초기화 작업 수행
	private void initializeTicketing(LocalDateTime startTime, LocalDateTime endTime) {
		log.info("Initializing ticketing with start: {}, end: {}", startTime, endTime);
		setTicketingTime(startTime, endTime);
		initializeTicketingSections();
	}

	// 티켓팅 시간 설정
	private void setTicketingTime(LocalDateTime startTime, LocalDateTime endTime) {
		queueProcessingService.setTicketingTime(startTime, endTime);
		log.info("Ticketing time set - start: {}, end: {}", startTime, endTime);
	}

	// 섹션별 좌석 초기화
	private void initializeTicketingSections() {
		Section.getSections().forEach(ticketingService::initializeSeatsForSection);
		log.info("Ticketing sections and seats initialized");
	}

	// 현재 시간이 티켓팅 운영 시간 내인지 확인
	private boolean isWithinTicketingHours(LocalDateTime now, LocalDateTime startTime, LocalDateTime endTime) {
		log.info("with now: {}, start: {}, end: {}", now, startTime, endTime);
		return now.isAfter(startTime) && now.isBefore(endTime);
	}

	// 오늘의 티켓팅 시작 시간 반환
	private LocalDateTime getTodayTicketingStartTime() {
		return LocalDateTime.now(ZoneId.of("Asia/Seoul"))
			.withHour(TICKETING_START_HOUR)
			.withMinute(TICKETING_START_MINUTE)
			.withSecond(0)
			.withNano(0);
	}

	// 현재 시각의 정각 시간 반환
	private LocalDateTime getCurrentHourDateTime() {
		return LocalDateTime.now(ZoneId.of("Asia/Seoul"))
			.withMinute(TICKETING_START_MINUTE)
			.withSecond(0)
			.withNano(0);
	}
}
