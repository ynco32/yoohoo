package com.conkiri.domain.notification.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.notification.dto.response.NotificationMessage;
import com.conkiri.domain.notification.entity.NotificationType;
import com.conkiri.domain.user.entity.User;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationSendService {

	private final NotificationProducer notificationProducer;
	private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

	/**
	 * 티켓팅 알림 메시지 생성 및 발송
	 */
	public void sendTicketingNotification(User user, Concert concert, NotificationType type) {
		try {
			NotificationMessage message = createNotificationMessage(user, concert, type);
			notificationProducer.sendNotification(message);

			log.info("알림 발송 완료: userId={}, concertId={}, type={}", user.getUserId(), concert.getConcertId(), type);
		} catch (Exception e) {
			log.error("알림 발송 실패: userId={}, concertId={}, type={}", user.getUserId(), concert.getConcertId(), type, e);
			throw new BaseException(ErrorCode.FAIL_NOTIFICATION);
		}
	}

	private NotificationMessage createNotificationMessage(User user, Concert concert, NotificationType type) {
		String title = createTitle(type);
		String body = createBody(type, concert);

		return new NotificationMessage(
			user.getUserId(),
			concert.getConcertId(),
			title,
			body,
			type,
			LocalDateTime.now()
		);
	}

	private String createTitle(NotificationType type) {
		return type.getTitle();
	}

	private String createBody(NotificationType type, Concert concert) {

		return switch (type) {
			case TICKETING_DAY -> createTicketingDayBody(concert);
			case TICKETING_SOON -> createTicketingSoonBody(concert);
			case CONCERT_DAY -> createConcertDayBody(concert);
			case CONCERT_SOON -> createConcertSoonBody(concert);
			case SYSTEM -> "시스템 알림";
		};
	}

	private String createTicketingDayBody(Concert concert) {

		LocalDateTime ticketingTime = getTicketingTime(concert);
		return String.format("오늘 %s에 %s 티켓팅이 시작됩니다.",
			ticketingTime.format(TIME_FORMATTER),
			concert.getConcertName());
	}

	private String createTicketingSoonBody(Concert concert) {

		return String.format("1시간 10분 후 %s 티켓팅이 시작됩니다.",
			concert.getConcertName());
	}

	private String createConcertDayBody(Concert concert) {

		return String.format("오늘은 %s 당일입니다.",
			concert.getConcertName());
	}

	private String createConcertSoonBody(Concert concert) {

		return String.format("1시간 후 %s이 시작됩니다.",
			concert.getConcertName());
	}

	private LocalDateTime getTicketingTime(Concert concert) {

		return concert.getAdvancedReservation() != null ?
			concert.getAdvancedReservation() : concert.getReservation();
	}
}


