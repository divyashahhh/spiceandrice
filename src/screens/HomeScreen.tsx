import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DailyCreditPopup from '../components/DailyCreditPopup';
import { useTikTokCredits } from '../contexts/TikTokCreditContext';

const { height, width } = Dimensions.get('window');

type FeedItem = {
  id: string;
  uri: string;
  description: string;
  likes: number;
  comments: number;
  user: string;
};

const MOCK_VIDEOS: FeedItem[] = [
  { id: '1', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', description: 'Big Buck Bunny — demo clip', likes: 1234, comments: 56, user: '@bunny' },
  { id: '2', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'Bunny again — sample video', likes: 9876, comments: 321, user: '@demo' },
  { id: '3', uri: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', description: 'Sintel trailer — open movie', likes: 345, comments: 22, user: '@sintel' }
];

function VideoCard({ item, isActive }: { item: FeedItem; isActive: boolean }) {
  const videoRef = useRef<Video>(null);
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      <Video
        ref={videoRef}
        source={{ uri: item.uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay={isActive}
        isMuted={!isActive}
      />
      <LinearGradient colors={[ 'transparent', 'rgba(0,0,0,0.7)' ]} style={styles.bottomFade} />
      <View style={styles.rightRail}>
        <Pressable onPress={() => setLiked(v => !v)} style={styles.iconButton} hitSlop={10}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={30} color={liked ? '#F62A54' : '#fff'} />
          <Text style={styles.countText}>{(item.likes + (liked ? 1 : 0)).toLocaleString()}</Text>
        </Pressable>
        <Pressable style={styles.iconButton} hitSlop={10}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          <Text style={styles.countText}>{item.comments}</Text>
        </Pressable>
        <Pressable style={styles.iconButton} hitSlop={10}>
          <Ionicons name="share-social-outline" size={28} color="#fff" />
          <Text style={styles.countText}>Share</Text>
        </Pressable>
      </View>
      <View style={styles.bottomMeta}>
        <Text style={styles.userText}>{item.user}</Text>
        <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const { canClaimDaily } = useTikTokCredits();

  // Show popup when component mounts if user can claim daily credit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canClaimDaily) {
        setShowCreditPopup(true);
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [canClaimDaily]);

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_VIDEOS}
        keyExtractor={(v) => v.id}
        renderItem={({ item, index }) => (
          <VideoCard item={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
          setActiveIndex(newIndex);
        }}
      />
      
      {/* Daily Credit Popup */}
      <DailyCreditPopup
        visible={showCreditPopup}
        onClose={() => setShowCreditPopup(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  card: {
    width,
    height,
    backgroundColor: '#000'
  },
  rightRail: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center'
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 18
  },
  countText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 12
  },
  bottomMeta: {
    position: 'absolute',
    left: 12,
    right: 100,
    bottom: 40
  },
  userText: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6
  },
  descText: {
    color: 'rgba(255,255,255,0.9)'
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200
  }
});


