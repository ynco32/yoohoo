import { rest } from 'msw';
import { mockSightReviews } from '../data/sightReview.data';
import type { SightReviewFormData } from '@/types/sightReviews';

export const sightReviewHandlers = [
  rest.post('/api/v1/view/reviews', async (req, res, ctx) => {
    console.log('[MSW] Sight Review 제출 요청 intercepted');

    try {
      const data = (await req.json()) as SightReviewFormData;
      console.log('요청 데이터:', data);

      // 필수 필드 검증
      if (
        !data.content ||
        !data.viewScore ||
        !data.concertId ||
        data.images.length === 0
      ) {
        console.log('유효성 검증 실패');
        return res(
          ctx.delay(300),
          ctx.status(400),
          ctx.json({
            message: '필수 필드가 누락되었습니다.',
          })
        );
      }

      // 새 리뷰 생성
      const newReview = {
        id: (mockSightReviews.length + 1).toString(),
        arenaId: 1, // 임시 값
        sectionId: data.section,
        seatId: data.columnLine,
        concertTitle: `Concert #${data.concertId}`, // 실제로는 콘서트 정보를 가져와야 함
        nickName: 'Anonymous', // 실제로는 유저 정보를 가져와야 함
        profilePicture: '/images/profile.png',
        seatInfo: `${data.section}구역 ${data.rowLine}열 ${data.columnLine}번`,
        images: data.images.map((_) => '/images/sight.png'), // 실제로는 이미지 업로드 처리 필요
        content: data.content,
        viewQuality: data.viewScore,
        soundQuality: data.sound,
        seatQuality: data.seatDistance,
        createdAt: new Date().toISOString(),
      };

      console.log('생성된 리뷰:', newReview);

      return res(ctx.delay(300), ctx.status(201), ctx.json(newReview));
    } catch (error) {
      console.error('MSW 처리 중 에러:', error);
      return res(
        ctx.delay(300),
        ctx.status(500),
        ctx.json({
          message: '서버 에러가 발생했습니다.',
        })
      );
    }
  }),
];
