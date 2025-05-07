// app/sight/[arenaId]/[sectionId]/page.tsx (새 파일)
import SectionPage from './SectionPage';

// 서버 컴포넌트 페이지
export default function Page({
  params,
}: {
  params: { arenaId: string; sectionId: string };
}) {
  return <SectionPage params={params} />;
}
