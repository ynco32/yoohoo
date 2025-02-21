package com.conkiri.global.scheduler;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.sharing.service.SharingStatusService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SharingStatusScheduler {

	private static final Logger log = LoggerFactory.getLogger(SharingStatusScheduler.class);
	private final SharingRepository sharingRepository;
	private final SharingStatusService sharingStatusService;
	private final ThreadPoolTaskScheduler taskScheduler;

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		sharingStatusService.scheduleConcertBasedStatusUpdates();
	}

	/**
	 * 일정 시간마다 startTime 이전의 Sharing 상태를 UPCOMING에서 ONGOING으로 변경
	 * 10분 마다 실행
	 */
	@Scheduled(cron = "0 */10 * * * *")
	@Transactional
	public void updateSharingToOngoing() {

		LocalDateTime now = LocalDateTime.now();
		sharingRepository.updateStatusToOngoingForUpcomingSharings(now);
	}
}
