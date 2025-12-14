import React from 'react';

const ChatButton: React.FC<{ open: boolean; onClick: () => void }> = ({ open, onClick }) => {
 return (
  <button
    aria-label="Open chat"
    onClick={onClick}
    className={`fixed z-50 right-6 bottom-6 w-16 h-16 flex items-center justify-center 
                rounded-xl shadow-lg transition-transform duration-150
                ${open ? 'scale-95' : 'scale-100'} 
                bg-white hover:bg-gray-100 ring-1 ring-gray-300`}
  >
    <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </button>
);};

export default ChatButton;
