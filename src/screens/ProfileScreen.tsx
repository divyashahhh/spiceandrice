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
  Modal,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCredits } from '../context/CreditsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Optional: provide icon hooks here. Replace the empty strings with require(...) to your assets when ready.
const tierIconFor = (group: 'creator' | 'consumer', key: string): any | undefined => {
  const map: Record<string, any> = {
    'creator-certified': require('../../tiktok-demo/assets/high-quality.png'),
    'creator-bronze': require('../../tiktok-demo/assets/coin.png'),
    'creator-silver': require('../../tiktok-demo/assets/coin (2).png'),
    'creator-gold': require('../../tiktok-demo/assets/coin (1).png'),
    'consumer-bronze': require('../../tiktok-demo/assets/coin.png'),
    'consumer-silver': require('../../tiktok-demo/assets/coin (1).png'),
    'consumer-gold': require('../../tiktok-demo/assets/coin (2).png'),
  };
  return map[`${group}-${key}`];
};

// Tier thresholds (can be adjusted later)
const TIERS = {
  creator: [
    { key: 'certified', label: 'Certified', threshold: 100, subtitle: 'Eligible to create', icon: tierIconFor('creator','certified') },
    { key: 'bronze', label: 'Bronze', threshold: 500, subtitle: '60% creator / 40% TikTok', icon: tierIconFor('creator','bronze') },
    { key: 'silver', label: 'Silver', threshold: 1500, subtitle: '70% creator / 30% TikTok', icon: tierIconFor('creator','silver') },
    { key: 'gold', label: 'Gold', threshold: 3500, subtitle: '85% creator', icon: tierIconFor('creator','gold') },
  ],
  consumer: [
    { key: 'bronze', label: 'Bronze', threshold: 500, subtitle: 'Early access perks', icon: tierIconFor('consumer','bronze') },
    { key: 'silver', label: 'Silver', threshold: 1500, subtitle: 'Priority deals', icon: tierIconFor('consumer','silver') },
    { key: 'gold', label: 'Gold', threshold: 3500, subtitle: 'VIP benefits', icon: tierIconFor('consumer','gold') },
  ],
};

type Tier = { key: string; label: string; threshold: number; subtitle: string; icon?: any };

function TrackShell({ children, minHeight }: { children: React.ReactNode; minHeight: number }) {
  return (
    <LinearGradient colors={[ '#F62A54', '#28D7F6' ]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.trackGradient, { minHeight }] }>
      <View style={[styles.trackInner, { minHeight }]}>{children}</View>
    </LinearGradient>
  );
}

function TierTrack({ title, tiers, credits, minHeight }: { title: string; tiers: Tier[]; credits: number; minHeight: number }) {
  return (
    <TrackShell minHeight={minHeight}>
      <View style={styles.trackHeader}>
        <Text style={styles.trackTitle}>{title}</Text>
        <View style={styles.trackCreditsPill}>
          <Ionicons name="diamond" color="#F62A54" size={18} />
          <Text style={styles.trackCreditsText}>{credits.toFixed(0)}</Text>
        </View>
      </View>
      {tiers.map((t, idx) => {
        const unlocked = credits >= t.threshold;
        const last = idx === tiers.length - 1;
        return (
          <View key={t.key} style={styles.nodeRow}>
            <View style={styles.nodeCol}>
              <View style={[styles.connector, unlocked && styles.connectorActive, last && { height: 0 }]} />
              <View style={[styles.nodeOuter, unlocked && styles.nodeOuterActive]}>
                <View style={[styles.nodeInner, unlocked && styles.nodeInnerActive]} />
              </View>
            </View>
            <View style={[styles.nodeCard, unlocked && styles.nodeCardActive]}> 
              <View style={styles.nodeTitleRow}>
                <View style={styles.nodeTitleLeft}>
                  {t.icon ? (
                    <Image source={t.icon} style={styles.tierIcon} />
                  ) : (
                    <View style={styles.tierIconPlaceholder} />
                  )}
                  <Text style={styles.nodeTitle}>{t.label}</Text>
                </View>
                {unlocked && (
                  <View style={styles.badgePill}>
                    <Ionicons name="checkmark" size={12} color="#0A0" />
                    <Text style={styles.badgeText}>Unlocked</Text>
                  </View>
                )}
              </View>
              <Text style={styles.nodeSubtitle}>{t.subtitle}</Text>
              <View style={styles.thresholdRow}>
                <Ionicons name="trophy" size={14} color={unlocked ? '#FFD54F' : 'rgba(255,255,255,0.6)'} />
                <Text style={styles.thresholdText}>{t.threshold} credits</Text>
              </View>
            </View>
          </View>
        );
      })}
      {/* Spacer fills remaining height to keep both tracks visually equal */}
      <View style={{ flexGrow: 1}} />
    </TrackShell>
  );
}

