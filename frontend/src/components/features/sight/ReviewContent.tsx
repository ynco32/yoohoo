import { useState } from 'react';

interface ReviewContentProps {
  content: string;
}

export const ReviewContent = ({ content }: ReviewContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 컨텐츠 길이에 따른 말줄임표 처리
  const maxContentLength = 100;
  const shouldTruncate = content.length > maxContentLength;
  const truncatedContent = shouldTruncate
    ? `${content.slice(0, maxContentLength - 3)}...`
    : content;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed text-gray-700">
        {isExpanded ? content : truncatedContent}
      </p>
      {shouldTruncate && (
        <button
          onClick={handleToggle}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
};
