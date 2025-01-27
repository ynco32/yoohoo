'use client';

import React from 'react';
import Image from 'next/image';
import { ContentCard } from '@/components/ui/ContentCard';
import { SharingPost, STATUS_INFO } from '@/types/sharing';

/**
 * 나눔 게시글 카드 컴포넌트
 * @description 나눔 게시글의 기본 정보를 카드 형태로 표시하는 컴포넌트
 */
export const SharingCard = ({
  title,
  nickname,
  status,
  start_time,
  image,
}: SharingPost) => {
  const { color, text } = STATUS_INFO[status] || STATUS_INFO.CLOSED;

  return (
    <ContentCard className="border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs text-white ${color}`}
          >
            {text}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-600">{nickname}</div>
        <div className="mt-1 text-sm text-gray-500">{start_time}</div>
      </div>

      <div className="relative h-20 w-20">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-md object-cover"
        />
      </div>
    </ContentCard>
  );
};
