# TikTok Mock App with Credit System

A React Native mock TikTok application featuring a comprehensive TikTok credit system.

## Features

### 🎯 TikTok Credit System
- **Daily Free Credits**: Users can claim 1 free TikTok credit every day
- **Credit Tracker**: View your current credit balance in the profile page
- **Credit Spending**: Use credits to purchase items in the TikTok Shop
- **Persistent Storage**: Credits are saved locally using AsyncStorage

### 📱 Screens
- **Home Screen**: Video feed with daily credit popup
- **Profile Screen**: Complete TikTok profile design with credit management
- **Shop Screen**: Product catalog where users can spend credits
- **Create Screen**: Content creation interface
- **Inbox Screen**: Messaging and notifications

### 🎁 Daily Credit Popup
- Automatically appears on the home screen after 2 seconds
- Beautiful animated design with gradient borders
- Shows current credit balance
- Prevents claiming multiple times per day

### 💎 Credit Management
- **Earn Credits**: Claim daily free credits
- **Track Credits**: View balance in profile and shop
- **Spend Credits**: Purchase products in the shop
- **Credit History**: See when you last claimed credits

## How to Use

1. **Claim Daily Credits**: 
   - Visit the home screen to see the daily credit popup
   - Or go to your profile and tap "Claim Daily Credit"

2. **View Credit Balance**:
   - Check your profile page for current credits
   - See credits displayed in the shop header

3. **Spend Credits**:
   - Browse products in the TikTok Shop
   - Tap on products to see credit requirements
   - Purchase items using your accumulated credits

## Technical Implementation

### Context API
- `TikTokCreditContext`: Manages credit state and operations
- AsyncStorage for persistent credit storage
- Daily claim validation logic

### Components
- `DailyCreditPopup`: Animated credit claim interface
- Enhanced `ProfileScreen`: Complete TikTok profile design
- Updated `ShopScreen`: Credit-based purchasing system

### State Management
- Credit balance tracking
- Last claim date validation
- Daily claim availability checking

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   ```bash
   npm run ios
   npm run android
   npm run web
   ```

## Dependencies

- React Native with Expo
- @react-native-async-storage/async-storage
- @expo/vector-icons
- expo-linear-gradient
- expo-av (for video playback)

## Credit System Rules

- **Daily Limit**: 1 free credit per day
- **Reset Time**: Midnight local time
- **Persistence**: Credits saved between app sessions
- **Validation**: Prevents multiple claims on the same day

## Future Enhancements

- Credit earning through content creation
- Credit gifting between users
- Premium credit packages
- Credit-based content boosting
- Credit leaderboards and achievements
