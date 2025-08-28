import React, { useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');


function VideoCard({ item, isActive }) {
  const videoRef = useRef(null);
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


