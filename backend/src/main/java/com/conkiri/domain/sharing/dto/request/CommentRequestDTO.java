package com.conkiri.domain.sharing.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequestDTO {

	@NotBlank(message = "내용을 입력해주세요.")
	private String content;
	private Long sharingId;
	private Long userId;
}
