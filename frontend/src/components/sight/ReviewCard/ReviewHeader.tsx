'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // 라우터 import 주석 처리
import styles from './ReviewHeader.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';
// import { Modal } from '@/components/common/Modal';
import Dot from '@/assets/icons/dots.svg';
import { ReviewHeaderProps } from '@/types/review';

export const ReviewHeader = ({ review, onEdit }: ReviewHeaderProps) => {
  const user = useAppSelector((state) => state.user.data);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 현재 로그인한 사용자가 작성자인지 확인
  const isAuthor = user?.userId === review.userId;
  // const router = useRouter(); // 라우터 사용 주석 처리

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    try {
      console.log('삭제 버튼 클릭!!');
      // 삭제 API 호출 로직
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    // 실제 환경에서는 아래 코드 사용
    // router.push(`/sight/reviews/${review.reviewId}/edit`);

    // 스토리북 테스트 환경용 코드
    console.log(`Edit review ${review.reviewId}`);
    if (onEdit) {
      onEdit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        !(event.target as Element).closest(`.${styles.menuContainer}`)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // 좌석 정보 문자열 생성 (실제로는 ReviewData 인터페이스의 getSeatInfoString 메서드 사용 가능)
  const seatInfo = `${review.section} ${review.rowLine}열`;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.profileWrapper}>
          <Image
            src={review.profilePicture}
            alt={`${review.nickName}의 프로필 사진`}
            width={0}
            height={0}
            sizes='100vw'
            className={styles.profileImage}
          />
          <div className={styles.infoContainer}>
            <div className={styles.topRow}>
              <h2 className={styles.nickName}>{review.nickName}</h2>
              <span className={styles.seatBadge}>{seatInfo}</span>
            </div>
            <div className={styles.bottomRow}>
              <span className={styles.concertTitle}>{review.concertTitle}</span>
              {isAuthor && (
                <div className={styles.menuContainer}>
                  <button
                    onClick={handleMenuClick}
                    className={styles.menuButton}
                  >
                    <Dot className={styles.dotIcon} />
                  </button>
                  {showMenu && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={handleEdit} className={styles.menuItem}>
                        수정
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title='리뷰를 삭제하시겠습니까?'
          confirmText='삭제'
          cancelText='취소'
          onConfirm={handleDelete}
          type='confirm'
          variant='danger'
        />
      )} */}
    </>
  );
};
