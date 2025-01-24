package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SharingUpdateRequestDTO {

	@NotBlank(message = "공백인 제목은 허용되지 않습니다")
	private String title;
	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
