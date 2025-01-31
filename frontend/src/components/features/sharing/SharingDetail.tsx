'use client';

interface SharingDetailProps {
  id: number;
}

export const SharingDetail = ({ id }: SharingDetailProps) => {
  // 더미 데이터
  const detailData = {
    title: "포카 나눔합니다~~~",
    nickname: "닉네임",
    status: "ONGOING" as const,
    start_time: "15:00",
    images: ['/images/card.png'],
    content: "편의점 앞에서 포카 나눔합니다\n1인당 한 장씩 드려요 선착순",
    latitude: 37.5204,
    longitude: 127.1243,
  };

  return (
    <div className="flex flex-col">
      {/* 1. 헤더 정보 (제목, 닉네임, 상태, 시작시간) */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">{detailData.title}</h1>
          {/* 북마크 버튼 추가 예정 */}
        </div>
        {/* SharingCard의 나머지 헤더 정보와 동일한 스타일 */}
      </div>

      {/* 2. 이미지 그리드 */}
      <div className="grid grid-cols-2 gap-1 p-4">
        {/* 이미지 컴포넌트들 */}
      </div>

      {/* 3. 상세 정보 */}
      <div className="bg-gray-100 p-4">
        {/* 날짜, 수량 등 정보 */}
      </div>

      {/* 4. 지도 */}
      <div className="h-[200px] p-4">
        {/* 카카오맵 컴포넌트 */}
      </div>

      {/* 5. 댓글 섹션 */}
      <div className="mt-4 p-4">
        {/* 댓글 컴포넌트 */}
      </div>
    </div>
  );
};