import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Message, FeedbackChip } from '../types';
import { useChat } from '../context/ChatContext';

interface AIFeedbackProps {
  message: Message;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const AIFeedback: React.FC<AIFeedbackProps> = ({ message }) => {
  const { updateMessageFeedback } = useChat();
  const [selectedChip, setSelectedChip] = useState<FeedbackChip | null>(
    message.feedbackChip || null,
  );
  const isLiked = message.feedbackType === 'liked';
  const isDisliked = message.feedbackType === 'disliked';
  const showChips = isDisliked;

  const chipsHeight = useSharedValue(0);
  const chipsOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (showChips) {
      chipsHeight.value = withSpring(30);
      chipsOpacity.value = withTiming(1);
    } else {
      chipsHeight.value = withSpring(0);
      chipsOpacity.value = withTiming(0);
    }
  }, [chipsHeight, chipsOpacity, showChips]);

  const chipsAnimatedStyle = useAnimatedStyle(() => ({
    height: chipsHeight.value,
    opacity: chipsOpacity.value,
  }));

  const handleLike = () => {
    updateMessageFeedback(message.id, isLiked ? null : 'liked');
  };

  const handleDislike = () => {
    const newState = isDisliked ? null : 'disliked';
    updateMessageFeedback(message.id, newState);
  };

  const handleChipSelect = (chip: FeedbackChip) => {
    setSelectedChip(chip);
    updateMessageFeedback(message.id, 'disliked', chip);
  };

  const feedbackChips: FeedbackChip[] = ['Inaccurate', 'Too Vague', 'Too Long'];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLiked && styles.buttonActive]}
          onPress={handleLike}
        >
          <Text style={[styles.buttonText, isLiked && styles.buttonTextActive]}>
            👍 Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isDisliked && styles.buttonActive]}
          onPress={handleDislike}
        >
          <Text
            style={[styles.buttonText, isDisliked && styles.buttonTextActive]}
          >
            👎 Dislike
          </Text>
        </TouchableOpacity>
      </View>
      <AnimatedView style={[styles.chipsContainer, chipsAnimatedStyle]}>
        {feedbackChips.map(chip => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, selectedChip === chip && styles.chipSelected]}
            onPress={() => handleChipSelect(chip)}
          >
            <Text
              style={[
                styles.chipText,
                selectedChip === chip && styles.chipTextSelected,
              ]}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
  },
  buttonTextActive: {
    color: '#FFF',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  chipText: {
    fontSize: 12,
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFF',
  },
});
