package com.conkiri.domain.view.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import com.conkiri.domain.base.entity.Section;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionResponseDTO {

	private List<SectionDetailResponseDTO> sections;

	public static SectionResponseDTO from(List<SectionDetailResponseDTO> sectionDetails) {
		return SectionResponseDTO.builder()
			.sections(sectionDetails)
			.build();
	}
}
