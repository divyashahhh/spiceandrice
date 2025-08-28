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
import { useTikTokCredits } from '../contexts/TikTokCreditContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { credits, lastClaimDate, canClaimDaily, claimDailyCredit } = useTikTokCredits();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 0, icon: 'grid-outline', label: 'Posts' },
    { id: 1, icon: 'lock-closed-outline', label: 'Private' },
    { id: 2, icon: 'refresh-outline', label: 'Liked' },
    { id: 3, icon: 'bookmark-outline', label: 'Saved' },
    { id: 4, icon: 'heart-outline', label: 'Favorites' },
  ];

  const handleClaimDaily = () => {
    if (canClaimDaily) {
      claimDailyCredit();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Text style={styles.time}>1:46</Text>
          <Ionicons name="notifications" size={16} color="#000" style={styles.bellIcon} />
          <Ionicons name="person-add" size={20} color="#000" />
        </View>
        <View style={styles.topRight}>
          <View style={styles.statusBar}>
            <Ionicons name="cellular" size={12} color="#000" />
            <Ionicons name="wifi" size={12} color="#000" />
            <Ionicons name="battery-full" size={16} color="#000" />
          </View>
          <View style={styles.topIcons}>
            <Ionicons name="people" size={20} color="#000" />
            <Ionicons name="share-outline" size={20} color="#000" />
            <Ionicons name="menu" size={20} color="#000" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }}
              style={styles.profilePicture}
            />
            <View style={styles.storyBubble}>
              <Text style={styles.storyText}>Spill the tea</Text>
            </View>
            <View style={styles.addStoryButton}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </View>

          {/* Username and Handle */}
          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <Ionicons name="lock-closed" size={16} color="#000" />
              <Text style={styles.username}>pixlaravatar</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </View>
            <Text style={styles.handle}>@pixlaravatar</Text>
          </View>

          {/* Edit Button */}
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
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

          {/* Add Bio Button */}
          <Pressable style={styles.addBioButton}>
            <Ionicons name="add" size={16} color="#000" />
            <Text style={styles.addBioText}>Add bio</Text>
          </Pressable>

          {/* TikTok Credits Section */}
          <View style={styles.creditsSection}>
            <View style={styles.creditHeader}>
              <Ionicons name="diamond" size={20} color="#F62A54" />
              <Text style={styles.creditTitle}>TikTok Credits</Text>
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditAmount}>{credits}</Text>
              <Text style={styles.creditLabel}>credits available</Text>
            </View>
            <Pressable
              style={[styles.claimButton, !canClaimDaily && styles.claimButtonDisabled]}
              onPress={handleClaimDaily}
              disabled={!canClaimDaily}
            >
              <Ionicons name="gift" size={16} color={canClaimDaily ? "#fff" : "#999"} />
              <Text style={[styles.claimButtonText, !canClaimDaily && styles.claimButtonTextDisabled]}>
                {canClaimDaily ? 'Claim Daily Credit' : 'Already Claimed Today'}
              </Text>
            </Pressable>
            {lastClaimDate && (
              <Text style={styles.lastClaimText}>
                Last claimed: {new Date(lastClaimDate).toLocaleDateString()}
              </Text>
            )}
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
                size={24}
                color={selectedTab === tab.id ? '#000' : '#666'}
              />
              {selectedTab === tab.id && <View style={styles.activeTabIndicator} />}
            </Pressable>
          ))}
        </View>

        {/* Notification Banner */}
        <View style={styles.notificationBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              <Ionicons name="add" size={16} color="#000" />
            </View>
            <Text style={styles.bannerText}>
              View expired Stories in 'Your private videos'
            </Text>
            <Pressable style={styles.bannerClose}>
              <Ionicons name="close" size={16} color="#000" />
            </Pressable>
          </View>
        </View>

        {/* Video Content */}
        <View style={styles.videoGrid}>
          <View style={styles.videoThumbnail}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop' }}
              style={styles.thumbnailImage}
            />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoText}>My favourite planet used to be Earth...</Text>
            </View>
            <View style={styles.videoStats}>
              <View style={styles.playCount}>
                <Ionicons name="play" size={12} color="#fff" />
                <Text style={styles.playCountText}>110</Text>
              </View>
              <View style={styles.videoIcon}>
                <Ionicons name="square" size={12} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  topLeft: {
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  bellIcon: {
    marginBottom: 4,
  },
  topRight: {
    alignItems: 'flex-end',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  storyBubble: {
    position: 'absolute',
    top: -10,
    left: -20,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
    borderColor: '#fff',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  handle: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  addBioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
  },
  addBioText: {
    fontSize: 14,
    color: '#000',
  },
  creditsSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    color: '#000',
  },
  creditInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  creditAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F62A54',
    marginBottom: 4,
  },
  creditLabel: {
    fontSize: 14,
    color: '#666',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F62A54',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  claimButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  claimButtonTextDisabled: {
    color: '#999',
  },
  lastClaimText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -16,
    width: 20,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  notificationBanner: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  bannerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  bannerClose: {
    padding: 4,
  },
  videoGrid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  videoThumbnail: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 40,
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
  videoStats: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  videoIcon: {
    padding: 4,
  },
});


