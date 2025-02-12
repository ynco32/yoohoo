export const locationInfo = [
  {
    arenaId: 1, // 올림픽 체조
    position: {
      latitude: 37.515661,
      longitude: 127.127241,
    },
    locations: [
      {
        locationNumber: 1,
        locationName: '올림픽공원역',
        latitude: 37.515802,
        longitude: 127.130069,
      },
      {
        locationNumber: 2,
        locationName: '몽촌토성역',
        latitude: 37.516501,
        longitude: 127.116496,
      },
      {
        locationNumber: 3,
        locationName: '한성백제역',
        latitude: 37.51773,
        longitude: 127.112878,
      },
      {
        locationNumber: 4,
        locationName: 'JYP엔터테인먼트 주변',
        latitude: 37.523986,
        longitude: 127.127956,
      },
      {
        locationNumber: 5,
        locationName: '강동구청역 사거리',
        latitude: 37.527815,
        longitude: 127.119229,
      },
    ],
  },
  {
    arenaId: 2,
    locations: [
      {
        locationNumber: 1,
        latitude: 123,
        longitude: 123,
      },
    ],
  },
];

export const congestionMessage = [
  {
    status: '여유',
    message: '전방시야가 막힘이 없고 도보이동이 자유로워요',
  },
  {
    status: '보통',
    message: '전방시야가 다소 막힐 수 있지만 도보 이동에 큰 제약이 없어요',
  },
  {
    status: '혼잡',
    message: '전방시야가 막히고 도보 이동에 제약이 있을 수 있어요',
  },
  {
    status: '매우혼잡',
    message: '전방시야가 혼잡하고 도보 이동에 제약이 많을 수 있어요',
  },
];
