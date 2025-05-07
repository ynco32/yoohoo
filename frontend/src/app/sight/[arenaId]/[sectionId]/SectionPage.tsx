// app/sight/[arenaId]/[sectionId]/page.tsx
// 'use client' 지시문 제거 - 이것은 서버 컴포넌트입니다
import SectionPageClient from './SectionPageClient';

export default function SectionPage({
  params,
}: {
  params: { arenaId: string; sectionId: string };
}) {
  // 서버 컴포넌트에서는 직접 props를 클라이언트 컴포넌트로 전달합니다
  return (
    <SectionPageClient arenaId={params.arenaId} sectionId={params.sectionId} />
  );
}
