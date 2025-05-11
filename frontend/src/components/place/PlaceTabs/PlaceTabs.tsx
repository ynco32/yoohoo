'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/components/layout/Header/HeaderProvider';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import PlaceMap from '../PlaceMap/PlaceMap';
import PlaceChat from '../PlaceChat/PlaceChat';
import styles from './PlaceTabs.module.scss';

const tabItems: TabMenuItem[] = [{ name: '지도 보기' }, { name: '채팅 보기' }];

export default function PlaceTabs({ arenaId }: { arenaId: string | number }) {
  const [activeTab, setActiveTab] = useState(0);
  const { arenaInfo } = useHeader();
  const arenaIdNum =
    typeof arenaId === 'string' ? parseInt(arenaId, 10) : arenaId;

  // 경기장 정보가 없는 경우 (직접 URL로 접근한 경우)
  if (!arenaInfo) {
    return <div>잘못된 접근입니다.</div>;
  }

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
      <div
        className={`${styles.tabContent} ${
          activeTab === 1 ? styles.scrollable : styles.nonScrollable
        }`}
      >
        {activeTab === 0 && (
          <PlaceMap
            latitude={arenaInfo.latitude}
            longitude={arenaInfo.longitude}
          />
        )}
        {activeTab === 1 && <PlaceChat arenaId={arenaIdNum} />}
      </div>
    </div>
  );
}
