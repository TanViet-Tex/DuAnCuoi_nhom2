import React, { useEffect, useRef, useState } from 'react';
import ChatButton from './ChatButton';
import ChatMessage from './ChatMessage';
import type { ChatMessageItem } from './ChatMessage';
import { getBotResponse } from './chatBot';

const STORAGE_KEY = 'chat_history_v1';

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatBox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMessageItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch (e) {
      // ignore
    }
    // scroll to bottom when messages update
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, [msgs]);

  const pushMessage = (m: ChatMessageItem) => setMsgs((s) => [...s, m]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessageItem = { id: Date.now().toString() + '-u', sender: 'user', text, time: nowTime() };
    pushMessage(userMsg);
    setInput('');

    // bot typing indicator
    const typingId = Date.now().toString() + '-t';
    pushMessage({ id: typingId, sender: 'bot', text: '...', time: nowTime() });

    const botResp = await getBotResponse(text);

    // replace typing message
    setMsgs((prev) => prev.filter((m) => m.id !== typingId));
    pushMessage({ id: Date.now().toString() + '-b', sender: 'bot', text: botResp.text, time: nowTime() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMsgs([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  return (
    <>
      <div className={`fixed z-40 right-6 bottom-20 transition-all ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-80 md:w-96 h-96 bg-black rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-gray-200">
          <div className="px-4 py-3 bg-amber-600 text-white flex items-center justify-between">
            <div className="font-semibold">Hỗ trợ trực tuyến</div>
            <div className="text-xs opacity-90">Chatbot</div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {msgs.length === 0 && (
              <div className="text-center text-sm text-gray-500 mt-6 px-4">Xin chào! Bạn có thể hỏi về giá, bảo hành, giao hàng hoặc đổi trả.</div>
            )}
            {msgs.map((m) => (
              <ChatMessage key={m.id} msg={m} />
            ))}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
              />
              <button onClick={handleSend} className="px-3 py-2 bg-amber-600 text-black rounded-lg font-semibold shadow-md hover:bg-amber-700">Gửi</button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <button onClick={clearHistory} className="underline">Xóa lịch sử</button>
              <div>{msgs.length} tin nhắn</div>
            </div>
          </div>
        </div>
      </div>

      <ChatButton open={open} onClick={() => setOpen((s) => !s)} />
    </>
  );
};

export default ChatBox;
