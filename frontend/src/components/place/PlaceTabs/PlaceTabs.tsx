'use client';

import { useState } from 'react';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import PlaceMap from '../PlaceMap/PlaceMap';
import PlaceChat from '../PlaceChat/PlaceChat';
import styles from './PlaceTabs.module.scss';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const tabItems: TabMenuItem[] = [{ name: '지도 보기' }, { name: '채팅 보기' }];

export default function PlaceTabs({ arenaId }: { arenaId: string | number }) {
  const [activeTab, setActiveTab] = useState(0);

  // Redux에서 경기장 정보 가져오기
  const arenaInfo = useSelector((state: RootState) => state.arena.currentArena);
  const mapSettings = useSelector(
    (state: RootState) => state.arena.mapSettings
  );

  const arenaIdNum =
    typeof arenaId === 'string' ? parseInt(arenaId, 10) : arenaId;

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
            latitude={mapSettings?.latitude || arenaInfo.latitude}
            longitude={mapSettings?.longitude || arenaInfo.longitude}
            zoom={mapSettings?.zoom}
          />
        )}
        {activeTab === 1 && <PlaceChat arenaId={arenaIdNum} />}
      </div>
    </div>
  );
}
