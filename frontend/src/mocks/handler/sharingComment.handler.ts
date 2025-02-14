import { rest } from 'msw';
import {
  getSharingById,
  //  getCommentsByPage
} from '../data/sharing.data';
import { Comment } from '@/types/sharing';
import { mockComments } from '../data/sharing.data';

// 메모리에 댓글을 저장할 배열 (mockComments로 초기화)
let comments: Comment[] = [...mockComments];

type PathParams = {
  concertId: string;
  sharingId: string;
};

export const sharingCommentHandlers = [
  // 댓글 목록 조회
  rest.get('/api/v1/sharing/:sharingId/comment', (req, res, ctx) => {
    const params = req.params as PathParams;
    const sharingIdNum = Number(params.sharingId);
    const lastParam = req.url.searchParams.get('last');
    const lastCommentId = lastParam !== null ? Number(lastParam) : undefined;

    console.log('[MSW] 댓글 목록 조회 요청', {
      sharingId: sharingIdNum,
      lastCommentId,
      currentComments: comments,
    });

    // 게시글이 존재하는지 먼저 확인
    const sharing = getSharingById(sharingIdNum);
    if (!sharing) {
      console.log('[MSW] 게시글을 찾을 수 없음');
      return res(
        ctx.status(400),
        ctx.json({ message: '게시글을 찾을 수 없습니다.' })
      );
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        comments,
        lastPage: true,
      })
    );
  }),

  // 댓글 등록
  rest.post('/api/v1/sharing/comment', async (req, res, ctx) => {
    const { content, sharingId } = await req.json();
    console.log('[MSW] 댓글 등록 요청', { content, sharingId });

    // 요청 검증
    if (!content || !content.trim() || !sharingId) {
      console.log('[MSW] 댓글 등록 실패: 필수 입력값 누락');
      return res(
        ctx.status(400),
        ctx.json({ message: '필수 입력값이 누락되었습니다.' })
      );
    }

    // 새 댓글 생성
    const newComment: Comment = {
      commentId: Date.now(),
      writer: '테스트 유저',
      writerId: 123,
      content,
      modifyTime: new Date().toISOString(),
    };

    // 메모리에 댓글 추가
    comments = [newComment, ...comments];

    console.log('[MSW] 댓글 등록 성공', {
      newComment,
      totalComments: comments.length,
    });

    return res(ctx.status(201), ctx.json(newComment));
  }),

  // 댓글 수정
  rest.put('/api/v1/sharing/comment/:commentId', async (req, res, ctx) => {
    const { commentId } = req.params;
    const { content } = await req.json();

    console.log('[MSW] 댓글 수정 요청', { commentId, content });

    if (!content || !content.trim()) {
      console.log('[MSW] 댓글 수정 실패: 내용 누락');
      return res(
        ctx.status(400),
        ctx.json({ message: '댓글 내용을 입력해주세요.' })
      );
    }

    // 댓글 찾기 & 수정
    const commentIndex = comments.findIndex(
      (c) => c.commentId === Number(commentId)
    );
    if (commentIndex === -1) {
      console.log('[MSW] 댓글 수정 실패: 댓글을 찾을 수 없음');
      return res(
        ctx.status(404),
        ctx.json({ message: '댓글을 찾을 수 없습니다.' })
      );
    }

    const updatedComment: Comment = {
      ...comments[commentIndex],
      content,
      modifyTime: new Date().toISOString(),
    };

    // 메모리에 있는 댓글 업데이트
    comments[commentIndex] = updatedComment;

    console.log('[MSW] 댓글 수정 성공', {
      updatedComment,
      totalComments: comments.length,
    });

    return res(ctx.status(200), ctx.json(updatedComment));
  }),

  // 댓글 삭제
  rest.delete('/api/v1/sharing/comment/:commentId', async (req, res, ctx) => {
    const { commentId } = req.params;
    console.log('[MSW] 댓글 삭제 요청', { commentId });

    // commentId가 유효한지 검사
    const commentIndex = comments.findIndex(
      (c) => c.commentId === Number(commentId)
    );
    if (commentIndex === -1) {
      console.log('[MSW] 댓글 삭제 실패: 댓글을 찾을 수 없음');
      return res(
        ctx.status(404),
        ctx.json({ message: '댓글을 찾을 수 없습니다.' })
      );
    }

    // 메모리에서 댓글 삭제
    comments = comments.filter((c) => c.commentId !== Number(commentId));

    console.log('[MSW] 댓글 삭제 성공', {
      deletedCommentId: commentId,
      totalComments: comments.length,
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({ message: '댓글이 삭제되었습니다.' })
    );
  }),
];
