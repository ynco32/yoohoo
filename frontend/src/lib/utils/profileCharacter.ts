export const getUserProfileImage = (userLevel: string): string => {
  const idx = Number(userLevel);
  const profileImages: Record<1 | 2 | 3 | 4, string> = {
    1: '/images/profile/level1.png',
    2: '/images/profile/level2.png',
    3: '/images/profile/level3.png',
    4: '/images/profile/level4.png',
  };

  if (idx in profileImages) {
    return profileImages[idx as 1 | 2 | 3 | 4];
  }

  return '/images/cat.png'; // 잘못된 레벨일 경우 에러 이미지 반환
};
