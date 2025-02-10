'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const ReviewSuccessnPage = ({ reviewId }: { reviewId: string }) => {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/main`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [reviewId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-md">
      <div className="flex flex-col items-center space-y-md text-center">
        <CheckCircleIcon className="h-16 w-16 animate-bounce text-status-success" />
        <h1 className="text-head-bold text-gray-800">
          리뷰가 성공적으로 등록되었습니다!
        </h1>
        <p className="text-body text-gray-600">
          잠시 후 리뷰 페이지로 이동합니다...
        </p>
      </div>
    </div>
  );
};

export default ReviewSuccessnPage;
