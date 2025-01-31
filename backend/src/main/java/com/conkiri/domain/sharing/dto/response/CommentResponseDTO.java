package com.conkiri.domain.sharing.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Slice;

import com.conkiri.domain.sharing.entity.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {

	private Slice<CommentDetailResponseDTO> comments;
	private boolean hasNext;

	public static CommentResponseDTO from(Slice<Comment> comments) {
        return CommentResponseDTO.builder()
			.comments(comments
				.map(CommentDetailResponseDTO::from))
			.hasNext(comments.hasNext())
			.build();
	}
}
