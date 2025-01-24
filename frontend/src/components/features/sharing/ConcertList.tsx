/**
 * 공연 목록을 표시하는 컴포넌트
 * @description 더미 데이터로 공연 정보를 표시하며, 추후 API 연동 예정
 */
import { ConcertItem } from './ConcertItem';

interface Concert {
  id: string;
  title: string;
  venue: string;
  date: string;
  image: string;
}

export const ConcertList = () => {
  // DUMMY_DATA: Concert information - TO BE REMOVED
  const concerts: Concert[] = [
    {
      id: '1',
      title: '2025 TREASURE FAN CONCERT',
      venue: 'Grand Peace Palace, Kyung Hee Univ.',
      date: '2025.01.25',
      image: '/images/poster.png',
    },
    {
      id: '2',
      title: 'BLACKPINK WORLD TOUR [BORN PINK]',
      venue: 'Olympic Gymnastics Arena',
      date: '2025.02.15',
      image: '/images/poster.png',
    },
    {
      id: '3',
      title: 'BTS PERMISSION TO DANCE',
      venue: 'Seoul Olympic Stadium',
      date: '2025.03.10',
      image: '/images/poster.png',
    },
    {
      id: '4',
      title: 'IU CONCERT: The Golden Hour',
      venue: 'KSPO DOME',
      date: '2025.04.01',
      image: '/images/poster.png',
    },
    {
      id: '5',
      title: 'SEVENTEEN WORLD TOUR',
      venue: 'Gocheok Sky Dome',
      date: '2025.05.20',
      image: '/images/poster.png',
    },
  ];
  // DUMMY_DATA END

  return (
    <div className="space-y-4">
      {concerts.map((concert) => (
        <ConcertItem key={concert.id} {...concert} />
      ))}
    </div>
  );
};
