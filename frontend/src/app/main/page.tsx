import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

export default function MainMenu() {
  return (
    <div className={styles.container}>
      <div className={styles.mainMenu}>
        {/* 시야보기 메뉴 - 세로로 두 칸 차지 */}
        <div
          className={`${styles.menuItem} ${styles.tall} ${styles.menuItemSight}`}
        >
          <Link href='/sight' className={styles.link}>
            <div className={styles.menuContent}>
              <div className={styles.textContainer}>
                <span className={styles.label}>시야보기</span>
                <span className={styles.description}>공연장 별 시야 후기</span>
              </div>
              <div className={styles.iconContainer}>
                <Image
                  src='/images/menuSight.png'
                  alt='시야보기'
                  width={120}
                  height={120}
                  className={styles.icon}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* 현장 정보 메뉴 */}
        <div className={`${styles.menuItem} ${styles.menuItemPresent}`}>
          <Link href='/place' className={styles.link}>
            <div className={styles.menuContent}>
              <div className={styles.textContainer}>
                <span className={styles.label}>현장 정보</span>
                <span className={styles.description}>
                  공연장 인근 현장 정보 모음
                </span>
              </div>
              <div className={styles.iconContainer}>
                <Image
                  src='/images/menuPlace.png'
                  alt='현장 정보'
                  width={80}
                  height={80}
                  className={styles.icon}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* 티켓팅 미니게임 메뉴 */}
        <div className={`${styles.menuItem} ${styles.menuItemTicket}`}>
          <Link href='/minigame' className={styles.link}>
            <div className={styles.menuContent}>
              <div className={styles.textContainer}>
                <span className={styles.label}>티켓팅 미니게임</span>
                <span className={styles.description}>
                  단계별로 연습하는 티켓팅
                </span>
              </div>
              <div className={styles.iconContainer}>
                <Image
                  src='/images/menuTicket.png'
                  alt='티켓팅 미니게임'
                  width={80}
                  height={80}
                  className={styles.icon}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* 실전 티켓팅 연습 메뉴 - 와이드 카드 */}
        <div
          className={`${styles.menuItem} ${styles.wide} ${styles.menuItemPractice}`}
        >
          <Link href='/ticketing' className={styles.link}>
            <div className={styles.menuContent}>
              <div className={styles.textContainer}>
                <span className={styles.label}>실전 티켓팅 연습</span>
                <span className={styles.description}>
                  전 과정을 한 번에 연습!
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
