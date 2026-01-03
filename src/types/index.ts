export type MessageSender =
  | 'user'
  | 'ai_astrologer'
  | 'human_astrologer'
  | 'system';
export type MessageType = 'text' | 'ai' | 'human' | 'event';
export type FeedbackType = 'liked' | 'disliked' | null;
export type FeedbackChip = 'Inaccurate' | 'Too Vague' | 'Too Long';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  type: MessageType;
  hasFeedback?: boolean;
  feedbackType?: FeedbackType;
  feedbackChip?: FeedbackChip;
  replyTo?: string;
  reactions?: string[];
}

export interface ReplyState {
  messageId: string | null;
  messageText: string;
  sender: MessageSender;
}
