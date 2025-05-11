// app/sight/_components/SelectorContainer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SmallDropdown from '@/components/common/Dropdown/SmallDropdown';
import styles from '../[arenaId]/layout.module.scss';
import { arenaApi } from '@/api/sight/arena';
import { ArenaSection } from '@/types/arena';

export default function SelectorContainer() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const arenaId = params.arenaId as string;

  const [allSections, setAllSections] = useState<ArenaSection[]>([]);
  const [floors, setFloors] = useState<{ label: string; value: string }[]>([]);
  const [sections, setSections] = useState<{ label: string; value: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const currentFloor = searchParams.get('floor') || '';
  const currentSection = searchParams.get('section') || '';

  // 모든 구역 데이터 가져오기
  useEffect(() => {
    async function loadSections() {
      if (!arenaId) return;

      try {
        setIsLoading(true);
        const response = await arenaApi.getArenaSections(arenaId);

        if (response.data.error) {
          console.error('API 오류:', response.data.error);
          return;
        }

        setAllSections(response.data.data);

        // 층 목록 추출
        const uniqueFloors = Array.from(
          new Set(response.data.data.map((item) => item.floor))
        ).sort((a, b) => a - b);

        const floorOptions = uniqueFloors.map((floor) => ({
          label: `${floor}층`,
          value: floor.toString(),
        }));

        setFloors(floorOptions);
      } catch (error) {
        console.error('구역 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSections();
  }, [arenaId]);

  // 현재 층에 맞는 구역 필터링
  useEffect(() => {
    if (!currentFloor) {
      setSections([]);
      return;
    }

    const floorSections = allSections.filter(
      (item) => item.floor.toString() === currentFloor
    );

    const sectionOptions = floorSections
      .map((item) => ({
        label: item.section,
        value: item.section,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true })
      );

    setSections(sectionOptions);
  }, [currentFloor, allSections]);

  // 층 변경 핸들러
  const handleFloorChange = (floor: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('floor', floor);
    current.delete('section');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/sight/${arenaId}${query}`);
  };

  
  // 구역 변경 핸들러
  const handleSectionChange = (section: string) => {
    router.push(`/sight/${arenaId}/section/${section}?floor=${currentFloor}`);
  };

  return (
    <div className={styles.selects}>
      {/* 층 선택기 */}
      {isLoading ? (
        <div>층 정보 로딩 중...</div>
      ) : (
        <SmallDropdown
          options={floors}
          placeholder='층'
          value={currentFloor}
          onChange={handleFloorChange}
        />
      )}

      {/* 구역 선택기 */}
      {!currentFloor ? (
        <SmallDropdown
          options={[]}
          placeholder='층을 먼저 선택하세요'
          disabled
        />
      ) : isLoading ? (
        <div>구역 정보 로딩 중...</div>
      ) : (
        <SmallDropdown
          options={sections}
          placeholder='구역'
          value={currentSection}
          onChange={handleSectionChange}
          disabled={sections.length === 0}
        />
      )}
    </div>
  );
}
