// sections.data.ts
interface Section {
  sectionId: number;
  sectionNumber: number;
  available: boolean;
  scrapped: boolean;
}

interface SectionsByArenaId {
  [key: number]: Section[];
}

export const mockSections: SectionsByArenaId = {
  1: [
    {
      sectionId: 1,
      sectionNumber: 1,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 2,
      sectionNumber: 2,
      available: true,
      scrapped: true,
    },
    {
      sectionId: 3,
      sectionNumber: 3,
      available: false,
      scrapped: false,
    },
    {
      sectionId: 4,
      sectionNumber: 4,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 5,
      sectionNumber: 5,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 6,
      sectionNumber: 6,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 7,
      sectionNumber: 7,
      available: false,
      scrapped: false,
    },
    {
      sectionId: 8,
      sectionNumber: 8,
      available: true,
      scrapped: true,
    },
    {
      sectionId: 9,
      sectionNumber: 9,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 10,
      sectionNumber: 10,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 11,
      sectionNumber: 11,
      available: true,
      scrapped: false,
    },
    {
      sectionId: 12,
      sectionNumber: 12,
      available: false,
      scrapped: false,
    },
  ],
  2: [], // 다른 arena의 sections 데이터
};
