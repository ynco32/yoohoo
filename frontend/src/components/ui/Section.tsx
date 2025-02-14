'use client';

import { SectionComponentProps } from '@/types/sections';

export const Section = ({
  sectionId,
  sectionNumber,
  available,
  scrapped,
  arenaId,
  onClick,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  isScrapMode,
}: SectionComponentProps) => {
  const createArc = () => {
    const startRadians = ((startAngle - 90) * Math.PI) / 180;
    const endRadians = ((endAngle - 90) * Math.PI) / 180;

    const startX = 400 + outerRadius * Math.cos(startRadians);
    const startY = 250 + outerRadius * Math.sin(startRadians);
    const endX = 400 + outerRadius * Math.cos(endRadians);
    const endY = 250 + outerRadius * Math.sin(endRadians);

    const innerStartX = 400 + innerRadius * Math.cos(startRadians);
    const innerStartY = 250 + innerRadius * Math.sin(startRadians);
    const innerEndX = 400 + innerRadius * Math.cos(endRadians);
    const innerEndY = 250 + innerRadius * Math.sin(endRadians);

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${startX} ${startY} 
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endX} ${endY}
            L ${innerEndX} ${innerEndY} 
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY} Z`;
  };

  const labelPosition = {
    x:
      400 +
      ((innerRadius + outerRadius) / 2) *
        Math.cos((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180),
    y:
      250 +
      ((innerRadius + outerRadius) / 2) *
        Math.sin((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180),
  };

  const getFillColor = () => {
    if (!available) return '#CCCCCC'; // 이용 불가능한 섹션
    if (!isScrapMode) return '#4A90E2';
    return scrapped ? '#FF6B6B' : '#4A90E2';
  };

  return (
    <g
      onClick={available ? onClick : undefined}
      style={{ cursor: available && onClick ? 'pointer' : 'default' }}
      data-section-id={sectionId}
      data-arena-id={arenaId}
    >
      <path
        d={createArc()}
        fill={getFillColor()}
        stroke="#fff"
        strokeWidth="1"
        opacity={available ? 1 : 0.5}
      />

      <text
        x={labelPosition.x}
        y={labelPosition.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize="12"
      >
        {sectionNumber}
      </text>
    </g>
  );
};

export default Section;