export default function ProfileScreen() {
  const { credits } = useCredits();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const tabs = [
    { id: 0, icon: 'grid-outline', label: 'Posts' },
    { id: 1, icon: 'lock-closed-outline', label: 'Private' },
    { id: 2, icon: 'refresh-outline', label: 'Liked' },
    { id: 3, icon: 'bookmark-outline', label: 'Saved' },
    { id: 4, icon: 'heart-outline', label: 'Favorites' },
  ];

  // Calculate a shared minimum height so both tracks appear equal length
  const NODE_ROW_EST = 96; // approximate per-tier row height incl. spacing
  const HEADER_EST = 40;   // track header area
  const maxCount = Math.max(TIERS.creator.length, TIERS.consumer.length);
  const sharedMinHeight = HEADER_EST + NODE_ROW_EST * maxCount + 24; // padding

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
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCreditsModal(true)}>
            <View style={styles.creditsSection}>
              <View style={styles.creditHeader}>
                <Ionicons name="diamond" size={20} color="#F62A54" />
                <Text style={styles.creditTitle}>TikTok Credits</Text>
              </View>
              <View style={styles.creditInfo}>
                <Text style={styles.creditAmount}>{credits.toFixed(2)}</Text>
                <Text style={styles.creditLabel}>tap to view tiers</Text>
              </View>
            </View>
          </TouchableOpacity>
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

      {/* Credits Details Modal */}
      <Modal
        visible={showCreditsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreditsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={[ '#0d0d0d', '#121212' ]} style={styles.modalContainer}>
            <LinearGradient colors={[ 'rgba(246,42,84,0.3)', 'transparent' ]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}> 
              <Text style={styles.modalTitle}>Credits & Tiers</Text>
              <Pressable onPress={() => setShowCreditsModal(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </Pressable>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <View style={styles.totalCreditsBox}>
                <Ionicons name="diamond" size={20} color="#F62A54" />
                <Text style={styles.totalCreditsText}>Total Credits: {credits.toFixed(2)}</Text>
              </View>

              <View style={styles.tracksRow}>
                <TierTrack title="Creator" tiers={TIERS.creator as Tier[]} credits={credits} minHeight={sharedMinHeight} />
                <TierTrack title="Consumer" tiers={TIERS.consumer as Tier[]} credits={credits} minHeight={sharedMinHeight} />
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
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
    marginBottom: 8,
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F62A54',
    marginBottom: 2,
  },
  creditLabel: {
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    borderRadius: 14,
    width: width - 24,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  totalCreditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(246,42,84,0.1)',
    borderColor: '#1f1f1f',
    borderWidth: 1,
    padding: 12,
    margin: 16,
    borderRadius: 10,
  },
  totalCreditsText: {
    color: '#fff',
    fontWeight: '600',
  },
  tracksRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  trackGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 1.2,
  },
  trackInner: {
    backgroundColor: '#111',
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  trackTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  trackCreditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trackCreditsText: { color: '#fff', fontSize: 12 },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  nodeCol: {
    width: 28,
    alignItems: 'center',
  },
  connector: {
    position: 'absolute',
    top: 0,
    left: 13,
    width: 2,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  connectorActive: {
    backgroundColor: '#F62A54',
  },
  nodeOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },
  nodeOuterActive: {
    backgroundColor: 'rgba(246,42,84,0.25)',
    borderColor: '#F62A54',
  },
  nodeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.35)'
  },
  nodeInnerActive: {
    backgroundColor: '#F62A54'
  },
  nodeCard: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    padding: 10,
  },
  nodeCardActive: {
    borderColor: '#F62A54',
    shadowColor: '#F62A54',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  nodeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tierIcon: { width: 20, height: 20, borderRadius: 4 },
  tierIconPlaceholder: { width: 20, height: 20, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  nodeTitle: { color: '#fff', fontWeight: '700' },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,200,0,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { color: '#0f0', fontSize: 10, fontWeight: '700' },
  nodeSubtitle: { color: 'rgba(255,255,255,0.7)', marginTop: 4, fontSize: 12 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  thresholdText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});


