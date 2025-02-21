/*
 * 재사용 가능한 카드 컴포넌트
 * @description 공연 및 나눔 목록에서 아이템을 표시하는데 사용되는 기본 카드 레이아웃
 * @param children - 카드 내부에 렌더링될 컨텐츠
 * @param className - 추가 스타일링을 위한 클래스
 */
interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentCard = ({ children, className = '' }: ContentCardProps) => {
  return (
    <div
      className={`flex items-center justify-between border border-gray-200 py-4 ${className}`}
    >
      {children}
    </div>
  );
};
