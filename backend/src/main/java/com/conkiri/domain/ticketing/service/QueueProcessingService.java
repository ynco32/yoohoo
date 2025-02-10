package com.conkiri.domain.ticketing.service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.conkiri.domain.ticketing.dto.response.WaitingTimeResponseDTO;
import com.conkiri.domain.ticketing.dto.ServerMetricsDTO;
import com.conkiri.global.exception.ticketing.DuplicateTicketingException;
import com.conkiri.global.exception.ticketing.NotStartedTicketingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueueProcessingService {

	private final RedisTemplate<String, String> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;
	private final ServerMonitorService serverMonitorService;

	private static final String TICKETING_TIME_KEY = "ticketing:time";   // 티켓팅 시간 정보
	private static final String HISTORY_KEY = "ticketing:history:";
	private static final String QUEUE_KEY = "ticketing:queue";

	private static final int ESTIMATED_PROCESSING_TIME = 3; // 1인당 평균 3초 예상
	private static final long HISTORY_TTL = 24 * 60 * 60; // 24시간
	private static final int BATCH_SIZE = 10; // 배치 사이즈


	// 티켓팅 시작 및 종료 시간을 Redis에 설정합니다
	public void setTicketingTime(LocalDateTime startTime, LocalDateTime endTime) {

		redisTemplate.opsForHash().put(TICKETING_TIME_KEY, "startTime", startTime.toString());
		redisTemplate.opsForHash().put(TICKETING_TIME_KEY, "endTime", endTime.toString());
	}

	// 현재 시간이 티켓팅 가능 시간 범위 내인지 확인합니다.
	public boolean isTicketingActive() {

		String startTimeStr = (String)redisTemplate.opsForHash().get(TICKETING_TIME_KEY, "startTime");
		String endTimeStr = (String)redisTemplate.opsForHash().get(TICKETING_TIME_KEY, "endTime");
		if (startTimeStr == null || endTimeStr == null)
			return false;

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startTime = LocalDateTime.parse(startTimeStr);
		LocalDateTime endTime = LocalDateTime.parse(endTimeStr);
		return now.isAfter(startTime) && now.isBefore(endTime);
	}

	// 사용자가 티켓팅에 참여 가능한지 확인합니다.
	public boolean canJoinTicketing(Long userId) {

		String historyKey = HISTORY_KEY + userId;
		return !redisTemplate.hasKey(historyKey);
	}


	// 사용자를 대기열에 추가하고 대기 번호를 반환합니다.
	public Long addToQueue(Long userId) {

		validateQueueRequest(userId);

		double score = System.currentTimeMillis();
		Long position = addUserToQueue(userId, score);
		String historyKey = HISTORY_KEY + userId;
		saveUserQueueHistory(position, score, historyKey);

		notifyQueueStatus(userId, position, historyKey);
		return position;
	}

	// 사용자를 Redis Sorted Set 대기열에 추가합니다.
	private Long addUserToQueue(Long userId, double score) {

		String userIdStr = String.valueOf(userId);
		redisTemplate.opsForZSet().add(QUEUE_KEY, userIdStr, score);
		return getQueuePosition(Long.parseLong(userIdStr));
	}

	// 사용자의 대기열 정보를 Redis에 저장합니다
	private void saveUserQueueHistory(Long position, double score, String historyKey) {

		redisTemplate.opsForHash().put(historyKey, "queueTime", String.valueOf(score));
		redisTemplate.opsForHash().put(historyKey, "position", String.valueOf(position));
		redisTemplate.opsForHash().put(historyKey, "totalQueue",
			String.valueOf(redisTemplate.opsForZSet().size(QUEUE_KEY)));

	}

	// 대기 상태를 사용자에게 WebSocket으로 전송합니다
	private void notifyQueueStatus(Long userId, Long position, String historyKey) {

		WaitingTimeResponseDTO waitingTime = getEstimatedWaitingTime(userId);
		messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/book/waiting-time", waitingTime);
		redisTemplate.expire(historyKey, HISTORY_TTL, TimeUnit.SECONDS);

		messagingTemplate.convertAndSend("/book/queue-updates", position);
	}

	// 사용자의 현재 대기열 위치를 조회합니다.
	public Long getQueuePosition(Long userId) {
		return redisTemplate.opsForZSet().rank(QUEUE_KEY, String.valueOf(userId));
	}

	// 서버 부하에 따라 대기열을 주기적으로 처리합니다.
	@Scheduled(fixedRate = 5000)  // 5초마다 체크
	public void processWaitingQueue() {

		if (!isTicketingActive()) {return;}
		ServerMetricsDTO serverLoad = serverMonitorService.getCurrentServerLoad();
		int batchSize = serverMonitorService.calculateBatchSize(serverLoad);
		processNextBatch(batchSize);
	}

	// 지정된 배치 크기만큼 대기열에서 사용자를 처리합니다.
	private void processNextBatch(int batchSize) {

		if (isQueueEmpty()) {return;}
		Set<String> nextBatch = fetchNextBatch(batchSize);
		if (!nextBatch.isEmpty()) {
			processUsersEntrance(nextBatch);
			updateWaitingTimes();
		}
	}

	// 대기열이 비어있는지 확인합니다.
	private boolean isQueueEmpty() {
		return redisTemplate.opsForZSet().size(QUEUE_KEY) == 0;
	}

	// 다음 처리할 배치의 사용자들을 조회합니다.
	private Set<String> fetchNextBatch(int batchSize) {
		return redisTemplate.opsForZSet()
			.range(QUEUE_KEY, 0, batchSize - 1);
	}

	// 배치의 사용자들을 입장 처리합니다
	private void processUsersEntrance(Set<String> userIds) {

		userIds.forEach(userId ->
			messagingTemplate.convertAndSendToUser(
				userId,
				"/book/notification",
				"입장이 가능합니다!"
			)
		);
		removeProcessedUsersFromQueue(userIds.size());
	}

	// 처리 완료된 사용자들을 대기열에서 제거합니다, batchSize = 제거할 배치 크기
	private void removeProcessedUsersFromQueue(int batchSize) {
		redisTemplate.opsForZSet().removeRange(QUEUE_KEY, 0, batchSize - 1);
	}

	// 모든 대기 중인 사용자들의 대기 시간을 업데이트합니다.
	private void updateWaitingTimes() {

		Set<String> waitingUsers = getAllWaitingUsers();
		waitingUsers.forEach(this::updateUserWaitingTime);
	}

	// 현재 대기 중인 모든 사용자를 조회합니다.
	private Set<String> getAllWaitingUsers() {
		return redisTemplate.opsForZSet().range(QUEUE_KEY, 0, -1);
	}


	// 개별 사용자의 대기 시간을 업데이트합니다.
	private void updateUserWaitingTime(String userIdStr) {

		Long userId = Long.parseLong(userIdStr);
		WaitingTimeResponseDTO waitingTime = getEstimatedWaitingTime(userId);

		if (waitingTime != null) {
			notifyWaitingTime(userIdStr, waitingTime);
		}
	}

	// 사용자에게 업데이트된 대기 시간을 전송합니다
	private void notifyWaitingTime(String userId, WaitingTimeResponseDTO waitingTime) {

		messagingTemplate.convertAndSendToUser(
			userId,
			"/book/waiting-time",
			waitingTime
		);
	}

	// 사용자의 예상 대기 시간을 계산합니다.
	public WaitingTimeResponseDTO getEstimatedWaitingTime(Long userId) {

		Long position = getQueuePosition(userId);
		if (position == null) {
			return null;
		}

		int usersAhead = position.intValue();
		int batchesRequired = (usersAhead / BATCH_SIZE) + 1;
		int estimatedSeconds = batchesRequired * BATCH_SIZE * ESTIMATED_PROCESSING_TIME;

		return WaitingTimeResponseDTO.of(position, usersAhead, estimatedSeconds);
	}

	// 대기열 참여 요청의 유효성을 검증합니다.
	public void validateQueueRequest(Long userId){

		if (!canJoinTicketing(userId)) {
			throw new DuplicateTicketingException();
		}

		if (!isTicketingActive()) {
			throw new NotStartedTicketingException();
		}
	}
}
