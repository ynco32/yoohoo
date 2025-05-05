// app/sight/components/SearchSection.tsx

// 클라이언트 컴포넌트로 선언 - 사용자 인터랙션과 브라우저 API 사용
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import styles from './page.module.scss';

interface SearchSectionProps {
  defaultQuery?: string; // URL 파라미터로 전달된 초기 검색어
}

export default function SearchSection({
  defaultQuery = '',
}: SearchSectionProps) {
  const router = useRouter(); // 프로그래밍적 라우팅을 위한 훅
  const searchParams = useSearchParams(); // URL 검색 파라미터 접근

  const handleSearch = (query: string) => {
    // URLSearchParams를 사용해 기존 URL 파라미터 유지하면서 검색어만 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('searchWord', query);
    } else {
      params.delete('searchWord'); // 빈 검색어는 URL에서 제거
    }
    router.push(`/sight?${params.toString()}`); // URL 업데이트로 페이지 리렌더링
  };

  return (
    <div className={styles.search}>
      <SearchBar
        placeholder='공연장명 검색'
        fullWidth
        initialValue={defaultQuery} // URL에서 받은 검색어를 기본값으로
        onSearch={handleSearch}
      />
    </div>
  );
}
