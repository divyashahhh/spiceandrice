import React, { useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

type FeedItem = {
  id: string;
  source: number | { uri: string };
  description: string;
  likes: number;
  comments: number;
  user: string;
};

const MOCK_VIDEOS: FeedItem[] = [
  { id: '1', source: require('../../tiktok-demo/assets/video1.mp4'), description: 'Sample clip 1 — local asset', likes: 1234, comments: 56, user: '@local' },
  { id: '2', source: require('../../tiktok-demo/assets/video2.mp4'), description: 'Sample clip 2 — local asset', likes: 9876, comments: 321, user: '@local' },
  { id: '3', source: require('../../tiktok-demo/assets/video3.mp4'), description: 'Sample clip 3 — local asset', likes: 345, comments: 22, user: '@local' },
  { id: '4', source: { uri: 'https://media.w3.org/2010/05/bunny/movie.mp4' }, description: 'Classic bunny clip for testing', likes: 812, comments: 40, user: '@testing' },
  { id: '5', source: { uri: 'https://media.w3.org/2010/05/video/movie_300.mp4' }, description: 'Sample movie 300px', likes: 120, comments: 9, user: '@sample' },
  { id: '6', source: { uri: 'https://media.w3.org/2010/05/video/movie_700.mp4' }, description: 'Sample movie 700px', likes: 640, comments: 77, user: '@sample2' },
  { id: '7', source: { uri: 'https://media.w3.org/2010/05/sintel/trailer.mp4' }, description: 'Sintel standard trailer', likes: 2200, comments: 145, user: '@open' }
];

function VideoCard({ item, isActive }: { item: FeedItem; isActive: boolean }) {
  const videoRef = useRef<Video>(null);
  const [liked, setLiked] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.card}>
      <Video
        ref={videoRef}
        source={item.source}
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
      <View style={[styles.bottomMeta, { bottom: Math.max(140, 24 + insets.bottom) }]}>
        <Text style={styles.userText}>{item.user}</Text>
        <Text style={styles.descText} numberOfLines={3}>{item.description}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

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


