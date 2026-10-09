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
    ? 'bg-coral-tint border border-coral/40 text-paper-50 rounded-2xl rounded-br-sm shadow-sm'
    : 'bg-ink-850 border border-ink-700 text-paper-50 rounded-2xl rounded-bl-sm shadow-sm';

  return (
    <div
      className={`flex flex-col ${
        isUser ? 'items-end ml-auto' : 'items-start mr-auto'
      } my-2.5 max-w-[90%] sm:max-w-[78%] animate-message-enter`}
    >
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

      {/* Bubble Container with physical easing and micro-shadow */}
      <div
        className={`px-4 py-3 text-xs sm:text-sm leading-relaxed transition-all ${
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
  // Vary typing behavior description and dot rhythm based on character speed quirk
  const isFastPaced = typingSpeedMs <= 850;
  const isDeliberate = typingSpeedMs >= 1400;

  const cadenceLabel = isFastPaced
    ? 'RAPID DRAFTING...'
    : isDeliberate
    ? 'DELIBERATING CAREFULLY...'
    : 'TYPING...';

  // Slower/faster bounce animation duration based on character pacing
  const bounceDurationClass = isFastPaced
    ? 'duration-500'
    : isDeliberate
    ? 'duration-1000'
    : 'duration-700';

  return (
    <div className="flex flex-col items-start my-2.5 max-w-[80%] animate-message-enter">
      <div className="px-1 text-[11px] font-mono text-paper-400 mb-1 select-none flex items-center gap-1.5">
        <span className="text-paper-300 font-semibold">{characterName.toUpperCase()}</span>
        <span className="text-coral/80">{cadenceLabel}</span>
      </div>
      <div className={`px-4 py-3 flex items-center space-x-1.5 ${bubbleClassName || 'bg-ink-850 border border-ink-700 rounded-2xl rounded-bl-sm shadow-sm'}`}>
        <span className={`w-1.5 h-1.5 rounded-full bg-coral animate-bounce ${bounceDurationClass}`} />
        <span
          className={`w-1.5 h-1.5 rounded-full bg-coral animate-bounce ${bounceDurationClass} [animation-delay:150ms]`}
        />
        <span
          className={`w-1.5 h-1.5 rounded-full bg-coral animate-bounce ${bounceDurationClass} [animation-delay:300ms]`}
        />
        {isDeliberate && (
          <span
            className={`w-1.5 h-1.5 rounded-full bg-coral animate-bounce ${bounceDurationClass} [animation-delay:450ms]`}
          />
        )}
      </div>
    </div>
  );
};
