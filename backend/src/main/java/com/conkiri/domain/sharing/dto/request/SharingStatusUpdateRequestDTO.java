package com.conkiri.domain.sharing.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SharingStatusUpdateRequestDTO {
	private String status;
}
