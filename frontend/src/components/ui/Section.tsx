'use client';

interface SectionProps {
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

export const Section = ({
  sectionId,
  arenaId,
  sectionName,
  isScraped,
  onClick,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  isScrapMode,
}: SectionProps) => {
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
    if (!isScrapMode) return '#4A90E2';
    return isScraped ? '#FF6B6B' : '#4A90E2';
  };

  return (
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-section-id={sectionId}
      data-arena-id={arenaId}
    >
      <path
        d={createArc()}
        fill={getFillColor()}
        stroke="#fff"
        strokeWidth="1"
      />

      <text
        x={labelPosition.x}
        y={labelPosition.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize="12"
      >
        {sectionName}
      </text>
    </g>
  );
};
