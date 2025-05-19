import styles from './page.module.scss';
import MenuSection from './_components/MenuSection';
import ProfileSection from './_components/ProfileSection';
import { Suspense } from 'react';

export default function MyPageSetting() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileSection />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuSection />
      </Suspense>
    </div>
  );
}
