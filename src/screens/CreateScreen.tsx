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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTikTokCredits } from '../contexts/TikTokCreditContext';
import BadgePopup from '../components/BadgePopup';

const { width } = Dimensions.get('window');

type CreatorEarning = {
  id: string;
  videoTitle: string;
  views: number;
  creditsEarned: number;
  date: string;
  thumbnail: string;
};

type CreatorStats = {
  totalCredits: number;
  monthlyEarnings: number;
  totalViews: number;
  totalVideos: number;
  followers: number;
  engagementRate: number;
};

const MOCK_CREATOR_EARNINGS: CreatorEarning[] = [
  {
    id: '1',
    videoTitle: 'My favourite planet used to be Earth...',
    views: 15420,
    creditsEarned: 23.5,
    date: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop'
  },
  {
    id: '2',
    videoTitle: 'Spill the tea about space travel',
    views: 8920,
    creditsEarned: 15.2,
    date: '2024-01-14',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop'
  },
  {
    id: '3',
    videoTitle: 'Cosmic vibes and TikTok trends',
    views: 12340,
    creditsEarned: 18.7,
    date: '2024-01-13',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop'
  }
];

const MOCK_CREATOR_STATS: CreatorStats = {
  totalCredits: 570, // Updated to 570 credits
  monthlyEarnings: 89.4,
  totalViews: 36680,
  totalVideos: 3,
  followers: 58,
  engagementRate: 4.2
};

// Creator Tiers with revenue splits
const CREATOR_TIERS = [
  { key: 'certified', label: 'Certified', threshold: 100, subtitle: 'Eligible to create', icon: undefined },
  { key: 'bronze', label: 'Bronze', threshold: 500, subtitle: '60% creator / 40% TikTok', icon: undefined },
  { key: 'silver', label: 'Silver', threshold: 1500, subtitle: '70% creator / 30% TikTok', icon: undefined },
  { key: 'gold', label: 'Gold', threshold: 3500, subtitle: '85% creator / 0% TikTok', icon: undefined },
];

type Tier = { key: string; label: string; threshold: number; subtitle: string; icon?: any };

