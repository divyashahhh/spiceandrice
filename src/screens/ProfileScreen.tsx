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
import { LinearGradient } from 'expo-linear-gradient';
import { useTikTokCredits } from '../contexts/TikTokCreditContext';
import BadgePopup from '../components/BadgePopup';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Tier thresholds and data
const TIERS = {
  creator: [
    { key: 'certified', label: 'Certified', threshold: 100, subtitle: 'Eligible to create', icon: undefined },
    { key: 'bronze', label: 'Bronze', threshold: 500, subtitle: '60% creator / 40% TikTok', icon: undefined },
    { key: 'silver', label: 'Silver', threshold: 1500, subtitle: '70% creator / 30% TikTok', icon: undefined },
    { key: 'gold', label: 'Gold', threshold: 3500, subtitle: '85% creator / 0% TikTok', icon: undefined },
  ],
  consumer: [
    { key: 'basic', label: 'Basic', threshold: 0, subtitle: 'Access to basic features', icon: undefined },
    { key: 'bronze', label: 'Bronze', threshold: 100, subtitle: 'Premium content access', icon: undefined },
    { key: 'silver', label: 'Silver', threshold: 500, subtitle: 'Exclusive content', icon: undefined },
    { key: 'gold', label: 'Gold', threshold: 1000, subtitle: 'VIP benefits', icon: undefined },
  ],
};

type Tier = { key: string; label: string; threshold: number; subtitle: string; icon?: any };

function getConsumerTier(credits: number) {
  let chosen = TIERS.consumer[0];
  for (const t of TIERS.consumer) {
    if (credits >= t.threshold) chosen = t;
  }
  return chosen;
}

// Visual tier track components
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
  const { credits, lastClaimDate, canClaimDaily, claimDailyCredit } = useTikTokCredits();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const currentTier = getConsumerTier(credits);

  // Calculate a shared minimum height so both tracks appear equal length
  const NODE_ROW_EST = 96; // approximate per-tier row height incl. spacing
  const HEADER_EST = 40;   // track header area
  const maxCount = Math.max(TIERS.creator.length, TIERS.consumer.length);
  const sharedMinHeight = HEADER_EST + NODE_ROW_EST * maxCount + 24; // padding

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

          {/* Consumer Credit Section */}
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

          {/* Daily Credit Claim */}
          <View style={styles.dailyClaimSection}>
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

          {/* Credit Spending History */}
          <View style={styles.spendingSection}>
            <Text style={styles.sectionTitle}>Recent Spending</Text>
            <View style={styles.spendingItem}>
              <Ionicons name="bag" size={20} color="#F62A54" />
              <Text style={styles.spendingText}>JBL Headphones</Text>
              <Text style={styles.spendingAmount}>-5 credits</Text>
            </View>
            <View style={styles.spendingItem}>
              <Ionicons name="gift" size={20} color="#F62A54" />
              <Text style={styles.spendingText}>Teeth Whitening Kit</Text>
              <Text style={styles.spendingAmount}>-7 credits</Text>
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
      
      {/* Badge Popup */}
      <BadgePopup
        visible={showBadgePopup}
        onClose={() => setShowBadgePopup(false)}
      />

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
    </View>
  );
}

function getTierColors(tierKey: string): [string, string] {
  switch (tierKey) {
    case 'platinum': return ['#E5E4E2', '#B4B4B4'];
    case 'gold': return ['#FFD700', '#FFA500'];
    case 'silver': return ['#C0C0C0', '#A8A8A8'];
    default: return ['#CD7F32', '#B8860B'];
  }
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
  tierStatus: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  tierLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tierDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(246, 42, 84, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeInfoText: {
    fontSize: 14,
    color: '#F62A54',
    fontWeight: '600',
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
  spendingSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  spendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  spendingText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  spendingAmount: {
    fontSize: 14,
    color: '#F62A54',
    fontWeight: '600',
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
  // Tier track styles
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
  trackCreditsText: { 
    color: '#fff', 
    fontSize: 12 
  },
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
  nodeTitleLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  tierIcon: { 
    width: 20, 
    height: 20, 
    borderRadius: 4 
  },
  tierIconPlaceholder: { 
    width: 20, 
    height: 20, 
    borderRadius: 4, 
    backgroundColor: 'rgba(255,255,255,0.08)' 
  },
  nodeTitle: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,200,0,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { 
    color: '#0f0', 
    fontSize: 10, 
    fontWeight: '700' 
  },
  nodeSubtitle: { 
    color: 'rgba(255,255,255,0.7)', 
    marginTop: 4, 
    fontSize: 12 
  },
  thresholdRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginTop: 8 
  },
  thresholdText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 12 
  },
  // Modal styles
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
  // Daily claim styles
  dailyClaimSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});


