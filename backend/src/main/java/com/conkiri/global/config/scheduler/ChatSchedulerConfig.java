package com.conkiri.global.config.scheduler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import com.conkiri.domain.place.entity.ChatMessage;
import com.conkiri.domain.place.entity.ChatRoom;
import com.conkiri.domain.place.repository.ChatMessageRepository;
import com.conkiri.domain.place.repository.ChatRoomRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.service.UserReadService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatSchedulerConfig {

	private final PlatformTransactionManager transactionManager;
	private final ChatMessageRepository messageRepository;
	private final ChatRoomRepository chatRoomRepository;
	private final RedisTemplate<String, Object> chatRedisTemplate;
	private final UserReadService userReadService;

	// 1분마다 실행 (테스트를 위해 60초로 유지)
	@Scheduled(fixedDelay = 60000)
	public void saveMessagesToDatabase() {
		log.info("시작: Redis 메시지 → MySQL DB 저장");

		Set<String> keys = chatRedisTemplate.keys("chat:pending:*");
		if (keys == null || keys.isEmpty()) {
			log.info("저장할 메시지 없음");
			return;
		}

		log.info("저장할 채팅방 수: {}", keys.size());

		TransactionTemplate txTemplate = new TransactionTemplate(transactionManager);

		for (String key : keys) {
			try {
				txTemplate.execute(status -> {
					saveMessagesForRoom(key);
					return null;
				});
			} catch (Exception e) {
				log.error("채팅방 메시지 저장 실패: {}, 오류: {}", key, e.getMessage(), e);
				// 이 채팅방에 대한 처리는 실패했지만, 다른 채팅방은 계속 처리
			}
		}

		log.info("완료: Redis 메시지 → MySQL DB 저장");
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveMessagesForRoom(String key) {
		Long chatRoomId = extractChatRoomId(key);
		if (chatRoomId == null) return;

		log.info("채팅방 {} 메시지 저장 시작", chatRoomId);

		ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
			.orElseThrow(() -> new IllegalStateException("채팅방을 찾을 수 없음: " + chatRoomId));

		List<Object> redisMessages = chatRedisTemplate.opsForList().range(key, 0, -1);
		if (redisMessages == null || redisMessages.isEmpty()) {
			log.info("채팅방 {} 저장할 메시지 없음", chatRoomId);
			return;
		}

		log.info("채팅방 {} 저장할 메시지 수: {}", chatRoomId, redisMessages.size());

		try {
			// 메시지를 시간순으로 정렬 (중요!)
			List<Map<String, Object>> orderedMessages = redisMessages.stream()
				.filter(msgObj -> msgObj instanceof Map)
				.map(msgObj -> {
					@SuppressWarnings("unchecked")
					Map<String, Object> msgMap = (Map<String, Object>) msgObj;
					return msgMap;
				})
				.sorted((m1, m2) -> {
					Object createdAt1 = m1.get("createdAt");
					Object createdAt2 = m2.get("createdAt");
					if (createdAt1 == null || createdAt2 == null) return 0;
					return createdAt1.toString().compareTo(createdAt2.toString());
				})
				.toList();

			log.info("메시지 정렬 완료. 정렬된 메시지 수: {}", orderedMessages.size());

			// 정렬된 메시지 순서대로 처리를 위한 맵
			Map<String, ChatMessage> tempIdToMessageMap = new HashMap<>();

			// 1차: 일반 메시지 저장
			List<ChatMessage> normalMessages = new ArrayList<>();

			for (Map<String, Object> msgMap : orderedMessages) {
				try {
					// 부모 메시지 체크
					Object parentTempIdObj = msgMap.get("parentTempId");
					Object parentMsgIdObj = msgMap.get("parentMessageId");

					boolean isNormalMsg = (parentTempIdObj == null || parentTempIdObj.toString().isBlank())
						&& (parentMsgIdObj == null);

					if (isNormalMsg) {
						String tempId = (String) msgMap.get("tempId");
						Long senderId = ((Number) msgMap.get("senderId")).longValue();
						String content = (String) msgMap.get("content");

						log.info("일반 메시지 처리: tempId={}, senderId={}, content={}",
							tempId, senderId, content);

						User user = userReadService.findUserByIdOrElseThrow(senderId);
						ChatMessage msg = ChatMessage.of(user, chatRoom, content, tempId);
						tempIdToMessageMap.put(tempId, msg);
						normalMessages.add(msg);
					}
				} catch (Exception e) {
					log.error("메시지 변환 중 오류: {}", e.getMessage(), e);
				}
			}

			log.info("저장할 일반 메시지 수: {}", normalMessages.size());

			if (!normalMessages.isEmpty()) {
				messageRepository.saveAll(normalMessages);
				log.info("채팅방 {} 일반 메시지 {} 개 저장 완료", chatRoomId, normalMessages.size());
			}

			// 2차: 답글 메시지 저장
			List<ChatMessage> replyMessages = new ArrayList<>();

			for (Map<String, Object> msgMap : orderedMessages) {
				try {
					Object parentTempIdObj = msgMap.get("parentTempId");
					Object parentMsgIdObj = msgMap.get("parentMessageId");

					boolean isReplyMsg = (parentTempIdObj != null && !parentTempIdObj.toString().isBlank())
						|| (parentMsgIdObj != null);

					if (isReplyMsg) {
						String tempId = (String) msgMap.get("tempId");
						Long senderId = ((Number) msgMap.get("senderId")).longValue();
						String content = (String) msgMap.get("content");

						log.info("답글 메시지 처리: tempId={}, senderId={}, parentTempId={}, parentMsgId={}",
							tempId, senderId, parentTempIdObj, parentMsgIdObj);

						User user = userReadService.findUserByIdOrElseThrow(senderId);
						ChatMessage reply = ChatMessage.of(user, chatRoom, content, tempId);

						boolean parentSet = false;

						// 부모 메시지 설정
						if (parentTempIdObj != null && !parentTempIdObj.toString().isBlank()) {
							String parentTempId = parentTempIdObj.toString();
							ChatMessage parent = tempIdToMessageMap.get(parentTempId);
							if (parent != null) {
								reply.setParentMessage(parent);
								parentSet = true;
								log.info("답글의 부모 메시지 설정 성공 (tempId): {}", parentTempId);
							} else {
								log.warn("답글의 부모 메시지를 찾을 수 없음 (tempId): {}", parentTempId);
							}
						}

						if (!parentSet && parentMsgIdObj != null) {
							Long parentMsgId = ((Number) parentMsgIdObj).longValue();
							boolean found = messageRepository.findById(parentMsgId)
								.map(parent -> {
									reply.setParentMessage(parent);
									log.info("답글의 부모 메시지 설정 성공 (messageId): {}", parentMsgId);
									return true;
								})
								.orElse(false);

							if (!found) {
								log.warn("답글의 부모 메시지를 찾을 수 없음 (messageId): {}", parentMsgId);
							}
						}

						// 처리 중인 메시지 맵에 추가 (답글의 답글을 위해)
						tempIdToMessageMap.put(tempId, reply);
						replyMessages.add(reply);
					}
				} catch (Exception e) {
					log.error("답글 변환 중 오류: {}", e.getMessage(), e);
				}
			}

			log.info("저장할 답글 메시지 수: {}", replyMessages.size());

			if (!replyMessages.isEmpty()) {
				messageRepository.saveAll(replyMessages);
				log.info("채팅방 {} 답글 메시지 {} 개 저장 완료", chatRoomId, replyMessages.size());
			}

			// 성공적으로 처리됨, Redis에서 삭제
			chatRedisTemplate.delete(key);
			log.info("채팅방 {} Redis 키 삭제 완료", chatRoomId);

		} catch (Exception e) {
			log.error("채팅방 {} 메시지 저장 처리 중 오류 발생: {}", chatRoomId, e.getMessage(), e);
			throw e;
		}
	}

	private Long extractChatRoomId(String key) {
		// "chat:pending:123" -> 123 추출
		String[] parts = key.split(":");
		if (parts.length < 3) {
			log.error("잘못된 Redis 키 형식: " + key);
			return null;
		}

		try {
			return Long.parseLong(parts[2]);
		} catch (NumberFormatException e) {
			log.error("채팅방 ID 파싱 실패: " + parts[2], e);
			return null;
		}
	}

	private boolean isEmpty(String s) {
		return s == null || s.isBlank(); // null, "", "  " 모두 처리
	}
}