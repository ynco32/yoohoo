import { Comment } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Modal } from '@/components/common/Modal';
import { useSharingCommentStore } from '@/store/useSharingCommentStore';

export const CommentItem = ({ comment }: { comment: Comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // 액션만 가져오기
  const { updateComment, deleteComment } = useSharingCommentStore();
  const user = useUserStore((state) => state.user);
  const isMyComment = user?.userId === comment.writerId;
  const updatedComment = useSharingCommentStore(
    (state) =>
      state.comments.find((c) => c.commentId === comment.commentId) || comment
  );

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    try {
      await updateComment(updatedComment.commentId, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(updatedComment.commentId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{updatedComment.writer}</span>
          {isMyComment && (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isEditing ? '취소' : '수정'}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="focus:border-primary w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
              rows={2}
            />
            <button
              onClick={handleUpdate}
              disabled={!editContent.trim()}
              className="h-fit rounded-lg bg-primary-main px-4 py-2 text-sm text-white disabled:bg-gray-300"
            >
              완료
            </button>
          </div>
        ) : (
          <p className="text-sm">{updatedComment.content}</p>
        )}
        <p className="text-xs text-gray-500">
          {formatDateTime(updatedComment.modifyTime)}
        </p>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        type="confirm"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
};
