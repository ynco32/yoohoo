package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Section;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapSectionDetailResponseDTO {

	private Long sectionNumber;

	public static ScrapSectionDetailResponseDTO from(Section section) {
		return ScrapSectionDetailResponseDTO.builder()
			.sectionNumber(section.getSectionNumber())
			.build();
	}
}
