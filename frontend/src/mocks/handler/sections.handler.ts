import { rest } from 'msw';
import { mockSections } from '../data/sections.data';

export const sectionHandlers = [
  rest.get('/api/v1/view/arenas/:arenaId/sections', (req, res, ctx) => {
    const stageType = req.url.searchParams.get('stageType');
    const arenaId = parseInt(req.params.arenaId as string, 10);

    console.log('[MSW] Sections 요청 intercepted:', {
      arenaId,
      stageType,
      fullUrl: req.url.toString(),
    });

    if (!stageType) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'stageType is required' })
      );
    }

    const sections = mockSections[arenaId] || [];

    console.log('응답 데이터:', { sections });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        sections,
      })
    );
  }),
];

export default sectionHandlers;
