export interface SectionProps {
  sectionId: number;
  arenaId: number;
  sectionName: string;
  isScraped: boolean;
  onClick?: () => void;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  isScrapMode: boolean;
}
