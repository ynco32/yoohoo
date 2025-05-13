'use client';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import Button from '@/components/common/Button/Button';
import styles from './ArtistContainer.module.scss';
import { useArtist } from '@/hooks/useArtist';

export default function ArtistContainer() {
  const {
    artists,
    selected,
    loadMoreRef,
    handleSearch,
    handleSelect,
    handleSubmit,
  } = useArtist();

  return (
    <>
      <div className={styles.form}>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className={styles.artistContainer}>
        {artists.map((artist) => (
          <div
            key={artist.artistId}
            className={`${styles.artistItem} ${selected.includes(artist.artistId) ? styles.selected : ''}`}
            onClick={() => handleSelect(artist.artistId)}
          >
            <div className={styles.artistImage}>
              <img
                src={artist.photoUrl}
                alt={artist.artistName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            {selected.includes(artist.artistId) && (
              <span className={styles.checkmark}>✔</span>
            )}
            <div className={styles.artistName}>{artist.artistName}</div>
          </div>
        ))}
        <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
      </div>
      <div
        className={`${styles.buttonContainer} ${selected.length > 0 ? styles.visible : ''}`}
      >
        <Button
          children={'선택완료'}
          className={styles.submitBtn}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
}
