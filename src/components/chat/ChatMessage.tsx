import React from 'react';

export type ChatMessageItem = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
};

const ChatMessage: React.FC<{ msg: ChatMessageItem }> = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-3 py-2`}> 
      <div className={`max-w-[78%] p-3 shadow-sm ${isUser ? 'bg-amber-600 text-black rounded-lg rounded-br-none' : 'bg-white text-gray-900 rounded-lg rounded-bl-none ring-1 ring-gray-100'}`}>
        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
        <div className={`text-xs mt-2 ${isUser ? 'text-amber-100 text-right' : 'text-gray-400 text-left'}`}>{msg.time}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
