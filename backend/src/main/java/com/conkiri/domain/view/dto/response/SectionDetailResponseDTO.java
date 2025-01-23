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
public class SectionDetailResponseDTO {

	private Long sectionId;
	private Long sectionNumber;
	private boolean isAvailable;

	public static SectionDetailResponseDTO of(Section section, int stageType) {
		return SectionDetailResponseDTO.builder()
			.sectionId(section.getSectionId())
			.sectionNumber(section.getSectionNumber())
			.isAvailable(checkAvailability(section.getSectionNumber(), stageType))
			.build();
	}

	private static boolean checkAvailability(Long sectionNumber, int stageType) {
		switch (stageType) {
			case 0: // 전체
				return true;
			case 1: // 기본형
			case 2: // 돌출형
				return !(sectionNumber >= 16 && sectionNumber <= 22) &&
						!(sectionNumber >= 45 && sectionNumber <= 52);
			case 3: // 360도형
				return true;
			default:
				return false;
		}
	}
}
