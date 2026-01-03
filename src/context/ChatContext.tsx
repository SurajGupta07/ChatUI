import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message, ReplyState, FeedbackType, FeedbackChip } from '../types';
import { mockMessages } from '../data/mockData';

interface ChatContextType {
  messages: Message[];
  replyState: ReplyState | null;
  setReplyState: (reply: ReplyState | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessageFeedback: (
    messageId: string,
    feedbackType: FeedbackType,
    chip?: FeedbackChip,
  ) => void;
  addReaction: (messageId: string, emoji: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [replyState, setReplyState] = useState<ReplyState | null>(null);

  const addMessage = useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>) => {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newMessage]);
    },
    [],
  );

  const updateMessageFeedback = useCallback(
    (messageId: string, feedbackType: FeedbackType, chip?: FeedbackChip) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, feedbackType, feedbackChip: chip, hasFeedback: true }
            : msg,
        ),
      );
    },
    [],
  );

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          if (reactions.includes(emoji)) {
            return { ...msg, reactions: reactions.filter(r => r !== emoji) };
          }
          return { ...msg, reactions: [...reactions, emoji] };
        }
        return msg;
      }),
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        replyState,
        setReplyState,
        addMessage,
        updateMessageFeedback,
        addReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
