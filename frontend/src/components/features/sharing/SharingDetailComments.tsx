import { useState, useEffect, useRef } from 'react';
import { CommentItem } from './CommentItem';
import { useMswInit } from '@/hooks/useMswInit';
import { useSharingCommentStore } from '@/store/useSharingCommentStore';
import { TextArea } from '@/components/common/TextArea';

interface SharingDetailCommentsProps {
  sharingId: number;
}

export const SharingDetailComments = ({
  sharingId,
}: SharingDetailCommentsProps) => {
  const [commentContent, setCommentContent] = useState('');
  const { mswInitialized } = useMswInit();
  const comments = useSharingCommentStore((state) => state.comments);
  const isLoading = useSharingCommentStore((state) => state.isLoading);
  const error = useSharingCommentStore((state) => state.error);
  const hasMore = useSharingCommentStore((state) => state.hasMore);
  const { fetchComments, fetchMoreComments, addComment } =
    useSharingCommentStore();

  // IntersectionObserver용 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // 초기 데이터 로딩
  useEffect(() => {
    if (!mswInitialized) return;
    fetchComments(sharingId);

    return () => {
      useSharingCommentStore.getState().reset();
    };
  }, [fetchComments, mswInitialized, sharingId]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMoreComments(sharingId);
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
  }, [fetchMoreComments, hasMore, isLoading, sharingId]);

  return (
    <div className="mx-6 mb-5 space-y-2">
      <h2 className="font-medium">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!commentContent.trim()) return;

          try {
            await addComment(sharingId, commentContent);
            setCommentContent('');
          } catch (err) {
            console.error('Error posting comment:', err);
          }
        }}
        className="mb-4"
      >
        <div className="flex flex-col gap-2">
          <TextArea
            value={commentContent}
            onChange={setCommentContent}
            placeholder="댓글을 입력하세요"
            rows={2}
          />
          <button
            type="submit"
            disabled={!commentContent.trim()}
            className="-mt-1 ml-auto rounded-lg bg-sight-button px-4 py-2 text-sm text-white disabled:bg-gray-300"
          >
            등록
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div
              key={comment.commentId}
              className={`pb-2 ${index !== comments.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <CommentItem comment={comment} />
            </div>
          ))}
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
