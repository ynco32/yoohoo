import { Comment } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Modal } from '@/components/common/Modal';
import { useSharingCommentStore } from '@/store/useSharingCommentStore';
import Image from 'next/image';
import { getUserProfileImage } from '@/lib/utils/profileCharacter';
import { TextArea } from '@/components/common/TextArea';

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
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="relative h-8 w-8 flex-shrink-0">
          <Image
            src={getUserProfileImage(updatedComment.writerLevel)}
            alt="프로필"
            fill
            sizes="32px"
            className="rounded-full object-cover"
          />
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 space-y-2">
          {/* 상단 영역: 닉네임과 날짜 */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium font-semibold text-gray-800">
              {updatedComment.writer}
            </span>
            <span className="text-xs text-gray-500">
              {formatDateTime(updatedComment.modifyTime)}
            </span>
          </div>

          {/* 중간 영역: 댓글 내용 */}
          {isEditing ? (
            <div className="flex flex-col space-y-1">
              <TextArea
                value={editContent}
                onChange={setEditContent}
                rows={2}
              />
              <button
                onClick={handleUpdate}
                disabled={!editContent.trim()}
                className="-mt-1 ml-auto rounded-lg bg-sight-button px-4 py-2 text-sm text-white disabled:bg-gray-300"
              >
                완료
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-800">{updatedComment.content}</p>
          )}

          {/* 하단 영역: 수정/삭제 버튼 */}
          {isMyComment && (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {isEditing ? '취소' : '수정'}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>
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
