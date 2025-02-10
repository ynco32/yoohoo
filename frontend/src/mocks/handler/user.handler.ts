// src/mocks/handlers/user.handlers.ts
import { rest } from 'msw';

// 기본 mock 유저 데이터
export const mockUserData = {
  nickname: '장욱',
  email: 'janguk95@naver.com',
  userName: '장욱',
  level: 5,
  tier: 'Gold',
  profileUrl: null,
};

export const userHandlers = [
  // GET 사용자 정보 - 기본 응답
  rest.get('/api/v1/main/user-info', (req, res, ctx) => {
    console.log('[MSW] User Info 요청 intercepted');
    console.log('응답 데이터:', mockUserData);

    return res(ctx.delay(300), ctx.status(200), ctx.json(mockUserData));
  }),

  // 테스트를 위한 다른 케이스들 (필요할 때 주석 해제하여 사용)
  /*
  // 신규 유저 케이스 (level과 tier가 null)
  rest.get('/api/v1/main/user-info', (req, res, ctx) => {
    const newUserData = {
      nickname: "신규유저",
      email: "new@example.com",
      userName: "신규",
      level: null,
      tier: null,
      profileUrl: null
    };

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(newUserData)
    );
  }),

  // 401 Unauthorized 에러
  rest.get('/api/v1/main/user-info', (req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.status(401),
      ctx.json({
        message: '인증되지 않은 사용자입니다.'
      })
    );
  }),

    */
  // 500 Server 에러
  rest.get('/api/v1/main/user-info', (req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.status(500),
      ctx.json({
        message: '서버 에러가 발생했습니다.',
      })
    );
  }),
];
