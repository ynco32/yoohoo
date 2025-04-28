package com.conkiri.domain.view.dto.response;

import java.util.List;

public record SectionResponseDTO(
	List<SectionDetailResponseDTO> sections
) {
	public static SectionResponseDTO from(List<SectionDetailResponseDTO> sectionDetails) {
		return new SectionResponseDTO(sectionDetails);
	}
}
