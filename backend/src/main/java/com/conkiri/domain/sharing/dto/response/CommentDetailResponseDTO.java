package com.conkiri.domain.sharing.dto.response;

import java.time.LocalDateTime;

import com.conkiri.domain.sharing.entity.Comment;

public record CommentDetailResponseDTO(
	Long commentId,
	String content,
	String writer,
	Long writerId,
	String writerLevel,
	LocalDateTime modifyTime
) {
	public static CommentDetailResponseDTO from(Comment comment) {
		return new CommentDetailResponseDTO(
			comment.getCommentId(),
			comment.getContent(),
			comment.getUser().getNickname(),
			comment.getUser().getUserId(),
			comment.getUser().getLevel(),
			comment.getModifyTime()
		);
	}
}
