'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import { UserArtist } from '@/api/auth/user';
import styles from './ArtistSection.module.scss';

interface ArtistSectionProps {
  artists: UserArtist[];
}

export default function ArtistSection({ artists }: ArtistSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name='heart-filled' size={24} color='#4986e8' />
          <h2 className={styles.title}>관심 아티스트</h2>
        </div>
        <Link href='/mypage/artists/edit' className={styles.editButton}>
          편집
        </Link>
      </div>

      {artists.length > 0 ? (
        <div className={styles.scrollContainer}>
          <div className={styles.artistList}>
            {artists.map((artist) => (
              <div key={artist.id} className={styles.artistItem}>
                <div className={styles.artistImageContainer}>
                  <Image
                    src={artist.imageUrl || '/images/dummyArtist.jpg'}
                    alt={`${artist.name} 이미지`}
                    className={styles.artistImage}
                    width={70}
                    height={70}
                  />
                </div>
                <p className={styles.artistName}>{artist.name}</p>
              </div>
            ))}
            <Link href='/mypage/artists/all' className={styles.addArtistItem}>
              <div className={styles.addArtistContainer}>
                <IconBox name='add' size={30} color='#666' />
              </div>
              <p className={styles.addText}>전체보기</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>관심 아티스트가 없습니다</p>
          <Link href='/artists' className={styles.addButton}>
            아티스트 찾아보기
          </Link>
        </div>
      )}
    </section>
  );
}
