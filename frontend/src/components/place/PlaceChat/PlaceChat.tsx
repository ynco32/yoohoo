'use client';

import React, { useState } from 'react';

interface PlaceChatProps {
  arenaId: string;
}

export default function PlaceChat({ arenaId }: PlaceChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div>
      <h2>채팅</h2>
    </div>
  );
}
