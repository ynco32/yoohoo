package com.conkiri.domain.place.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.place.dto.request.ChatMessageRequestDTO;
import com.conkiri.domain.place.dto.response.ChatMessageDTO;
import com.conkiri.domain.place.dto.response.ChatMessageDetailDTO;
import com.conkiri.domain.place.dto.response.ChatWebSocketMessageDTO;
import com.conkiri.domain.place.entity.ChatMessage;
import com.conkiri.domain.place.entity.ChatRoom;
import com.conkiri.domain.place.repository.ChatMessageRepository;
import com.conkiri.domain.place.repository.ChatRoomRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.domain.user.service.UserReadService;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

	private final ChatMessageRepository messageRepository;
	private final ChatRoomRepository chatRoomRepository;
	private final RedisTemplate<String, Object> chatRedisTemplate;
	private final UserRepository userRepository;
	private final UserReadService userReadService;

	// 채팅방 조회
	public ChatRoom getChatRoom(Long chatRoomId) {

		return findChatRoom(chatRoomId);
	}

	// 최신 메시지 조회
	public ChatMessageDTO getLatestMessages(Long chatRoomId) {

		List<ChatMessageDetailDTO> dbMessages = getRecentMessagesFromDB(chatRoomId);
		List<ChatMessageDetailDTO> redisMessages = getPendingMessagesFromRedis(chatRoomId);

		List<ChatMessageDetailDTO> allMessages = new ArrayList<>();
		allMessages.addAll(dbMessages);
		allMessages.addAll(redisMessages);

		allMessages.sort(Comparator.comparing(ChatMessageDetailDTO::createdAt));
		return new ChatMessageDTO(allMessages);
	}

	private List<ChatMessageDetailDTO> getRecentMessagesFromDB(Long chatRoomId) {

		PageRequest pageable = PageRequest.of(0, 50);
		Slice<ChatMessage> dbMessages = messageRepository.findByChatRoomIdWithUserAndParent(chatRoomId, pageable);

		return dbMessages.getContent().stream()
			.map(ChatMessageDetailDTO::from)
			.toList();
	}

	private List<ChatMessageDetailDTO> getPendingMessagesFromRedis(Long chatRoomId) {

		String listKey = "chat:pending:" + chatRoomId;
		List<Object> rawMessages = chatRedisTemplate.opsForList().range(listKey, 0, -1);

		if (rawMessages == null) return List.of();

		return rawMessages.stream()
			.filter(ChatWebSocketMessageDTO.class::isInstance)
			.map(obj -> (ChatWebSocketMessageDTO) obj)
			.map(this::convertWebSocketDTOToDetailDTO)
			.toList();
	}

	private ChatMessageDetailDTO convertWebSocketDTOToDetailDTO(ChatWebSocketMessageDTO wsMsg) {

		return new ChatMessageDetailDTO(
			null,
			wsMsg.tempId(),
			wsMsg.senderId(),
			wsMsg.senderNickname(),
			wsMsg.content(),
			wsMsg.parentMessageId(),
			wsMsg.parentTempId(),
			wsMsg.parentContent(),
			wsMsg.parentSenderNickname(),
			wsMsg.createdAt()
		);
	}

	// 이전 메시지 조회 (무한 스크롤)
	public ChatMessageDTO getMessagesBeforeTime(Long chatRoomId, LocalDateTime beforeTime, int size) {

		List<ChatMessageDetailDTO> messages = getOldMessagesFromDB(chatRoomId, beforeTime, size);
		messages.sort(Comparator.comparing(ChatMessageDetailDTO::createdAt));

		return new ChatMessageDTO(messages);
	}

	private List<ChatMessageDetailDTO> getOldMessagesFromDB(Long chatRoomId, LocalDateTime beforeTime, int size) {

		PageRequest pageable = PageRequest.of(0, size);
		Slice<ChatMessage> messages = messageRepository.findByChatRoomIdBeforeTimeWithUserAndParent(chatRoomId, beforeTime, pageable);

		return messages.getContent().stream()
			.map(ChatMessageDetailDTO::from)
			.toList();
	}

	// 메시지 생성 및 Redis 저장
	public ChatWebSocketMessageDTO processAndSaveMessage(Long chatRoomId, ChatMessageRequestDTO request, Long userId) {

		User user = userReadService.findUserByIdOrElseThrow(userId);
		String tempId = UUID.randomUUID().toString();

		ChatWebSocketMessageDTO message = createWebSocketMessage(request, user, tempId);
		saveToRedis(chatRoomId, message);

		return message;
	}

	private ChatWebSocketMessageDTO createWebSocketMessage(ChatMessageRequestDTO request, User user, String tempId) {

		if (request.parentTempId() == null && request.parentMessageId() == null) {
			return ChatWebSocketMessageDTO.createMessage(
				tempId,
				user.getUserId(),
				user.getNickname(),
				request.content()
			);
		} else {
			return ChatWebSocketMessageDTO.createReply(
				tempId,
				user.getUserId(),
				user.getNickname(),
				request.content(),
				request.parentTempId(),
				request.parentMessageId(),
				null,
				null
			);
		}
	}

	private void saveToRedis(Long chatRoomId, ChatWebSocketMessageDTO message) {

		String listKey = "chat:pending:" + chatRoomId;
		chatRedisTemplate.opsForList().rightPush(listKey, message);
		log.info("✅ Redis 저장 완료: {}", listKey);
	}

	// ========== 이하 공통 메서드 ==========

	private ChatRoom findChatRoom(Long chatRoomId) {
		return chatRoomRepository.findById(chatRoomId)
			.orElseThrow(() -> new BaseException(ErrorCode.CHAT_ROOM_NOT_FOUND));
	}
}