/**
 * @file sections.ts
 * @description API utilities for fetching section data
 */

export interface Section {
  sectionId: number;
  sectionNumber: number;
  available: boolean;
  scrapped: boolean;
  arenaId?: string; // Added for compatibility with existing code
}

export interface SectionsResponse {
  sections: Section[];
}

/**
 * Fetches sections data for a specific arena and stage type
 * @param arenaId - The ID of the arena
 * @param stageType - The type of stage
 * @returns Promise containing the sections data
 */
export async function fetchSections(
  arenaId: string | string[] | number,
  stageType: string | string[] | number
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

    // Add arenaId to each section for compatibility with existing code
    return data.sections.map((section) => ({
      ...section,
      arenaId: arenaId.toString(),
    }));
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
}
