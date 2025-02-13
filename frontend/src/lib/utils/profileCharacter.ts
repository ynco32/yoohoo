export const getUserProfileImage = (userLevel: string): string => {
  const idx = Number(userLevel);
  const profileImages: Record<1 | 2 | 3 | 4, string> = {
    1: 'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level1.PNG',
    2: 'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level2.PNG',
    3: 'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level3.PNG',
    4: 'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level4.PNG',
  };

  if (idx in profileImages) {
    return profileImages[idx as 1 | 2 | 3 | 4];
  }

  return 'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level2.PNG';
};
