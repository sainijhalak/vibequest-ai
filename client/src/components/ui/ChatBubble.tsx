import React from 'react';

interface ChatBubbleProps {
  speaker: 'user' | 'character';
  text: string;
  senderName: string;
  timestamp?: string;
  isCustom?: boolean;
  bubbleClassName?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  speaker,
  text,
  senderName,
  timestamp,
  isCustom,
  bubbleClassName
}) => {
  const isUser = speaker === 'user';

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const defaultClasses = isUser
    ? 'bg-comic-yellow text-black border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold'
    : 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium';

  return (
    <div
      className={`flex flex-col ${
        isUser ? 'items-end ml-auto' : 'items-start mr-auto'
      } my-3 max-w-[92%] sm:max-w-[80%] animate-message-enter`}
    >
      {/* Meta bar: Sender Badge & Timestamp */}
      <div className="flex items-center gap-2 mb-1 px-1 text-xs font-mono select-none">
        <span
          className={`font-black px-2 py-0.5 rounded-md border-2 border-black shadow-cartoon-sm uppercase text-[11px] ${
            isUser ? 'bg-black text-white' : 'bg-comic-yellow text-black'
          }`}
        >
          {isUser ? 'YOU' : senderName.toUpperCase()}
        </span>
        {isCustom && isUser && (
          <span className="text-[10px] font-black uppercase tracking-wider text-black px-1.5 py-0.5 rounded-md bg-comic-green border-2 border-black shadow-cartoon-sm">
            WRITE-IN
          </span>
        )}
        {formattedTime && <span className="text-gray-500 font-bold">• {formattedTime}</span>}
      </div>

      {/* Comic Speech Bubble with thick black ink border & cartoon shadow */}
      <div
        className={`px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm leading-relaxed transition-all ${
          bubbleClassName || defaultClasses
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
};

interface TypingIndicatorProps {
  characterName: string;
  typingSpeedMs?: number;
  bubbleClassName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  characterName,
  typingSpeedMs = 1000,
  bubbleClassName
}) => {
  const isFastPaced = typingSpeedMs <= 850;
  const isDeliberate = typingSpeedMs >= 1400;

  const cadenceLabel = isFastPaced
    ? 'RAPID DRAFTING...'
    : isDeliberate
    ? 'PONDERING RESPONSE...'
    : 'TYPING...';

  const bounceDurationClass = isFastPaced
    ? 'duration-500'
    : isDeliberate
    ? 'duration-1000'
    : 'duration-700';

  return (
    <div className="flex flex-col items-start my-3 max-w-[80%] animate-message-enter">
      <div className="px-1 text-xs font-mono mb-1 select-none flex items-center gap-2">
        <span className="bg-comic-yellow text-black font-black px-2 py-0.5 rounded-md border-2 border-black shadow-cartoon-sm text-[11px]">
          {characterName.toUpperCase()}
        </span>
        <span className="bg-comic-pink text-white font-black px-2 py-0.5 rounded-md border-2 border-black shadow-cartoon-sm text-[10px]">
          {cadenceLabel}
        </span>
      </div>
      <div
        className={`px-5 py-3.5 flex items-center space-x-2 ${
          bubbleClassName || 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full bg-black animate-bounce border border-black ${bounceDurationClass}`} />
        <span
          className={`w-2.5 h-2.5 rounded-full bg-black animate-bounce border border-black ${bounceDurationClass} [animation-delay:150ms]`}
        />
        <span
          className={`w-2.5 h-2.5 rounded-full bg-black animate-bounce border border-black ${bounceDurationClass} [animation-delay:300ms]`}
        />
      </div>
    </div>
  );
};
