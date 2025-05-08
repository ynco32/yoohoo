'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // 라우터 import 주석 처리
import styles from './ReviewHeader.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';
// import { Modal } from '@/components/common/Modal';
import Dot from '@/assets/icons/dots.svg';

interface ReviewHeaderProps {
  concertTitle: string;
  nickName: string;
  writerId: number;
  reviewId: number;
  profilePicture: string;
  seatInfo: string;
  // 스토리북 테스트를 위한 추가 props
  onEdit?: () => void;
}

export const ReviewHeader = ({
  concertTitle,
  nickName,
  reviewId,
  writerId,
  profilePicture,
  seatInfo,
  onEdit, // 테스트용 props 추가
}: ReviewHeaderProps) => {
  // UserInfo 타입이 적용된 상태 가져오기
  const user = useAppSelector((state) => state.user.data);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 현재 로그인한 사용자가 작성자인지 확인
  const isAuthor = user?.userId === writerId;
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
    // router.push(`/sight/reviews/${reviewId}/edit`);

    // 스토리북 테스트 환경용 코드
    console.log(`Edit review ${reviewId}`);
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

  return (
    <>
      <div className={styles.header}>
        <div className={styles.profileWrapper}>
          <Image
            src={profilePicture}
            alt={`${nickName}의 프로필 사진`}
            width={0}
            height={0}
            sizes='100vw'
            className={styles.profileImage}
          />
          <div className={styles.infoContainer}>
            <div className={styles.topRow}>
              <h2 className={styles.nickName}>{nickName}</h2>
              <span className={styles.seatBadge}>{seatInfo}</span>
            </div>
            <div className={styles.bottomRow}>
              <span className={styles.concertTitle}>{concertTitle}</span>
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
