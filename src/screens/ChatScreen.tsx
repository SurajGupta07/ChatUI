import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageBubble } from '../components/MessageBubble';
import { RatingModal } from '../components/RatingModal';
import { ReplyPreview } from '../components/ReplyPreview';
import { useChat } from '../context/ChatContext';
import { Message } from '../types';
import { Header } from '../components/Header';

export const ChatScreen: React.FC = () => {
  const { messages, replyState, setReplyState, addMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const getReplyToMessage = (replyToId?: string): Message | undefined => {
    if (!replyToId) return undefined;
    return messages.find(msg => msg.id === replyToId);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage({
        sender: 'user',
        text: inputText.trim(),
        type: 'text',
        replyTo: replyState?.messageId || '',
      });
      setInputText('');
      setReplyState(null);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleEndChat = () => {
    setShowRatingModal(true);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const replyToMessage = getReplyToMessage(item.replyTo);
    return <MessageBubble message={item} replyToMessage={replyToMessage} />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header onPress={handleEndChat} />

      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {replyState && (
        <ReplyPreview
          replyState={replyState}
          onCancel={() => setReplyState(null)}
        />
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
