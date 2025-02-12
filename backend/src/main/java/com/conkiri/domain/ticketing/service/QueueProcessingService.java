package com.conkiri.domain.ticketing.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.conkiri.domain.ticketing.dto.ServerMetricsDTO;
import com.conkiri.domain.ticketing.dto.response.WaitingTimeResponseDTO;
import com.conkiri.global.exception.ticketing.NotStartedTicketingException;
import com.conkiri.global.util.RedisKeys;
import com.conkiri.global.util.WebSocketConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueueProcessingService {

	private final RedisTemplate<String, String> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;
	private final ServerMonitorService serverMonitorService;

	private static final int ESTIMATED_PROCESSING_TIME = 3; // 1인당 평균 3초 예상

	// 티켓팅 시작 및 종료 시간을 Redis 에 설정합니다
	public void setTicketingTime(LocalDateTime startTime, LocalDateTime endTime) {
		log.info("Setting method ");
		redisTemplate.opsForHash().put(RedisKeys.TIME, "startTime", startTime.toString());
		redisTemplate.opsForHash().put(RedisKeys.TIME, "endTime", endTime.toString());
	}

	// 현재 시간이 티켓팅 가능 시간 범위 내인지 확인합니다.
	public boolean isTicketingActive() {

		String startTimeStr = (String)redisTemplate.opsForHash().get(RedisKeys.TIME, "startTime");
		String endTimeStr = (String)redisTemplate.opsForHash().get(RedisKeys.TIME, "endTime");
		if (startTimeStr == null || endTimeStr == null)
			return false;

		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		LocalDateTime startTime = LocalDateTime.parse(startTimeStr);
		LocalDateTime endTime = LocalDateTime.parse(endTimeStr);
		return now.isAfter(startTime) && now.isBefore(endTime);
	}

	// 사용자가 티켓팅에 참여 가능한지 확인합니다.
	public boolean canJoinTicketing(Long userId) {

		String historyKey = RedisKeys.getHistoryKey(userId);
		return !redisTemplate.hasKey(historyKey);
	}

	// 사용자를 대기열에 추가
	public void addToQueue(Long userId) {

		log.info("검증전");
		validateQueueRequest(userId);
		log.info("검증후");

		double score = System.currentTimeMillis();
		Long position = addUserToQueue(userId, score);
		log.info("포지션 획득 = " + position);
		String historyKey = RedisKeys.getHistoryKey(userId);
		saveUserQueueHistory(position, score, historyKey);
		log.info("기록");

		WaitingTimeResponseDTO waitingTimeResponseDTO = getEstimatedWaitingTime(userId);
		notifyWaitingTime(userId, waitingTimeResponseDTO);
		log.info("대기시간");
	}

	// 사용자를 Redis Sorted Set 대기열에 추가합니다.
	private Long addUserToQueue(Long userId, double score) {

		String userIdStr = String.valueOf(userId);
		redisTemplate.opsForZSet().add(RedisKeys.QUEUE, userIdStr, score);
		return getQueuePosition(Long.parseLong(userIdStr));
	}

	// 사용자의 대기열 정보를 Redis 에 저장합니다
	private void saveUserQueueHistory(Long position, double score, String historyKey) {

		redisTemplate.opsForHash().put(historyKey, "queueTime", String.valueOf(score));
		redisTemplate.opsForHash().put(historyKey, "position", String.valueOf(position));
		redisTemplate.opsForHash().put(historyKey, "totalQueue",
			String.valueOf(redisTemplate.opsForZSet().size(RedisKeys.QUEUE)));

	}

	private void notifyWaitingTime(Long userId, WaitingTimeResponseDTO waitingTime) {
		log.info("Sending waiting time to user {}, {}, {}, {}, {}", userId, waitingTime.getEstimatedWaitingSeconds(), waitingTime.getUsersAfter(), waitingTime.getUsersAhead(), waitingTime.getPosition());  // 로그 추가
		messagingTemplate.convertAndSendToUser(
			String.valueOf(userId),
			WebSocketConstants.WAITING_TIME_DESTINATION,
			waitingTime
		);
	}

	// 사용자의 현재 대기열 위치를 조회합니다.
	public Long getQueuePosition(Long userId) {
		return redisTemplate.opsForZSet().rank(RedisKeys.QUEUE, String.valueOf(userId));
	}

	// 서버 부하에 따라 대기열을 주기적으로 처리합니다.
	@Scheduled(fixedRate = 5000)  // 5초마다 체크
	public void processWaitingQueue() {

		if (!isTicketingActive()) {return;}
		log.info("@@@@@@@@@@@@@@@@@@@@ 대기열 입장 @@@@@@@@@@@@@@@@");
		ServerMetricsDTO serverLoad = serverMonitorService.getCurrentServerLoad();
		int batchSize = serverMonitorService.calculateBatchSize(serverLoad);
		processNextBatch(batchSize);
	}

	// 지정된 배치 크기만큼 대기열에서 사용자를 처리합니다.
	private void processNextBatch(int batchSize) {

		if (isQueueEmpty()) {return;}
		log.info("!!!! 큐가 비어있나봐");

		Set<String> nextBatch = fetchNextBatch(batchSize);
		if (!nextBatch.isEmpty()) {
			processUsersEntrance(nextBatch);
			updateWaitingTimes();
		}
	}

	// 대기열이 비어있는지 확인합니다.
	private boolean isQueueEmpty() {
		return redisTemplate.opsForZSet().size(RedisKeys.QUEUE) == 0;
	}

	// 다음 처리할 배치의 사용자들을 조회합니다.
	private Set<String> fetchNextBatch(int batchSize) {
		return redisTemplate.opsForZSet()
			.range(RedisKeys.QUEUE, 0, batchSize - 1);
	}

	// 배치의 사용자들을 입장 처리합니다
	private void processUsersEntrance(Set<String> userIds) {

		userIds.forEach(userId -> {
			log.info("Sending entrance notification to user: {}", userId);  // 로그 추가
			messagingTemplate.convertAndSendToUser(
				userId,
				WebSocketConstants.NOTIFICATION_DESTINATION,
				true
			);
		});
		removeProcessedUsersFromQueue(userIds.size());
	}

	// 처리 완료된 사용자들을 대기열에서 제거합니다, batchSize = 제거할 배치 크기
	private void removeProcessedUsersFromQueue(int batchSize) {
		redisTemplate.opsForZSet().removeRange(RedisKeys.QUEUE, 0, batchSize - 1);
	}

	// 모든 대기 중인 사용자들의 대기 시간을 업데이트합니다.
	private void updateWaitingTimes() {

		Set<String> waitingUsers = getAllWaitingUsers();
		waitingUsers.forEach(this::updateUserWaitingTime);
	}

	// 현재 대기 중인 모든 사용자를 조회합니다.
	private Set<String> getAllWaitingUsers() {
		return redisTemplate.opsForZSet().range(RedisKeys.QUEUE, 0, -1);
	}


	// 개별 사용자의 대기 시간을 업데이트합니다.
	private void updateUserWaitingTime(String userIdStr) {

		Long userId = Long.parseLong(userIdStr);
		WaitingTimeResponseDTO waitingTime = getEstimatedWaitingTime(userId);

		if (waitingTime != null) {
			notifyWaitingTime(userId, waitingTime);
		}
	}

	// 사용자의 예상 대기 시간을 계산합니다.
	public WaitingTimeResponseDTO getEstimatedWaitingTime(Long userId) {

		Long position = getQueuePosition(userId);
		if (position == null) {
			return null;
		}

		ServerMetricsDTO serverLoad = serverMonitorService.getCurrentServerLoad();
		int batchSize = serverMonitorService.calculateBatchSize(serverLoad);

		Long usersAhead = position;
		Long batchesRequired = (usersAhead / batchSize) + 1;
		Long estimatedSeconds = batchesRequired * batchSize * ESTIMATED_PROCESSING_TIME;
		Long totalWaiting = redisTemplate.opsForZSet().size(RedisKeys.QUEUE);
		Long usersAfter = totalWaiting - position - 1;  // 내 뒤의 대기자 수

		return WaitingTimeResponseDTO.of(position, usersAhead, estimatedSeconds, usersAfter);
	}

	// 대기열 참여 요청의 유효성을 검증합니다.
	public void validateQueueRequest(Long userId){

		// if (!canJoinTicketing(userId)) {
		// 	throw new DuplicateTicketingException();
		// }
		log.info("검증 중간");
		if (!isTicketingActive()) {
			throw new NotStartedTicketingException();
		}
	}
}
