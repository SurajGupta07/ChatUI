import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ReplyState } from '../types';

interface ReplyPreviewProps {
  replyState: ReplyState;
  onCancel: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyState,
  onCancel,
}) => {
  return (
    <AnimatedView entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.preview}>
          <Text style={styles.label}>Replying to:</Text>
          <Text style={styles.text} numberOfLines={1}>
            {replyState.messageText}
          </Text>
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: '#666',
  },
});
