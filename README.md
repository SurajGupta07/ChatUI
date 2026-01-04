# Chat UI - React Native Implementation

A high-performance, interactive chat screen built with React Native New Architecture, featuring smooth animations, gesture handling, and micro-interactions.

## Features Implemented

### Part A: Interactive Message Actions

1. **Swipe-to-Reply**

   - Swipe right on any message to reveal a Reply icon
   - On release after threshold, message springs back and reply preview appears
   - Reply preview shows above input with cancel option
   - Uses Reanimated shared values and worklets
   - Gesture logic runs on UI thread using `Gesture.Pan`

2. **Message Reactions (Long-Press)**
   - Long-press any message to show emoji reaction bar (🙏 ✨ 🌙 💫 🌟)
   - Emoji bar appears near the press location
   - Selecting an emoji attaches it below the message bubble
   - Smooth animations using Reanimated

### Part B: AI Feedback & Session Flow

1. **AI Dislike Feedback**

   - Like/Dislike toggle for AI Astrologer messages
   - On Dislike, feedback chips expand with animation:
     - Inaccurate
     - Too Vague
     - Too Long
   - Chip selection updates local state
   - Smooth layout animations

2. **Session Termination & Rating**
   - "End Chat" button in header
   - On press, shows full-screen overlay with:
     - 5-star rating component
     - "Thank You" message
   - Layout animations for transitions
   - Alert confirms rating data capture

## Project Structure

```
src/
├── components/
│   ├── MessageBubble.tsx      # Main message component with swipe & long-press
│   ├── AIFeedback.tsx         # Like/Dislike with expandable chips
│   ├── ReplyPreview.tsx       # Reply preview above input
│   └── RatingModal.tsx        # End chat rating modal
├── screens/
│   └── ChatScreen.tsx         # Main chat screen
├── context/
│   └── ChatContext.tsx        # State management with React Context
├── types/
│   └── index.ts               # TypeScript type definitions
└── data/
    └── mockData.ts            # Initial chat messages
```

## Setup & Running

### Prerequisites

- Node.js = 20.19.4
- React Native 0.83.0 (New Architecture)
- iOS: Xcode and CocoaPods
- Android: Android Studio

### Installation

1. Install dependencies:

```bash
npm install
```

2. For iOS, install pods:

```bash
cd ios && pod install && cd ..
```

3. Run the app:

**iOS:**

```bash
npx react-native run-ios
```

**Android:**

```bash
npx react-native run-android
```

## Technical Implementation Details

### Reanimated Usage

- **Shared Values**: Used for all animated properties (`translateX`, `scale`, `opacity`)
- **Worklets**: All gesture handlers run on UI thread using `'worklet'` directive
- **Animations**:
  - `withSpring()` for natural spring-back animations (swipe-to-reply)
  - `withTiming()` for smooth transitions (emoji bar, feedback chips)
  - `scheduleOnRN()` to bridge UI thread worklets to JS thread for state updates

**Key Example - Swipe-to-Reply:**

```typescript
const translateX = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onUpdate((e) => {
    'worklet';
    if (e.translationX > 0) {
      translateX.value = Math.min(e.translationX, SWIPE_MAX);
    }
  })
  .onEnd((e) => {
    'worklet';
    if (e.translationX > SWIPE_THRESHOLD) {
      scheduleOnRN(setReplyState, {...});
      translateX.value = withSpring(0);
    }
  });
```

### Gesture Handling Approach

- **React Native Gesture Handler**: Used for all touch interactions
- **Gesture Composition**: `Gesture.Simultaneous()` allows swipe and long-press on same element
- **UI Thread Execution**: All gesture callbacks run on UI thread for 60fps performance
- **Gesture Types**:
  - `Gesture.Pan()` for swipe-to-reply
  - `Gesture.LongPress()` for emoji reactions

**Key Example - Combined Gestures:**

```typescript
const panGesture = Gesture.Pan()...
const longPressGesture = Gesture.LongPress()...
const composedGesture = Gesture.Simultaneous(panGesture, longPressGesture);
```

### State Management Choice

**React Context API** was chosen for this implementation because:

1. **Simplicity**: No external dependencies, built into React
2. **Performance**: Sufficient for chat UI with moderate message volume
3. **Type Safety**: Full TypeScript support with proper typing
4. **Real-time Updates**: Context provides reactive updates for all consumers
5. **Scope**: Chat state is localized to the chat screen, perfect for Context

**Alternative Considerations:**

- **Zustand**: Would be better for larger apps with multiple screens
- **Redux**: Overkill for this single-screen chat interface

**State Structure:**

```typescript
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
```

## Key Design Decisions

1. **Swipe Direction**: Only right swipe for reply (prevents conflicts with scroll)
2. **Emoji Bar Position**: Calculated dynamically based on press location
3. **Feedback Chips**: Expand on dislike, collapse on like (clear UX)
4. **Rating Modal**: Full-screen overlay for focus (better UX than bottom sheet)
5. **Reply Preview**: Shows above input (standard chat pattern)

## Testing the Features

1. **Swipe-to-Reply**:

   - Swipe right on any message
   - Release after ~80px to trigger reply
   - See reply preview above input

2. **Long-Press Reactions**:

   - Long-press any message for 300ms
   - Emoji bar appears near press location
   - Tap emoji to add/remove reaction

3. **AI Feedback**:

   - Tap Like/Dislike on AI messages
   - On Dislike, chips expand with animation
   - Select a chip to provide specific feedback

4. **End Chat & Rating**:
   - Tap "End Chat" in header
   - Rate experience with 5 stars
   - Submit to see confirmation alert

## Notes

- All animations are smooth and run at 60fps
- Gesture handlers are optimized for UI thread execution
- State management is simple but scalable
- Code is modular and maintainable
- TypeScript provides full type safety

## Future Enhancements

- Virtualized list for large message volumes
- Message pagination/infinite scroll
- Typing indicators
- Message status (sent, delivered, read)
- Image/file attachments
- Voice messages

## Preview Video

https://github.com/user-attachments/assets/13617937-ec23-4835-b750-821d6c468c76

---
