'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import { ArtistInfo } from '@/types/mypage';
import styles from './ArtistSection.module.scss';
import { deleteArtist, getMyArtists } from '@/api/mypage/mypage';

export default function ArtistSection() {
  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditArtist = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteArtist = async (artistId: number) => {
    try {
      await deleteArtist(artistId);
      setArtists(artists.filter((artist) => artist.artistId !== artistId));
    } catch (error) {
      console.error('아티스트 삭제 실패:', error);
    }
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await getMyArtists();
        setArtists(response?.artists || []);
      } catch (error) {
        console.error('아티스트 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <IconBox name='heart-filled' size={24} color='#4986e8' />
            <h2 className={styles.title}>관심 아티스트</h2>
          </div>
        </div>
        <div>로딩 중...</div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name='heart-filled' size={24} color='#4986e8' />
          <h2 className={styles.title}>관심 아티스트</h2>
        </div>
        <div className={styles.editButton} onClick={handleEditArtist}>
          {isEditing ? '완료' : '편집'}
        </div>
      </div>

      {artists.length > 0 ? (
        <div className={styles.scrollContainer}>
          <div className={styles.artistList}>
            {artists.map((artist) => (
              <div key={artist.artistId} className={styles.artistItem}>
                {isEditing && (
                  <div
                    className={styles.deleteButton}
                    onClick={() => handleDeleteArtist(artist.artistId)}
                  >
                    X
                  </div>
                )}
                <div className={styles.artistImageContainer}>
                  <Image
                    src={artist.photoUrl || '/images/dummyArtist.jpg'}
                    alt={`${artist.artistName} 이미지`}
                    className={styles.artistImage}
                    width={70}
                    height={70}
                  />
                </div>
                <p className={styles.artistName}>{artist.artistName}</p>
              </div>
            ))}
            <Link href='/artists/all' className={styles.addArtistItem}>
              <div className={styles.addArtistContainer}>
                <IconBox name='add' size={30} color='#666' />
              </div>
              <p className={styles.addText}></p>
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>관심 아티스트가 없습니다</p>
          <Link href='/artists/all' className={styles.addButton}>
            아티스트 찾아보기
          </Link>
        </div>
      )}
    </section>
  );
}
