// API 응답 타입
export interface Section {
  sectionId: number;
  sectionNumber: number;
  available: boolean;
  scrapped: boolean;
  arenaId: number;
}

// store에서 사용하는 타입
export interface SectionProps {
  sectionId: number;
  arenaId: number;
  sectionName: string;
  isScraped: boolean;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  isScrapMode: boolean;
}

// UI 컴포넌트에서 사용하는 타입
export interface SectionComponentProps {
  sectionId: number;
  sectionNumber: number;
  available: boolean;
  scrapped: boolean;
  arenaId: number;
  onClick?: () => void;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  isScrapMode: boolean;
}
