import styles from './MessageItem.module.scss';

interface Message {
  id: number;
  nickname: string;
  time: string;
  content: string;
  isMe?: boolean;
  replyTo?: Message;
}

interface Props {
  message: Message;
  replyTo?: Message;
  onReply: () => void;
  onReplyClick?: () => void;
}

export default function MessageItem({
  message,
  replyTo,
  onReply,
  onReplyClick,
}: Props) {
  const isMine = message.isMe || message.nickname === '나';
  const wrapperClass = `${styles.messageWrapper} ${
    isMine ? styles.mine : styles.other
  }`;

  // 일반 메시지 렌더링
  const renderRegularMessage = () => (
    <>
      {!isMine && <div className={styles.nickname}>{message.nickname}</div>}
      <div className={styles.bubbleRow}>
        {isMine && <span className={styles.meta}>{message.time}</span>}
        <div className={styles.bubble} onClick={onReply}>
          {message.content}
        </div>
        {!isMine && <span className={styles.meta}>{message.time}</span>}
      </div>
    </>
  );

  // 답글 메시지 렌더링
  const renderReplyMessage = () => (
    <>
      {!isMine && <div className={styles.nickname}>{message.nickname}</div>}
      <div className={styles.bubbleRow}>
        <div className={styles.bubble}>
          <div
            className={styles.replyBox}
            onClick={(e) => {
              e.stopPropagation();
              if (onReplyClick) onReplyClick();
            }}
          >
            <div className={styles.replyContent}>{replyTo?.content}</div>
          </div>
          <hr className={styles.replyDivider} />
          <div className={styles.messageContent} onClick={onReply}>
            {message.content}
          </div>
        </div>
        <span className={styles.meta}>{message.time}</span>
      </div>
    </>
  );

  return (
    <div className={wrapperClass}>
      <div className={styles.message}>
        {replyTo ? renderReplyMessage() : renderRegularMessage()}
      </div>
    </div>
  );
}
