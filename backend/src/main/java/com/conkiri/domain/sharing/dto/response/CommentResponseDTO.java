package com.conkiri.domain.sharing.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.sharing.entity.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {

	private List<CommentDetailResponseDTO> comments;

	public static CommentResponseDTO from(List<Comment> comments) {
		return CommentResponseDTO.builder()
			.comments(comments.stream()
				.map(CommentDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
