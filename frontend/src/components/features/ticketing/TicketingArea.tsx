'use client';
import React, { useState } from 'react';
import Popup from '@/components/ui/Popup';
import PopupButton from '@/components/ui/PopupButton';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  color: string;
  isSelected: boolean;
}

interface VenueSectionProps {
  sections?: string[];
}

const TicketingArea: React.FC<VenueSectionProps> = ({
  sections = ['A', 'B', 'C'],
}) => {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const sectionData: Section[] = sections.map((id) => ({
    id,
    color: '#E2E8F0',
    isSelected: id === selectedSection,
  }));

  // [React] SVG 패스 생성 함수 수정
  const generateSectionPath = (index: number, total: number) => {
    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    // 시계 방향으로 회전하도록 수정 (시작점: 하단 중앙)
    const sectionAngle = 360 / total;
    const startAngle = (90 + index * sectionAngle) * (Math.PI / 180);
    const endAngle = (90 + (index + 1) * sectionAngle) * (Math.PI / 180);

    const start = {
      x: centerX + radius * Math.cos(startAngle),
      y: centerY + radius * Math.sin(startAngle),
    };

    const end = {
      x: centerX + radius * Math.cos(endAngle),
      y: centerY + radius * Math.sin(endAngle),
    };

    const largeArcFlag = sectionAngle <= 180 ? '0' : '1';

    return `M ${centerX} ${centerY}
            L ${start.x} ${start.y}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
            Z`;
  };

  // [React] 텍스트 위치 계산 함수 추가
  const calculateTextPosition = (index: number, total: number) => {
    const centerX = 200;
    const centerY = 200;
    const radius = 100; // 텍스트는 약간 안쪽에 배치
    const sectionAngle = 360 / total;
    const angle = (90 + (index + 0.5) * sectionAngle) * (Math.PI / 180);

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setSelectedSection(null);
  };

  const handleMove = () => {
    if (selectedSection) {
      router.push(`${selectedSection}`);
    }
    setIsPopupOpen(false);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center p-4">
      <div className="relative w-full">
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="sectionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient
              id="selectedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        <svg viewBox="0 0 400 400" className="w-full drop-shadow-lg">
          {/* 스테이지 */}
          <g className="stage-area">
            <rect
              x="150"
              y="30"
              width="100"
              height="40"
              rx="4"
              fill="#1F2937"
              className="drop-shadow-md"
            />
            <text
              x="200"
              y="55"
              textAnchor="middle"
              fill="white"
              className="text-sm font-semibold"
            >
              STAGE
            </text>
          </g>

          {/* 구역 그리기 */}
          <g transform="translate(0, 50)">
            {sectionData.map((section, index) => {
              const textPos = calculateTextPosition(index, sections.length);
              return (
                <g key={section.id} className="section-group">
                  <path
                    d={generateSectionPath(index, sections.length)}
                    fill={
                      section.isSelected
                        ? 'url(#selectedGradient)'
                        : 'url(#sectionGradient)'
                    }
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                    onClick={() => handleSectionClick(section.id)}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1F2937"
                    className="pointer-events-none text-lg font-bold"
                  >
                    {section.id}구역
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 구역 선택 팝업 */}
      <Popup className="text-center" isOpen={isPopupOpen}>
        <div className="text-center text-xl font-bold">선택 구역</div>
        <div className="m-1 bg-gray-50 p-3">
          {selectedSection ? `${selectedSection}구역` : ''}
        </div>
        <div className="text-caption1 text-gray-500">
          상세 구역 잔여좌석 현황이 <br /> 제공되지 않는 상품입니다.
        </div>
        <div className="mt-3 flex justify-between justify-evenly gap-3 border-t pt-3">
          <PopupButton onClick={handleClose}>닫기</PopupButton>
          <PopupButton onClick={handleMove}>이동</PopupButton>
        </div>
      </Popup>
    </div>
  );
};

export default TicketingArea;
