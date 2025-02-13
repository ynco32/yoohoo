package com.conkiri.domain.ticketing.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;
import java.time.ZoneId;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.conkiri.domain.ticketing.dto.ServerMetricsDTO;
import com.conkiri.domain.ticketing.dto.response.WaitingTimeResponseDTO;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.exception.ticketing.DuplicateTicketingException;
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
	private final UserReadService userReadService;

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
		System.out.println(startTimeStr + " " + endTimeStr);
		if (startTimeStr == null || endTimeStr == null)
			return false;

		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		LocalDateTime startTime = LocalDateTime.parse(startTimeStr);
		LocalDateTime endTime = LocalDateTime.parse(endTimeStr);
		return now.isAfter(startTime) && now.isBefore(endTime);
	}

	// 사용자가 티켓팅에 참여 가능한지 확인합니다.
	public boolean canJoinTicketing(Long userId) {

		String userHistoryKey = RedisKeys.getUserHistoryKey(userId);

		// history가 없으면 당연히 참여 가능
		if (!redisTemplate.hasKey(userHistoryKey)) {
			return true;
		}

		// history가 있더라도, 예매 내역이 없으면(reserveTime이 없으면) 참여 가능
		String reserveTime = (String)redisTemplate.opsForHash().get(userHistoryKey, "reserveTime");
		return reserveTime == null;
	}

	// 사용자를 대기열에 추가
	public void addToQueue(Long userId) {

		validateQueueRequest(userId);

		double score = System.nanoTime();
		String historyKey = RedisKeys.getUserHistoryKey(userId);
		addUserToQueue(userId, score);

		// Redis의 rank를 이용해 정확한 position 획득 (0-based에서 1-based로 변환)
		Long zeroBasedRank = redisTemplate.opsForZSet().rank(RedisKeys.QUEUE, String.valueOf(userId));
		Long oneBasedPosition = zeroBasedRank != null ? zeroBasedRank + 1 : null;
		saveUserQueueHistory(oneBasedPosition, score, historyKey);

		WaitingTimeResponseDTO waitingTimeResponseDTO = getEstimatedWaitingTime(userId);
		notifyWaitingTime(userId, waitingTimeResponseDTO);

		// 1등이면 대기번호를 보여준 후 입장 처리
		if (oneBasedPosition != null && oneBasedPosition == 1) {
			processUsersEntrance(Set.of(String.valueOf(userId)));
		}
	}

	// 사용자를 Redis Sorted Set 대기열에 추가합니다.
	private void addUserToQueue(Long userId, double score) {

		String userIdStr = String.valueOf(userId);
		redisTemplate.opsForZSet().add(RedisKeys.QUEUE, userIdStr, score);
	}

	// 사용자의 대기열 정보를 Redis 에 저장합니다
	private void saveUserQueueHistory(Long position, double score, String historyKey) {

		redisTemplate.opsForHash().put(historyKey, "queueTime", String.valueOf(score));
		redisTemplate.opsForHash().put(historyKey, "position", String.valueOf(position));
		log.info("Saved user history - position: {}, score: {}", position, score);
	}

	private void notifyWaitingTime(Long userId, WaitingTimeResponseDTO waitingTime) {
		log.info("Sending waiting time to user {}, {}, {}, {}", userId, waitingTime.getEstimatedWaitingSeconds(),
			waitingTime.getUsersAfter(), waitingTime.getPosition());  // 로그 추가
		User user = userReadService.findUserByIdOrElseThrow(userId);
		messagingTemplate.convertAndSendToUser(
			user.getEmail(),
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

		if (!isTicketingActive()) {
			return;
		}
		ServerMetricsDTO serverLoad = serverMonitorService.getCurrentServerLoad();
		int batchSize = serverMonitorService.calculateBatchSize(serverLoad);
		processNextBatch(batchSize);
	}

	// 지정된 배치 크기만큼 대기열에서 사용자를 처리합니다.
	private void processNextBatch(int batchSize) {

		if (isQueueEmpty()) {
			return;
		}
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
			User user = userReadService.findUserByIdOrElseThrow(Long.parseLong(userId));
			log.info("Sending entrance notification to user: {}", userId);  // 로그 추가
			messagingTemplate.convertAndSendToUser(
				user.getEmail(),
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

	public WaitingTimeResponseDTO getEstimatedWaitingTime(Long userId) {
		Long position = getQueuePosition(userId);
		if (position == null) {
			// 대기열에 없는 경우 0으로 초기화된 응답 반환
			return WaitingTimeResponseDTO.of(0L, 0L, 0L, 0L);
		}

		ServerMetricsDTO serverLoad = serverMonitorService.getCurrentServerLoad();
		int batchSize = serverMonitorService.calculateBatchSize(serverLoad);

		// 대기번호는 1부터 시작하도록
		Long waitingNumber = position + 1L;
		Long usersAhead = position;  // 앞에 있는 사람 수는 position 그대로
		boolean isInFirstBatch = usersAhead < batchSize;

		// 대기 시간 계산
		Long estimatedSeconds = isInFirstBatch ? 5L : ((usersAhead + batchSize - 1) / batchSize) * 5L;
		Long totalWaiting = redisTemplate.opsForZSet().size(RedisKeys.QUEUE);
		// 뒤에 있는 사람 수 계산 수정
		Long usersAfter = Math.max(0L, totalWaiting - waitingNumber);

		return WaitingTimeResponseDTO.of(waitingNumber, usersAhead, estimatedSeconds, usersAfter);
	}

	// 대기열 참여 요청의 유효성을 검증합니다.
	public void validateQueueRequest(Long userId) {

		if (!canJoinTicketing(userId)) {
			throw new DuplicateTicketingException();
		}
		if (!isTicketingActive()) {
			throw new NotStartedTicketingException();
		}
	}
}
