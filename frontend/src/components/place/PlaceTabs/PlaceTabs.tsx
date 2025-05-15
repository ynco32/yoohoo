'use client';

import { useState, useEffect, useRef } from 'react';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import PlaceMap from '../PlaceMap/PlaceMap';
import PlaceChat from '../PlaceChat/PlaceChat';
import styles from './PlaceTabs.module.scss';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const tabItems: TabMenuItem[] = [{ name: '지도 보기' }, { name: '채팅 보기' }];

export default function PlaceTabs({ arenaId }: { arenaId: string | number }) {
  const [activeTab, setActiveTab] = useState(0);

  // 채팅 탭 상태
  const [chatShown, setChatShown] = useState(false);

  // Redux에서 경기장 정보 가져오기
  const arenaInfo = useSelector((state: RootState) => state.arena.currentArena);
  const mapSettings = useSelector(
    (state: RootState) => state.arena.mapSettings
  );

  const arenaIdNum =
    typeof arenaId === 'string' ? parseInt(arenaId, 10) : arenaId;

  // 로컬 스토리지에서 마지막 활성 탭 가져오기
  useEffect(() => {
    const savedTab = localStorage.getItem(`place-active-tab-${arenaIdNum}`);
    if (savedTab !== null) {
      const tabIndex = parseInt(savedTab, 10);
      setActiveTab(tabIndex);

      // 저장된 탭이 채팅 탭이면 채팅 표시 상태 설정
      if (tabIndex === 1) {
        setChatShown(true);
      }
    }
  }, [arenaIdNum]);

  // 탭 변경 처리
  const handleTabChange = (idx: number) => {
    // 탭 상태 저장
    localStorage.setItem(`place-active-tab-${arenaIdNum}`, idx.toString());
    setActiveTab(idx);

    // 채팅 탭으로 변경 시
    if (idx === 1) {
      setChatShown(true);
    }
  };

  // 경기장 정보가 없을 때
  if (!arenaInfo) {
    return <div>경기장 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.placeTabsContainer}>
      <div className={styles.tabMenuWrapper}>
        <TabMenu
          menuItems={tabItems}
          activeIndex={activeTab}
          onMenuItemClick={(_, idx) => handleTabChange(idx)}
          fullWidth={true}
          size='md'
          className={styles.customTabMenu}
        />
      </div>
      <div
        className={`${styles.tabContent} ${
          activeTab === 1 ? styles.scrollable : styles.nonScrollable
        }`}
      >
        {activeTab === 0 && (
          <PlaceMap
            latitude={mapSettings?.latitude || arenaInfo.latitude}
            longitude={mapSettings?.longitude || arenaInfo.longitude}
            zoom={mapSettings?.zoom}
            arenaId={arenaIdNum}
          />
        )}

        {/* 
          채팅 컴포넌트를 항상 렌더링하되 display 속성으로 표시/숨김 처리
          이렇게 하면 탭 전환 시에도 웹소켓 연결 유지 가능
        */}
        <div
          style={{
            display: activeTab === 1 ? 'block' : 'none',
            height: '100%',
          }}
        >
          {chatShown && <PlaceChat arenaId={arenaIdNum} />}
        </div>
      </div>
    </div>
  );
}
