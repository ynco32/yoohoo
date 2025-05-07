'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/components/layout/Header/HeaderProvider';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import PlaceMap from '../PlaceMap/PlaceMap';
import PlaceChat from '../PlaceChat/PlaceChat';
import styles from './PlaceTabs.module.scss';

const tabItems: TabMenuItem[] = [{ name: '지도 보기' }, { name: '채팅 보기' }];

const dummyArenaInfo = {
  arenaId: 1,
  arenaName: '올림픽 체조 경기장',
  arenaEngName: 'Olympic Gymnastics Arena',
  address: '서울 송파구 올림픽로 424',
  latitude: 37.5194,
  longitude: 127.1261,
  photoUrl: '/images/dummyArena.jpg', // 실제 이미지 경로로 교체
};

export default function PlaceTabs({ arenaId }: { arenaId: string | number }) {
  const [activeTab, setActiveTab] = useState(0);
  const { setArenaInfo } = useHeader();
  const arenaIdNum =
    typeof arenaId === 'string' ? parseInt(arenaId, 10) : arenaId;

  useEffect(() => {
    // 실제로는 arenaId로 API 호출해서 정보 받아와야 함
    setArenaInfo(dummyArenaInfo);
    return () => setArenaInfo(null); // 언마운트 시 초기화
  }, [arenaId, setArenaInfo]);

  return (
    <div className={styles.placeTabsContainer}>
      <div className={styles.tabMenuWrapper}>
        <TabMenu
          menuItems={tabItems}
          activeIndex={activeTab}
          onMenuItemClick={(_, idx) => setActiveTab(idx)}
          fullWidth={true}
          size='md'
          className={styles.customTabMenu}
        />
      </div>
      <div className={styles.tabContent}>
        {activeTab === 0 && <PlaceMap arenaId={arenaIdNum} />}
        {activeTab === 1 && <PlaceChat arenaId={arenaIdNum} />}
      </div>
    </div>
  );
}
