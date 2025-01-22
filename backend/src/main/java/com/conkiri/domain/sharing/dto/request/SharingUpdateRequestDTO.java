package com.conkiri.domain.sharing.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SharingUpdateRequestDTO {

	@NotBlank
	private String title;
	private String content;
	private Double latitude;
	private Double longitude;
	private LocalDateTime startTime;
}
