// handlers/seatScrap.handler.ts
import { rest } from 'msw';

interface SeatScrapState {
  scrappedSeats: Set<string>;
}

// 스크랩 상태를 메모리에 저장
const state: SeatScrapState = {
  scrappedSeats: new Set(),
};

export const seatScrapHandlers = [
  // POST: 스크랩 추가
  rest.post(
    'http://localhost:3000/api/v1/view/scraps/:seatId',
    (req, res, ctx) => {
      console.log('[MSW] Intercepting POST seat scrap request:', req.url.href);

      const { seatId } = req.params;
      const stageType = req.url.searchParams.get('stageType');

      if (!stageType) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'stageType is required' })
        );
      }

      const key = `${seatId}-${stageType}`;
      state.scrappedSeats.add(key);

      return res(
        ctx.delay(500), // 실제 API 지연 시뮬레이션
        ctx.status(201),
        ctx.json({
          message: 'Scrap added successfully',
          seatId,
          stageType,
          isScraped: true,
        })
      );
    }
  ),

  // DELETE: 스크랩 제거
  rest.delete(
    'http://localhost:3000/api/v1/view/scraps/:seatId',
    (req, res, ctx) => {
      console.log(
        '[MSW] Intercepting DELETE seat scrap request:',
        req.url.href
      );

      const { seatId } = req.params;
      const stageType = req.url.searchParams.get('stageType');

      if (!stageType) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'stageType is required' })
        );
      }

      const key = `${seatId}-${stageType}`;
      state.scrappedSeats.delete(key);

      return res(
        ctx.delay(500),
        ctx.status(200),
        ctx.json({
          message: 'Scrap removed successfully',
          seatId,
          stageType,
          isScraped: false,
        })
      );
    }
  ),

  // GET: 스크랩 상태 확인 (필요한 경우)
  rest.get(
    'http://localhost:3000/api/v1/view/scraps/:seatId',
    (req, res, ctx) => {
      console.log(
        '[MSW] Intercepting GET seat scrap status request:',
        req.url.href
      );

      const { seatId } = req.params;
      const stageType = req.url.searchParams.get('stageType');

      if (!stageType) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'stageType is required' })
        );
      }

      const key = `${seatId}-${stageType}`;
      const isScraped = state.scrappedSeats.has(key);

      return res(
        ctx.status(200),
        ctx.json({
          seatId,
          stageType,
          isScraped,
        })
      );
    }
  ),
];
