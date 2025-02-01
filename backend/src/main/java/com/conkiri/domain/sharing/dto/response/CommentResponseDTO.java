package com.conkiri.domain.sharing.dto.response;

import java.util.List;
import java.util.stream.Collectors;

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

	private List<CommentDetailResponseDTO> comments;
	private boolean isLastPage;

	public static CommentResponseDTO from(List<Comment> comments, boolean hasNext) {
        return CommentResponseDTO.builder()
			.comments(comments.stream()
				.map(CommentDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.isLastPage(!hasNext)
			.build();
	}
}
