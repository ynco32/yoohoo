import styles from './DateSelectionModal.module.scss';
import ConcertSelectForm from '@/components/auth/ConcertSelectForm/ConcertSelectForm';

interface DateSelectionModalProps {
  isClosing: boolean;
  selectedConcert: {
    id: number;
    name: string;
  } | null;
  initialSelectedDates: string[];
  onClose: () => void;
  onConfirm: (selectedDates: string[]) => void;
}

export const DateSelectionModal = ({
  isClosing,
  selectedConcert,
  initialSelectedDates,
  onClose,
  onConfirm,
}: DateSelectionModalProps) => {
  if (!selectedConcert) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ConcertSelectForm
          onConfirm={onConfirm}
          initialSelectedDates={initialSelectedDates}
        />
      </div>
    </div>
  );
};
