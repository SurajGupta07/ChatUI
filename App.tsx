import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatProvider } from './src/context/ChatContext';
import ChatScreen from './src/screens/ChatScreen';

function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ChatProvider>
          <ChatScreen />
        </ChatProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
