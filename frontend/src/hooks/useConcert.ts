import { useState, useRef, useCallback, useEffect } from 'react';
import { ConcertInfo } from '@/types/mypage';
import { editConcert, getConcerts } from '@/api/mypage/mypage';
import { useRouter } from 'next/navigation';
import { ExceptionResponse } from '@/types/api';

export const useConcert = () => {
  const router = useRouter();

  const [concerts, setConcerts] = useState<ConcertInfo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDatesMap, setSelectedDatesMap] = useState<
    Record<number, { date: string; concertDetailId: number }[]>
  >({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // UI 상태값 추가
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedConcertForDate, setSelectedConcertForDate] =
    useState<ConcertInfo | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [concertToDeselect, setConcertToDeselect] = useState<number | null>(
    null
  );

  const fetchConcerts = async (query: string = '', lastId?: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const concertResponse = await getConcerts(query || undefined, lastId);
      if (lastId) {
        setConcerts((prev) => [...prev, ...(concertResponse?.concerts ?? [])]);
      } else {
        setConcerts(concertResponse?.concerts ?? []);
      }
      setIsLastPage(concertResponse?.isLastPage ?? true);
    } catch (error) {
      const apiError = error as ExceptionResponse;
      if (apiError.statusCode === 401) {
        alert('로그인이 필요합니다.');
        router.replace('/onboarding');
        return;
      }
      console.error('Failed to fetch concerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Array 메서드를 활용하여 더 간결하게 작성
    const validEntries = Object.entries(selectedDatesMap).filter(
      ([_, dates]) => dates.length > 0
    );

    const concertIds = validEntries.map(([concertId]) => Number(concertId));
    const concertDetailIds = validEntries.flatMap(([_, dates]) =>
      dates.map((date) => date.concertDetailId)
    );

    try {
      await editConcert(concertIds, concertDetailIds);
      router.push('/main');
    } catch (error) {
      const apiError = error as ExceptionResponse;
      if (apiError.statusCode === 401) {
        alert('로그인이 필요합니다.');
        router.replace('/onboarding');
        return;
      }

      if (apiError.statusCode === 400) {
        alert('잘못된 요청입니다.');
        return;
      }
      console.error('Failed to edit concert:', error);
    }
  };

  const handleSearch = useCallback((query: string) => {
    fetchConcerts(query);
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isLastPage && !isLoading) {
        const lastId = concerts[concerts.length - 1]?.concertId;
        if (lastId) {
          fetchConcerts(search, lastId);
        }
      }
    },
    [concerts, isLastPage, isLoading, search]
  );

  useEffect(() => {
    fetchConcerts();
  }, []);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // 콘서트 선택 기본 핸들러
  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 날짜 선택용 핸들러
  const updateSelectedDates = (
    concertId: number,
    dates: { date: string; concertDetailId: number }[]
  ) => {
    setSelectedDatesMap((prev) => ({
      ...prev,
      [concertId]: dates,
    }));

    // 날짜가 선택된 경우 자동으로 콘서트도 선택
    if (dates.length > 0 && !selected.includes(concertId)) {
      setSelected((prev) => [...prev, concertId]);
    }
    // 날짜가 모두 해제된 경우 콘서트도 해제
    else if (dates.length === 0 && selected.includes(concertId)) {
      setSelected((prev) => prev.filter((id) => id !== concertId));
    }
  };

  // 검색어 입력 핸들러 - 디바운스 적용
  const handleSearchChange = (value: string) => {
    setSearch(value);

    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 1초 후에 검색 실행
    searchTimeoutRef.current = setTimeout(() => {
      fetchConcerts(value);
    }, 1000);
  };

  const handleConcertSelect = (id: number) => {
    if (selected.includes(id) && selectedDatesMap[id]?.length > 0) {
      setConcertToDeselect(id);
      setIsConfirmModalOpen(true);
      return;
    }

    handleSelect(id);
  };

  const handleSeatInfoClick = (id: number) => {
    const concert = concerts.find((c) => c.concertId === id);
    if (concert) {
      setSelectedConcertForDate(concert);
      setIsDateModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDateModalOpen(false);
      setIsClosing(false);
      setSelectedConcertForDate(null);
    }, 300);
  };

  const handleDateConfirm = (
    selectedDates: { date: string; concertDetailId: number }[]
  ) => {
    if (selectedConcertForDate) {
      updateSelectedDates(selectedConcertForDate.concertId, selectedDates);
    }
    handleCloseModal();
  };

  const handleReselect = (id: number) => {
    const concert = concerts.find((c) => c.concertId === id);
    if (concert) {
      setSelectedConcertForDate(concert);
      setIsDateModalOpen(true);
    }
  };

  const handleConfirmDeselect = () => {
    if (concertToDeselect !== null) {
      updateSelectedDates(concertToDeselect, []);
      setConcertToDeselect(null);
    }
    setIsConfirmModalOpen(false);
  };

  const handleCancelDeselect = () => {
    setConcertToDeselect(null);
    setIsConfirmModalOpen(false);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    concerts,
    selected,
    isLastPage,
    isLoading,
    search,
    loadMoreRef,
    selectedDatesMap,
    // UI 상태 추가
    isDateModalOpen,
    selectedConcertForDate,
    isClosing,
    isConfirmModalOpen,
    // 기존 핸들러
    handleSearch,
    handleSelect,
    handleSubmit,
    updateSelectedDates,
    fetchConcerts,
    // UI 핸들러 추가
    handleSearchChange,
    handleConcertSelect,
    handleSeatInfoClick,
    handleCloseModal,
    handleDateConfirm,
    handleReselect,
    handleConfirmDeselect,
    handleCancelDeselect,
  };
};
