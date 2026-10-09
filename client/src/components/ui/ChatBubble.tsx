import React from 'react';

interface ChatBubbleProps {
  speaker: 'user' | 'character';
  text: string;
  senderName: string;
  timestamp?: string;
  isCustom?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  speaker,
  text,
  senderName,
  timestamp,
  isCustom
}) => {
  const isUser = speaker === 'user';

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-2.5 max-w-[90%] sm:max-w-[78%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      {/* Meta bar: Sender & Timestamp */}
      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-paper-400 select-none">
        <span className={isUser ? 'text-coral font-medium' : 'text-paper-200 font-medium'}>
          {isUser ? 'YOU' : senderName.toUpperCase()}
        </span>
        {isCustom && isUser && (
          <span className="text-[10px] uppercase tracking-wider text-mint px-1 rounded bg-mint/10 border border-mint/20">
            custom write-in
          </span>
        )}
        {formattedTime && <span>• {formattedTime}</span>}
      </div>

      {/* Bubble Container */}
      <div
        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-sm ${
          isUser
            ? 'bg-coral-tint border border-coral/40 text-paper-50 rounded-br-sm'
            : 'bg-ink-850 border border-ink-700 text-paper-50 rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC<{ characterName: string }> = ({ characterName }) => {
  return (
    <div className="flex flex-col items-start my-2.5 max-w-[80%]">
      <div className="px-1 text-[11px] font-mono text-paper-400 mb-1 select-none">
        {characterName.toUpperCase()} IS TYPING...
      </div>
      <div className="bg-ink-850 border border-ink-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce" />
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
};
