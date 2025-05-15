// components/common/ChatInput/ChatInput.tsx
'use client';

import { useState, useRef } from 'react';
import styles from './ChatInput.module.scss';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export default function ChatInput({
  onSend,
  placeholder = '메시지 입력',
  buttonText = '전송',
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('44px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // 높이 자동 조절
    e.target.style.height = '44px'; // 기본 높이로 초기화
    const scrollHeight = e.target.scrollHeight;
    const newHeight = Math.min(scrollHeight, 120) + 'px'; // 최대 높이 제한
    e.target.style.height = newHeight;
    setTextareaHeight(newHeight);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // 시프트 엔터는 줄바꿈 (기본 동작 유지)
        return;
      } else {
        // 엔터만 누르면 메시지 전송
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input); // 입력된 메시지를 부모 컴포넌트로 전달
    setInput(''); // 입력 필드 초기화
    setTextareaHeight('44px');

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = '44px';
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.messageInput}
        style={{ height: textareaHeight }}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className={styles.sendButton}
      >
        {buttonText}
      </button>
    </div>
  );
}
