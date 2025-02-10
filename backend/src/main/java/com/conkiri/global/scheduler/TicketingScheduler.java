package com.conkiri.global.scheduler;

import java.time.LocalDateTime;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
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

	private final TicketingService ticketingService;
	private final QueueProcessingService queueProcessingService;
	private final ThreadPoolTaskScheduler taskScheduler;

	// 서버 시작시 바로 실행 - 로컬에서 테스트할때만
	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		initializeTicketing();
	}

	// 매일 19시에 실행
	@Scheduled(cron = "0 0 16 * * *")
	public void initializeTicketing() {

		LocalDateTime startTime = LocalDateTime.now();
		LocalDateTime endTime = startTime.plusHours(4);

		queueProcessingService.setTicketingTime(startTime, endTime);
		log.info("Ticketing time set - start: {}, end: {}", startTime, endTime);

		// 구역과 좌석 초기화
		for (String section : Section.getSections()) {
			ticketingService.initializeSeatsForSection(section);
		}
		log.info("Ticketing sections and seats initialized");
	}
}
