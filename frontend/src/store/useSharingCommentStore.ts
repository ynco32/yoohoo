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
  addComment: (comment: Comment) => void;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  reset: () => void;
}

export const useSharingCommentStore = create<CommentStore>((set) => ({
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

  addComment: (comment: Comment) => {
    set((state) => ({ comments: [comment, ...state.comments] }));
  },

  updateComment: async (commentId: number, content: string) => {
    try {
      const updatedComment = await sharingCommentAPI.updateComment(
        commentId,
        content
      );
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.commentId === commentId ? updatedComment : comment
        ),
      }));
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
