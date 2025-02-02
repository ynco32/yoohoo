import { Comment } from '@/types/sharing';

interface SharingDetailCommentsProps {
  comments: Comment[];
}

export const SharingDetailComments = ({
  comments,
}: SharingDetailCommentsProps) => {
  return (
    <div className="mx-4 mb-5 space-y-2 rounded-xl bg-gray-100 p-5">
      <h2 className="font-medium">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h2>
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.commentId} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">사용자 {comment.writer}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.modifyTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
      )}
    </div>
  );
};
