package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SharingRequestDTO {

	@NotNull(message = "concertId는 필수값입니다")
	private Long concertId;

	@NotNull(message = "userId는 필수값입니다")
	private Long userId;

	@NotBlank(message = "공백인 제목은 허용되지 않습니다")
	private String title;

	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
