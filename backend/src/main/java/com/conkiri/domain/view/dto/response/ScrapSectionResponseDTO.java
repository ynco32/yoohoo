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
public class ScrapSectionResponseDTO {

	private List<ScrapSectionDetailResponseDTO> sections;

	public static ScrapSectionResponseDTO from(List<Section> sections) {
		return ScrapSectionResponseDTO.builder()
			.sections(sections.stream()
				.map(ScrapSectionDetailResponseDTO::from)
				.collect(Collectors.toList()))
			.build();
	}
}
