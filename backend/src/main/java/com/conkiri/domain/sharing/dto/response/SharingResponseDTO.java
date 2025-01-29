package com.conkiri.domain.sharing.dto.response;

import java.util.stream.Collectors;

import org.springframework.data.domain.Slice;

import com.conkiri.domain.sharing.entity.Sharing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharingResponseDTO {

	private Slice<SharingDetailResponseDTO> sharings;
	private boolean hasNext;

	public static SharingResponseDTO from(Slice<Sharing> sharings) {
		return SharingResponseDTO.builder()
			.sharings(sharings
				.map(SharingDetailResponseDTO::from))
			.hasNext(sharings.hasNext())
			.build();
	}
}
