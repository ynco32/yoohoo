/**
 * @file sections.ts
 * @description 구역(section) 데이터를 가져오기 위한 API 유틸리티
 */

export interface Section {
  sectionId: number;
  sectionNumber: number;
  available: boolean;
  scrapped: boolean;
  arenaId?: string;
}

export interface SectionsResponse {
  sections: Section[];
}

/**
 * 특정 공연장과 무대 유형에 대한 구역 데이터를 가져옵니다
 * @param arenaId - 공연장 ID
 * @param stageType - 무대 유형
 * @returns 구역 데이터를 포함한 Promise
 */
export async function fetchSections(
  arenaId: number,
  stageType: number
): Promise<Section[]> {
  try {
    const response = await fetch(
      `/api/v1/view/arenas/${arenaId}/sections?stageType=${stageType}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SectionsResponse = await response.json();
    return data.sections;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
}
