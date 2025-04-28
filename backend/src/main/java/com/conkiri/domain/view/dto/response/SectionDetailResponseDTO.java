package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.Section;

public record SectionDetailResponseDTO(
	Long sectionId,
	Long sectionNumber,
	boolean available,
	boolean isScrapped
) {
	public static SectionDetailResponseDTO of(Section section, int stageType, Boolean isScrapped) {
		return new SectionDetailResponseDTO(
			section.getSectionId(),
			section.getSectionNumber(),
			checkAvailability(section.getSectionNumber(), stageType),
			isScrapped
		);
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
