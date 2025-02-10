import { useState, useEffect, useCallback } from 'react';

interface UseDraggableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: 'full' | 'half' | 'closed';
}

interface DragState {
  position: 'full' | 'half' | 'closed';
  currentTranslate: number;
  isDragging: boolean;
}

export const useDraggableSheet = ({
  isOpen,
  onClose,
  initialPosition = 'half',
}: UseDraggableSheetProps) => {
  const [dragState, setDragState] = useState<DragState>({
    position: initialPosition,
    currentTranslate:
      initialPosition === 'full' ? 0 : initialPosition === 'half' ? 50 : 90,
    isDragging: false,
  });
  const [dragStart, setDragStart] = useState<number | null>(null);

  const updatePosition = useCallback(
    (translate: number) => {
      if (translate < 25) {
        setDragState((prev) => ({
          ...prev,
          position: 'full',
          currentTranslate: 0,
        }));
      } else if (translate < 75) {
        setDragState((prev) => ({
          ...prev,
          position: 'half',
          currentTranslate: 50,
        }));
      } else {
        setDragState((prev) => ({
          ...prev,
          position: 'closed',
          currentTranslate: 90,
        }));
        onClose();
      }
    },
    [onClose]
  );

  const handleDragStart = useCallback((position: number) => {
    setDragStart(position);
    setDragState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragMove = useCallback(
    (currentPosition: number) => {
      if (dragStart === null) return;

      const diff = currentPosition - dragStart;
      const windowHeight = window.innerHeight;
      const percentage = (diff / windowHeight) * 100;

      const newTranslate = Math.max(
        0,
        Math.min(90, dragState.currentTranslate + percentage)
      );
      setDragState((prev) => ({ ...prev, currentTranslate: newTranslate }));
    },
    [dragStart, dragState.currentTranslate]
  );

  const handleDragEnd = useCallback(() => {
    setDragStart(null);
    setDragState((prev) => ({ ...prev, isDragging: false }));
    updatePosition(dragState.currentTranslate);
  }, [dragState.currentTranslate, updatePosition]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientY);
    },
    [handleDragMove]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientY);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;
      handleDragMove(e.clientY);
    },
    [dragState.isDragging, handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      handleDragEnd();
    }
  }, [dragState.isDragging, handleDragEnd]);

  // Mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Handle isOpen prop changes
  useEffect(() => {
    if (isOpen) {
      setDragState((prev) => ({
        ...prev,
        position: 'half',
        currentTranslate: 50,
      }));
    } else {
      setDragState((prev) => ({
        ...prev,
        position: 'closed',
        currentTranslate: 90,
      }));
    }
  }, [isOpen]);

  return {
    position: dragState.position,
    currentTranslate: dragState.currentTranslate,
    isDragging: dragState.isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleDragEnd,
      onMouseDown: handleMouseDown,
    },
    style: {
      transform: `translateY(${dragState.currentTranslate}%)`,
      touchAction: 'none',
      cursor: dragState.isDragging ? 'grabbing' : 'grab',
    },
  };
};
