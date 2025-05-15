package com.conkiri.domain.place.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.place.entity.ChatMessage;

public record ChatMessageDetailDTO(
	Long messageId,
	String tempId,
	Long senderId,
	String senderNickname,
	String content,
	Long parentMessageId,
	String parentTempId,
	String parentContent,
	String parentSenderNickname,
	LocalDateTime createdAt
) {
	public static ChatMessageDetailDTO from(ChatMessage message) {

		ChatMessage parent = message.getParentMessage();

		return new ChatMessageDetailDTO(
			message.getMessageId(),
			message.getTempId(),
			message.getUser().getUserId(),
			message.getUser().getNickname(),
			message.getContent(),
			parent != null ? parent.getMessageId() : null,
			parent != null ? parent.getTempId() : null,
			parent != null ? parent.getContent() : null,
			parent != null ? parent.getUser().getNickname() : null,
			message.getCreatedAt()
		);
	}
}