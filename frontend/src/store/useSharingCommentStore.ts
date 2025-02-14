import { create } from 'zustand';
import { Comment } from '@/types/sharing';
import { sharingCommentAPI } from '@/lib/api/sharingComment';

interface CommentStore {
  comments: Comment[];
  hasMore: boolean;
  lastCommentId?: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchComments: (sharingId: number, lastCommentId?: number) => Promise<void>;
  fetchMoreComments: (sharingId: number) => Promise<void>;
  addComment: (sharingId: number, content: string) => Promise<Comment>;
  updateComment: (commentId: number, content: string) => Promise<Comment>;
  deleteComment: (commentId: number) => Promise<void>;
  reset: () => void;
}

export const useSharingCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  hasMore: true,
  lastCommentId: undefined,
  isLoading: false,
  error: null,

  fetchComments: async (sharingId: number, lastCommentId?: number) => {
    try {
      set({ isLoading: true });
      const response = await sharingCommentAPI.getComments(
        sharingId,
        lastCommentId
      );

      set((state) => ({
        comments: lastCommentId
          ? [...state.comments, ...response.comments]
          : response.comments,
        hasMore: !response.lastPage,
        lastCommentId:
          response.comments.length > 0
            ? response.comments[response.comments.length - 1].commentId
            : state.lastCommentId,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : '댓글을 불러오는데 실패했습니다.',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoreComments: async (sharingId: number) => {
    const { lastCommentId, isLoading, hasMore } = get();
    if (!hasMore || isLoading) return;

    try {
      set({ isLoading: true });
      const response = await sharingCommentAPI.getComments(
        sharingId,
        lastCommentId
      );

      set((state) => ({
        comments: [...state.comments, ...response.comments],
        hasMore: !response.lastPage,
        lastCommentId:
          response.comments.length > 0
            ? response.comments[response.comments.length - 1].commentId
            : state.lastCommentId,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : '댓글을 불러오는데 실패했습니다.',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addComment: async (sharingId: number, content: string) => {
    try {
      const newComment = await sharingCommentAPI.createComment(
        sharingId,
        content
      );
      // 새로운 참조 생성을 명시적으로 보장
      set((state) => ({
        comments: [
          { ...newComment }, // 스프레드로 새 참조 생성
          ...state.comments,
        ],
      }));
      return newComment;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '댓글 작성에 실패했습니다.',
      });
      throw err;
    }
  },

  updateComment: async (commentId: number, content: string) => {
    try {
      const updatedComment = await sharingCommentAPI.updateComment(
        commentId,
        content
      );
      // 새로운 참조 생성을 명시적으로 보장
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, ...updatedComment } // 스프레드로 새 참조 생성
            : comment
        ),
      }));
      return updatedComment;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '댓글 수정에 실패했습니다.',
      });
      throw err;
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      await sharingCommentAPI.deleteComment(commentId);
      set((state) => ({
        comments: state.comments.filter(
          (comment) => comment.commentId !== commentId
        ),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.',
      });
      throw err;
    }
  },

  reset: () => {
    set({
      comments: [],
      hasMore: true,
      lastCommentId: undefined,
      isLoading: false,
      error: null,
    });
  },
}));