function getCreatorTier(credits: number) {
  let chosen = CREATOR_TIERS[0];
  for (const t of CREATOR_TIERS) {
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

export default function CreateScreen() {
  const { credits } = useTikTokCredits();
  const [selectedTab, setSelectedTab] = useState<'earnings' | 'analytics' | 'content'>('earnings');
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Calculate a shared minimum height so both tracks appear equal length
  const NODE_ROW_EST = 96; // approximate per-tier row height incl. spacing
  const HEADER_EST = 40;   // track header area
  const maxCount = CREATOR_TIERS.length;
  const sharedMinHeight = HEADER_EST + NODE_ROW_EST * maxCount + 24; // padding
  
  // For demo purposes, show 570 credits to demonstrate Bronze tier
  const demoCredits = 570;
  const currentTier = getCreatorTier(demoCredits);

  const tabs = [
    { id: 'earnings', label: 'Earnings', icon: 'diamond' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'content', label: 'Content', icon: 'videocam' },
  ];

  const renderEarningsCard = ({ item }: { item: CreatorEarning }) => (
    <View style={styles.earningsCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.earningsInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.videoTitle}</Text>
        <View style={styles.earningsStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#666" />
            <Text style={styles.statText}>{item.views.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={16} color="#F62A54" />
            <Text style={styles.statText}>{item.creditsEarned.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.earningsDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderAnalyticsSection = () => (
    <View style={styles.analyticsSection}>
      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.metricValue}>{MOCK_CREATOR_STATS.engagementRate}%</Text>
          <Text style={styles.metricLabel}>Engagement Rate</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="people" size={24} color="#2196F3" />
          <Text style={styles.metricValue}>{MOCK_CREATOR_STATS.followers}</Text>
          <Text style={styles.metricLabel}>Followers</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="videocam" size={24} color="#FF9800" />
          <Text style={styles.metricValue}>{MOCK_CREATOR_STATS.totalVideos}</Text>
          <Text style={styles.metricLabel}>Total Videos</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="eye" size={24} color="#9C27B0" />
          <Text style={styles.metricValue}>{MOCK_CREATOR_STATS.totalViews.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Total Views</Text>
        </View>
      </View>
    </View>
  );

  const renderContentSection = () => (
    <View style={styles.contentSection}>
      <Pressable style={styles.createButton}>
        <LinearGradient
          colors={['#28D7F6', '#F62A54']}
          style={styles.createButtonGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
          <Text style={styles.createButtonText}>Create New Video</Text>
        </LinearGradient>
      </Pressable>
      
      <View style={styles.contentTips}>
        <Text style={styles.tipsTitle}>💡 Creator Tips</Text>
        <Text style={styles.tipText}>• Post consistently to earn more credits</Text>
        <Text style={styles.tipText}>• Engage with your audience for better reach</Text>
        <Text style={styles.tipText}>• Use trending hashtags to boost visibility</Text>
        <Text style={styles.tipText}>• Credits are earned based on views and engagement</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <View style={styles.creatorInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
            style={styles.creatorAvatar}
          />
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>pixlaravatar</Text>
            <Text style={styles.creatorHandle}>@pixlaravatar</Text>
          </View>
        </View>
      </View>

      {/* Credit Balance Card */}
      <View style={styles.creditBalanceCard}>
        <LinearGradient
          colors={['#28D7F6', '#F62A54']}
          style={styles.creditGradient}
        >
          <View style={styles.creditHeader}>
            <Ionicons name="diamond" size={24} color="#fff" />
            <Text style={styles.creditTitle}>Creator Credits</Text>
          </View>
          <View style={styles.creditAmounts}>
            <View style={styles.creditAmount}>
              <Text style={styles.creditValue}>{demoCredits}</Text>
              <Text style={styles.creditLabel}>Total Earned</Text>
            </View>
            <View style={styles.creditAmount}>
              <Text style={styles.creditValue}>{MOCK_CREATOR_STATS.monthlyEarnings.toFixed(1)}</Text>
              <Text style={styles.creditLabel}>This Month</Text>
            </View>
          </View>
          
          {/* Creator Tier Status */}
          <View style={styles.tierStatus}>
            <View style={styles.tierBadge}>
              <Text style={styles.tierLabel}>{currentTier.label} Creator</Text>
            </View>
            <Text style={styles.tierSplit}>{currentTier.subtitle}</Text>
            <Text style={styles.tierNote}>
              💰 Revenue split: {currentTier.subtitle}
            </Text>
            
            {/* Badge Info Button */}
            <Pressable 
              style={styles.badgeInfoButton}
              onPress={() => setShowBadgePopup(true)}
            >
              <Ionicons name="information-circle" size={20} color="#fff" />
              <Text style={styles.badgeInfoText}>View All Creator Tiers</Text>
            </Pressable>

            {/* Credits Modal Button */}
            <Pressable 
              style={styles.creditsModalButton}
              onPress={() => setShowCreditsModal(true)}
            >
              <Ionicons name="diamond" size={20} color="#F62A54" />
              <Text style={styles.creditsModalButtonText}>View Credits & Tiers</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedTab === tab.id ? '#fff' : '#666'}
            />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'earnings' && (
          <View style={styles.earningsSection}>
            <Text style={styles.sectionTitle}>Recent Earnings</Text>
            {MOCK_CREATOR_EARNINGS.map((item) => (
              <View key={item.id} style={styles.earningsCard}>
                <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
                <View style={styles.earningsInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>{item.videoTitle}</Text>
                  <View style={styles.earningsStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="eye" size={16} color="#666" />
                      <Text style={styles.statText}>{item.views.toLocaleString()}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="diamond" size={16} color="#F62A54" />
                      <Text style={styles.statText}>{item.creditsEarned.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.earningsDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'analytics' && renderAnalyticsSection()}
        {selectedTab === 'content' && renderContentSection()}
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
              <Text style={styles.modalTitle}>Creator Credits & Tiers</Text>
              <Pressable onPress={() => setShowCreditsModal(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </Pressable>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <View style={styles.totalCreditsBox}>
                <Ionicons name="diamond" size={20} color="#F62A54" />
                <Text style={styles.totalCreditsText}>Total Credits: {demoCredits.toFixed(2)}</Text>
              </View>

              <View style={styles.tracksRow}>
                <TierTrack title="Creator" tiers={CREATOR_TIERS as Tier[]} credits={demoCredits} minHeight={sharedMinHeight} />
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  creatorHandle: {
    fontSize: 14,
    color: '#666',
  },
  creditBalanceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  creditGradient: {
    padding: 20,
  },
  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  creditAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  creditAmount: {
    alignItems: 'center',
  },
  creditValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  creditLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  tierStatus: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  tierSplit: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tierNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  badgeInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeInfoText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F62A54',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  earningsSection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  earningsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  videoThumbnail: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  earningsInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  earningsStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
  },
  earningsDate: {
    color: '#666',
    fontSize: 12,
  },
  analyticsSection: {
    flex: 1,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 52) / 2,
  },
  metricValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  createButton: {
    marginBottom: 40,
  },
  createButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contentTips: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
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
  // Button styles
  creditsModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(246,42,84,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F62A54',
    marginTop: 8,
  },
  creditsModalButtonText: {
    color: '#F62A54',
    fontSize: 14,
    fontWeight: '600',
  },
});


