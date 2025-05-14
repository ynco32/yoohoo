import { useState, useRef, useCallback, useEffect } from 'react';
import { ArtistInfo } from '@/types/mypage';
import { editArtist, getArtists } from '@/api/mypage/mypage';
import { useRouter } from 'next/navigation';
import { ExceptionResponse } from '@/types/api';

export const useArtist = () => {
  const router = useRouter();

  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchArtists = async (query: string = '', lastId?: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const artistResponse = await getArtists(query || undefined, lastId);
      if (lastId) {
        setArtists((prev) => [...prev, ...(artistResponse?.artists ?? [])]);
      } else {
        setArtists(artistResponse?.artists ?? []);
      }
      setIsLastPage(artistResponse?.isLastPage ?? true);
    } catch (error) {
      const apiError = error as ExceptionResponse;
      if (apiError.statusCode === 401) {
        alert('로그인이 필요합니다.');
        router.replace('/onboarding');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await editArtist(selected);
      router.push('/login/concert');
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
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // 기존 타이머가 있다면 제거
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // 1초 후에 검색 실행하는 타이머 설정
    searchTimerRef.current = setTimeout(() => {
      fetchArtists(query);
    }, 1000);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isLastPage && !isLoading) {
        const lastId = artists[artists.length - 1]?.artistId;
        if (lastId) {
          fetchArtists(searchQuery, lastId);
        }
      }
    },
    [artists, isLastPage, isLoading, searchQuery]
  );

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

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    artists,
    selected,
    searchQuery,
    isLastPage,
    isLoading,
    loadMoreRef,
    handleSearch,
    handleSelect,
    handleSubmit,
  };
};
