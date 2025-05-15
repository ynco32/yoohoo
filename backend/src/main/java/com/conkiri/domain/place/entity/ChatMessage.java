package com.conkiri.domain.place.entity;

import com.conkiri.domain.user.entity.User;
import com.conkiri.global.common.BaseTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage extends BaseTime {

	@Id
	@Column(name = "message_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long messageId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chat_room_id", nullable = false)
	private ChatRoom chatRoom;

	@Column(name = "content", length = 200, nullable = false)
	private String content;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_message_id")
	private ChatMessage parentMessage;

	@Column(name = "temp_id", unique = true)
	private String tempId;

	// 기존 5개 파라미터를 받는 of 메서드
	public static ChatMessage of(User user, ChatRoom chatRoom, String content, ChatMessage parentMessage, String tempId) {
		return new ChatMessage(user, chatRoom, content, parentMessage, tempId);
	}

	// 새로 추가한 4개 파라미터를 받는 of 메서드 (부모 메시지가 없는 경우)
	public static ChatMessage of(User user, ChatRoom chatRoom, String content, String tempId) {
		return new ChatMessage(user, chatRoom, content, null, tempId);
	}

	private ChatMessage(User user, ChatRoom chatRoom, String content, ChatMessage parentMessage, String tempId) {
		this.user = user;
		this.chatRoom = chatRoom;
		this.content = content;
		this.parentMessage = parentMessage;
		this.tempId = tempId;
	}

	// 부모 메시지를 설정하기 위한 메서드 추가
	public void setParentMessage(ChatMessage parentMessage) {
		this.parentMessage = parentMessage;
	}
}