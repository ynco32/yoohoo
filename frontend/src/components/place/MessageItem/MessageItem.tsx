// MessageItem.tsx
import styles from './MessageItem.module.scss';

interface Message {
  id: number;
  nickname: string;
  time: string;
  content: string;
}

interface Props {
  message: Message;
  replyTo?: Message;
}

export default function MessageItem({ message, replyTo }: Props) {
  const isMine = message.nickname === '나';
  const wrapperClass = `${styles.messageWrapper} ${isMine ? styles.mine : styles.other}`;

  return (
    <div className={wrapperClass}>
      <div className={styles.message}>
        {!isMine && (
          <div className={styles.nickname}>{message.nickname}</div>
        )}
        {replyTo && (
          <div className={styles.replyBox}>
            <div className={styles.replyNickname}>{replyTo.nickname}</div>
            <hr className={styles.replyDivider} />
            <div className={styles.replyContent}>{replyTo.content.split('\n')[0]}...</div>
          </div>
        )}
        <div className={styles.bubbleRow}>
          <div className={styles.bubble}>{message.content}</div>
          <span className={styles.meta}>{message.time}</span>
        </div>
      </div>
    </div>
  );
}