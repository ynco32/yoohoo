// app/sight/components/ArenaLoadingFallback.tsx
import styles from '../page.module.scss';

export default function ArenaLoadingFallback() {
  return (
    <div className={styles.arenaList}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className={styles.arenaCardSkeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonTextShort} />
        </div>
      ))}
    </div>
  );
}
