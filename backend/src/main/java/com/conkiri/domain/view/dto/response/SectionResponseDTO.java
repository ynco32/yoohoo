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

	public static SectionResponseDTO of(List<Section> sections, int stageType) {
		return SectionResponseDTO.builder()
			.sections(sections.stream()
				.map(section -> SectionDetailResponseDTO.of(section, stageType))
				.collect(Collectors.toList()))
			.build();
	}
}
