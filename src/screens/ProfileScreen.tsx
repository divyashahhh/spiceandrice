import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCredits } from '../context/CreditsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { credits } = useCredits();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 0, icon: 'grid-outline', label: 'Posts' },
    { id: 1, icon: 'lock-closed-outline', label: 'Private' },
    { id: 2, icon: 'refresh-outline', label: 'Liked' },
    { id: 3, icon: 'bookmark-outline', label: 'Saved' },
    { id: 4, icon: 'heart-outline', label: 'Favorites' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }}
              style={styles.profilePicture}
            />
            <View style={styles.addStoryButton}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </View>

          {/* Username and Handle */}
          <View style={styles.userInfo}>
            <Text style={styles.username}>pixlaravatar</Text>
            <Text style={styles.handle}>@pixlaravatar</Text>
          </View>

          {/* Edit Button */}
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>190</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>58</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>

          {/* TikTok Credits Section */}
          <View style={styles.creditsSection}>
            <View style={styles.creditHeader}>
              <Ionicons name="diamond" size={20} color="#F62A54" />
              <Text style={styles.creditTitle}>TikTok Credits</Text>
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditAmount}>{credits.toFixed(2)}</Text>
              <Text style={styles.creditLabel}>credits available</Text>
            </View>
          </View>
        </View>

        {/* Content Navigation Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={22}
                color={selectedTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)'}
              />
              {selectedTab === tab.id && <View style={styles.activeTabIndicator} />}
            </Pressable>
          ))}
        </View>

        {/* One sample video thumbnail area */}
        <View style={styles.videoGrid}>
          <View style={styles.videoThumbnail}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop' }}
              style={styles.thumbnailImage}
            />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoText}>My favourite planet used to be Earth...</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095F6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  handle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 18,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 18,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  creditsSection: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  creditInfo: {
    alignItems: 'center',
  },
  creditAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F62A54',
    marginBottom: 4,
  },
  creditLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0a0a0a',
  },
  tab: {
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 6,
    width: (width - 32) / 5,
  },
  activeTab: {},
  activeTabIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 18,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  videoGrid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  videoThumbnail: {
    width: width - 32,
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  videoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});


