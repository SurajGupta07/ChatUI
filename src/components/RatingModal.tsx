import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
      setRating(0);
    } else {
      scale.value = withSpring(0);
      opacity.value = withTiming(0);
    }
  }, [opacity, scale, visible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      Alert.alert(
        'Thank You!',
        `Your ${rating}-star rating has been captured.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              setRating(0);
            },
          },
        ],
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <AnimatedView entering={FadeIn} exiting={FadeOut} style={styles.backdrop}>
        <View style={styles.blurContainer}>
          <AnimatedView style={[styles.modalContent, modalStyle]}>
            <Text style={styles.title}>Thank You!</Text>
            <Text style={styles.subtitle}>
              We hope you had a great experience
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingSelect(star)}
                  style={styles.starButton}
                >
                  <Text
                    style={[styles.star, star <= rating && styles.starFilled]}
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.submitButton,
                rating === 0 && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </AnimatedView>
        </View>
      </AnimatedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: SCREEN_WIDTH * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 40,
    color: '#FFD700',
  },
  starFilled: {
    fontSize: 40,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
