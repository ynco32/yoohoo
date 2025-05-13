export const mockConcerts = {
  concerts: [
    {
      concertId: 3,
      concertName: 'BTS 팬미팅 2025',
      photoUrl: 'https://example.com/bts-fanmeeting.jpg',
      arenaName: '잠실실내체육관',
      ticketingNotificationEnabled: true,
      artists: [
        {
          artistId: 1,
          artistName: '방탄소년단',
        },
      ],
      sessions: [
        {
          concertDetailId: 5,
          startTime: '2025-09-10T17:00:00',
          entranceNotificationEnabled: true,
          isEnded: false,
          attended: false,
        },
        {
          concertDetailId: 6,
          startTime: '2025-09-11T17:00:00',
          entranceNotificationEnabled: false,
          isEnded: false,
          attended: false,
        },
      ],
    },
    {
      concertId: 2,
      concertName: '블랙핑크 월드투어 2025',
      photoUrl: 'https://example.com/blackpink-tour.jpg',
      arenaName: '고척스카이돔',
      ticketingNotificationEnabled: true,
      artists: [
        {
          artistId: 2,
          artistName: '블랙핑크',
        },
      ],
      sessions: [
        {
          concertDetailId: 3,
          startTime: '2025-08-20T19:00:00',
          entranceNotificationEnabled: false,
          isEnded: false,
          attended: false,
        },
        {
          concertDetailId: 4,
          startTime: '2025-08-21T19:00:00',
          entranceNotificationEnabled: false,
          isEnded: false,
          attended: false,
        },
      ],
    },
    {
      concertId: 1,
      concertName: '아이유 콘서트 2025',
      photoUrl: 'https://example.com/iu-concert.jpg',
      arenaName: '올림픽홀',
      ticketingNotificationEnabled: true,
      artists: [
        {
          artistId: 3,
          artistName: '아이유',
        },
      ],
      sessions: [
        {
          concertDetailId: 1,
          startTime: '2025-07-15T18:00:00',
          entranceNotificationEnabled: true,
          isEnded: false,
          attended: false,
        },
        {
          concertDetailId: 2,
          startTime: '2025-07-16T18:00:00',
          entranceNotificationEnabled: true,
          isEnded: false,
          attended: false,
        },
      ],
    },
  ],
  isLastPage: true,
};
