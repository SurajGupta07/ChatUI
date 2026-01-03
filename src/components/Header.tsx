import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderProps = {
  onPress: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Astrologer Vikram</Text>
        <Text style={styles.headerSubtitle}>Online</Text>
      </View>
      <TouchableOpacity style={styles.endChatButton} onPress={onPress}>
        <Text style={styles.endChatText}>End Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  endChatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
  },
  endChatText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
