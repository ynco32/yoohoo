// components/features/sharing/SharingDetailComments.tsx
import { useState, useEffect } from 'react';
import { Comment } from '@/types/sharing';
import { sharingAPI } from '@/lib/api/sharing';
import { CommentItem } from './CommentItem';
import { useMswInit } from '@/hooks/useMswInit';

interface SharingDetailCommentsProps {
  sharingId: number;
}

export const SharingDetailComments = ({ sharingId }: SharingDetailCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastCommentId, setLastCommentId] = useState<number | undefined>(undefined);
  const { mswInitialized } = useMswInit();

  const fetchComments = async () => {
    if (!mswInitialized) return;

    try {
      setIsLoading(true);
      const response = await sharingAPI.getComments(sharingId, lastCommentId);
      
      setComments(prev => [...prev, ...response.comments]);
      setHasMore(!response.lastPage);
      
      if (response.comments.length > 0) {
        setLastCommentId(response.comments[response.comments.length - 1].commentId);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [sharingId, mswInitialized]);

  return (
    <div className="mx-4 mb-5 space-y-2 rounded-xl bg-gray-100 p-5">
      <h2 className="font-medium">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h2>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))}
          {hasMore && !isLoading && (
            <button 
              onClick={fetchComments}
              className="w-full p-2 text-gray-600 hover:text-gray-800"
            >
              댓글 더보기
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          {isLoading ? '댓글을 불러오는 중...' : '아직 댓글이 없습니다.'}
        </p>
      )}
    </div>
  );
};