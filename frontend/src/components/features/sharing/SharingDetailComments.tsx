import { useState, useEffect, useCallback, useRef } from 'react';
import { Comment } from '@/types/sharing';
import { sharingCommentAPI } from '@/lib/api/sharingComment';
import { CommentItem } from './CommentItem';
import { useMswInit } from '@/hooks/useMswInit';

interface SharingDetailCommentsProps {
  sharingId: number;
  writerId: number;
}

export const SharingDetailComments = ({
  sharingId,
}: SharingDetailCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastCommentId, setLastCommentId] = useState<number | undefined>(
    undefined
  );
  const { mswInitialized } = useMswInit();

  // IntersectionObserver용 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = useCallback(async () => {
    if (!mswInitialized || !hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await sharingCommentAPI.getComments(
        sharingId,
        lastCommentId
      );

      setComments((prev) => [...prev, ...response.comments]);
      setHasMore(!response.lastPage);

      if (response.comments.length > 0) {
        setLastCommentId(
          response.comments[response.comments.length - 1].commentId
        );
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(
        err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [mswInitialized, hasMore, isLoading, sharingId, lastCommentId]);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchInitialComments = async () => {
      if (!mswInitialized) return;

      try {
        setIsLoading(true);
        const response = await sharingCommentAPI.getComments(sharingId);
        setComments(response.comments);
        setHasMore(!response.lastPage);

        if (response.comments.length > 0) {
          setLastCommentId(
            response.comments[response.comments.length - 1].commentId
          );
        }
      } catch (err) {
        console.error('Error fetching initial comments:', err);
        setError(
          err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialComments();
  }, [mswInitialized, sharingId]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchComments();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadingRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchComments, hasMore, isLoading]);

  // 댓글 작성 핸들러
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) return;

    try {
      const newComment = await sharingCommentAPI.createComment(
        sharingId,
        commentContent
      );
      setComments((prev) => [newComment, ...prev]);
      setCommentContent('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(
        err instanceof Error ? err.message : '댓글 작성에 실패했습니다.'
      );
    }
  };

  // 수정 삭제
  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      const updatedComment = await sharingCommentAPI.updateComment(
        commentId,
        content
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.commentId === commentId ? updatedComment : comment
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '댓글 수정에 실패했습니다.'
      );
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await sharingCommentAPI.deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.'
      );
    }
  };

  return (
    <div className="mx-4 mb-5 space-y-2 rounded-xl bg-gray-100 p-5">
      <h2 className="font-medium">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h2>
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex flex-col gap-2">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={2}
            placeholder="댓글을 입력하세요"
            className="focus:border-primary flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!commentContent.trim()}
            className="ml-auto rounded-lg bg-primary-main px-4 py-2 text-sm text-white disabled:bg-gray-300"
          >
            등록
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
          {/* 스크롤 감지를 위한 div */}
          <div ref={loadingRef} className="h-px" />
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          {isLoading ? '댓글을 불러오는 중...' : '아직 댓글이 없습니다.'}
        </p>
      )}
    </div>
  );
};
