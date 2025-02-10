import { Comment } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">사용자 {comment.writer}</span>
        <span className="text-xs text-gray-500">
          {formatDateTime(comment.modifyTime)}
        </span>
      </div>
      <p className="text-sm">{comment.content}</p>
    </div>
  );
};
