import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Message } from '../types';
import { useChat } from '../context/ChatContext';
import { AIFeedback } from './AIFeedback';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const SWIPE_MAX = 100;
const EMOJI_BAR_WIDTH = 250;
const EMOJI_BAR_HEIGHT = 50;
const EMOJIS = ['🙏', '✨', '🌙', '💫', '🌟'];

interface MessageBubbleProps {
  message: Message;
  replyToMessage?: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  replyToMessage,
}) => {
  const { setReplyState, addReaction } = useChat();
  const translateX = useSharedValue(0);
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [emojiBarPosition, setEmojiBarPosition] = useState({ x: 0, y: 0 });

  const emojiScale = useSharedValue(0);
  const emojiOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (showEmojiBar) {
      emojiScale.value = withSpring(1);
      emojiOpacity.value = withTiming(1);
    } else {
      emojiScale.value = withSpring(0);
      emojiOpacity.value = withTiming(0);
    }
  }, [emojiOpacity, emojiScale, showEmojiBar]);

  const panGesture = Gesture.Pan()
    .enabled(!isSystem)
    .activeOffsetX([10, SCREEN_WIDTH])
    .onUpdate(e => {
      'worklet';
      if (e.translationX > 0) {
        translateX.value = Math.min(e.translationX, SWIPE_MAX);
      }
    })
    .onEnd(e => {
      'worklet';
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(setReplyState)({
          messageId: message.id,
          messageText: message.text,
          sender: message.sender,
        });
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .enabled(!isSystem)
    .onStart(e => {
      'worklet';
      const x = Math.min(
        Math.max(e.x - EMOJI_BAR_WIDTH / 2, 10),
        SCREEN_WIDTH - EMOJI_BAR_WIDTH - 10,
      );
      const y = e.y - EMOJI_BAR_HEIGHT - 20;

      runOnJS(setEmojiBarPosition)({ x, y });
      runOnJS(setShowEmojiBar)(true);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const replyIconStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 20 ? translateX.value / SWIPE_MAX : 0;
    return {
      opacity,
      transform: [{ scale: opacity }],
    };
  });

  const emojiBarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
    opacity: emojiOpacity.value,
  }));

  const handleEmojiSelect = (emoji: string) => {
    addReaction(message.id, emoji);
    setShowEmojiBar(false);
  };

  const handleBackdropPress = () => {
    setShowEmojiBar(false);
  };

  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.bubbleWrapper, animatedStyle]}>
          <Animated.View style={[styles.replyIcon, replyIconStyle]}>
            <Text style={styles.replyIconText}>↩</Text>
          </Animated.View>
          <View
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.otherBubble,
            ]}
          >
            {replyToMessage && (
              <View style={styles.replyPreview}>
                <Text style={styles.replyPreviewSender}>
                  {replyToMessage.sender === 'user' ? 'You' : 'Astrologer'}
                </Text>
                <Text style={styles.replyPreviewText} numberOfLines={1}>
                  {replyToMessage.text}
                </Text>
              </View>
            )}
            <Text style={[styles.text, isUser && styles.userText]}>
              {message.text}
            </Text>
            {message.reactions && message.reactions.length > 0 && (
              <View style={styles.reactionsContainer}>
                {message.reactions.map((emoji, index) => (
                  <Text key={index} style={styles.reactionEmoji}>
                    {emoji}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
      {message.type === 'ai' && message.hasFeedback !== false && (
        <AIFeedback message={message} />
      )}
      {showEmojiBar && (
        <>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
          <Animated.View
            style={[
              styles.emojiBar,
              {
                left: emojiBarPosition.x,
                top: emojiBarPosition.y,
              },
              emojiBarStyle,
            ]}
          >
            {EMOJIS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    maxWidth: '80%',
    flexShrink: 1,
  },
  replyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyIconText: {
    color: 'white',
    fontSize: 20,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    flexShrink: 1,
    minWidth: 0,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  userText: {
    color: '#FFF',
  },
  replyPreview: {
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 8,
    marginBottom: 8,
    opacity: 0.7,
  },
  replyPreviewSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#101323',
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 14,
    color: '#10182B',
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  systemText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  backdrop: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
  emojiBar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    width: EMOJI_BAR_WIDTH,
    height: EMOJI_BAR_HEIGHT,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 24,
  },
});
