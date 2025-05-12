import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div
        className={`${styles.modalContent} ${styles.confirmModalContent}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.confirmMessage}>
          선택하신 날짜가 해제됩니다.
          <br />
          선택 해제하시겠습니까?
        </p>
        <div className={styles.confirmButtons}>
          <button
            className={`${styles.confirmButton} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className={`${styles.confirmButton} ${styles.submitButton}`}
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
