import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BadgePopupProps {
  visible: boolean;
  onClose: () => void;
}

// Creator Tiers with commission splits
const CREATOR_TIERS = [
  { 
    key: 'certified', 
    label: 'Certified Creator', 
    threshold: 100, 
    split: '60% creator / 40% TikTok',
    color: '#4CAF50',
    emoji: '🌟'
  },
  { 
    key: 'bronze', 
    label: 'Bronze Badge', 
    threshold: 500, 
    split: '60% creator / 40% TikTok',
    color: '#CD7F32',
    emoji: '🥉'
  },
  { 
    key: 'silver', 
    label: 'Silver Badge', 
    threshold: 1500, 
    split: '70% creator / 30% TikTok',
    color: '#C0C0C0',
    emoji: '🥈'
  },
  { 
    key: 'gold', 
    label: 'Gold Badge', 
    threshold: 3500, 
    split: '85% creator / 0% TikTok',
    color: '#FFD700',
    emoji: '🥇'
  },
];

// Consumer Tiers with benefits
const CONSUMER_TIERS = [
  { 
    key: 'basic', 
    label: 'Basic User', 
    threshold: 0, 
    benefits: ['Basic features'],
    color: '#9E9E9E',
    emoji: '👤'
  },
  { 
    key: 'bronze', 
    label: 'Bronze Badge', 
    threshold: 100, 
    benefits: ['Premium content', 'Ad-free'],
    color: '#CD7F32',
    emoji: '🥉'
  },
  { 
    key: 'silver', 
    label: 'Silver Badge', 
    threshold: 500, 
    benefits: ['Exclusive content', 'Priority support'],
    color: '#C0C0C0',
    emoji: '🥈'
  },
  { 
    key: 'gold', 
    label: 'Gold Badge', 
    threshold: 1000, 
    benefits: ['VIP features', 'Early access'],
    color: '#FFD700',
    emoji: '🥇'
  },
];

// Cool items to buy with credits
const COOL_ITEMS = [
  { id: '1', emoji: '🚀', name: 'Rocket Boost', price: 10, description: 'Boost your content visibility' },
  { id: '2', emoji: '💎', name: 'Diamond Filter', price: 10, description: 'Premium video filter' },
  { id: '3', emoji: '🎭', name: 'Theater Mode', price: 10, description: 'Cinematic viewing experience' },
  { id: '4', emoji: '🌈', name: 'Rainbow Effect', price: 10, description: 'Colorful video enhancement' },
  { id: '5', emoji: '⚡', name: 'Lightning Speed', price: 10, description: 'Faster video processing' },
  { id: '6', emoji: '🎪', name: 'Circus Theme', price: 10, description: 'Fun circus-style effects' },
];

export default function BadgePopup({ visible, onClose }: BadgePopupProps) {
  const [selectedTab, setSelectedTab] = useState<'creator' | 'consumer' | 'shop' | 'guide'>('creator');
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const renderCreatorChart = () => (
    <View style={styles.chartSection}>
      <Text style={styles.chartTitle}>🎬 Creator Badge Tiers</Text>
      <Text style={styles.chartSubtitle}>Earn credits to unlock lower commission rates</Text>
      
      {CREATOR_TIERS.map((tier, index) => (
        <View key={tier.key} style={styles.tierRow}>
          <View style={styles.tierEmoji}>
            <Text style={styles.emojiText}>{tier.emoji}</Text>
          </View>
          <View style={styles.tierInfo}>
            <Text style={styles.tierName}>{tier.label}</Text>
            <Text style={styles.tierThreshold}>{tier.threshold.toLocaleString()} credits</Text>
          </View>
          <View style={styles.tierSplit}>
            <Text style={styles.splitText}>{tier.split}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderConsumerChart = () => (
    <View style={styles.chartSection}>
      <Text style={styles.chartTitle}>👥 Consumer Badge Tiers</Text>
      <Text style={styles.chartSubtitle}>Spend credits to unlock premium features</Text>
      
      {CONSUMER_TIERS.map((tier, index) => (
        <View key={tier.key} style={styles.tierRow}>
          <View style={styles.tierEmoji}>
            <Text style={styles.emojiText}>{tier.emoji}</Text>
          </View>
          <View style={styles.tierInfo}>
            <Text style={styles.tierName}>{tier.label}</Text>
            <Text style={styles.tierThreshold}>{tier.threshold.toLocaleString()} credits</Text>
          </View>
          <View style={styles.tierBenefits}>
            <Text style={styles.benefitsText}>{tier.benefits.join(' • ')}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderShop = () => (
    <View style={styles.shopSection}>
      <Text style={styles.chartTitle}>🛍️ Cool Items Shop</Text>
      <Text style={styles.chartSubtitle}>Buy awesome features with your credits</Text>
      
      <View style={styles.itemsGrid}>
        {COOL_ITEMS.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Buy for {item.price} credits</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.luckyDrawSection}>
        <Text style={styles.luckyDrawTitle}>🎫 Lucky Draw Tickets</Text>
        <Text style={styles.luckyDrawSubtitle}>Bet on today's top influencer</Text>
        
        <View style={styles.ticketRow}>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketEmoji}>🎯</Text>
            <Text style={styles.ticketName}>Daily Bet</Text>
            <Text style={styles.ticketPrice}>10 credits</Text>
            </View>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketEmoji}>🎲</Text>
            <Text style={styles.ticketName}>Weekly Jackpot</Text>
            <Text style={styles.ticketPrice}>50 credits</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderGuide = () => (
    <View style={styles.guideSection}>
      <Text style={styles.chartTitle}>📚 Badge Progression Guide</Text>
      <Text style={styles.chartSubtitle}>How to unlock badges and maximize rewards</Text>
      
      {/* Creator Progression Path */}
      <View style={styles.progressionPath}>
        <Text style={styles.pathTitle}>🎬 Creator Path</Text>
        <Text style={styles.pathSubtitle}>Earn credits through content creation</Text>
        
        <View style={styles.pathSteps}>
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Start Creating</Text>
              <Text style={styles.stepDescription}>Post your first video and earn initial credits</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Reach 100 Credits</Text>
              <Text style={styles.stepDescription}>Become a Certified Creator with 60/40 split</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Hit 500 Credits</Text>
              <Text style={styles.stepDescription}>Unlock Bronze Badge - maintain 60/40 split</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Reach 1,500 Credits</Text>
              <Text style={styles.stepDescription}>Earn Silver Badge with 70/30 split</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Achieve 3,500 Credits</Text>
              <Text style={styles.stepDescription}>Get Gold Badge with 85/0 split (no TikTok fee!)</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Consumer Progression Path */}
      <View style={styles.progressionPath}>
        <Text style={styles.pathTitle}>👥 Consumer Path</Text>
        <Text style={styles.pathSubtitle}>Spend credits to unlock premium features</Text>
        
        <View style={styles.pathSteps}>
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Daily Claims</Text>
              <Text style={styles.stepDescription}>Claim 1 free credit every day</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Reach 100 Credits</Text>
              <Text style={styles.stepDescription}>Unlock Bronze Badge for premium content</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Hit 500 Credits</Text>
              <Text style={styles.stepDescription}>Get Silver Badge with exclusive features</Text>
            </View>
          </View>
          
          <View style={styles.pathStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Achieve 1,000 Credits</Text>
              <Text style={styles.stepDescription}>Earn Gold Badge for VIP experience</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
        <Text style={styles.tipText}>• Post consistently to earn more credits</Text>
        <Text style={styles.tipText}>• Engage with your audience for better reach</Text>
        <Text style={styles.tipText}>• Use trending hashtags to boost visibility</Text>
        <Text style={styles.tipText}>• Higher badges = better commission rates</Text>
        <Text style={styles.tipText}>• Daily credit claims add up over time</Text>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['#28D7F6', '#F62A54']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>🏆 Badge System</Text>
                <Text style={styles.subtitle}>Unlock tiers and earn rewards</Text>
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>
              </View>

              {/* Navigation Tabs */}
              <View style={styles.tabContainer}>
                <Pressable
                  style={[styles.tab, selectedTab === 'creator' && styles.activeTab]}
                  onPress={() => setSelectedTab('creator')}
                >
                  <Text style={[styles.tabText, selectedTab === 'creator' && styles.activeTabText]}>
                    🎬 Creator
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, selectedTab === 'consumer' && styles.activeTab]}
                  onPress={() => setSelectedTab('consumer')}
                >
                  <Text style={[styles.tabText, selectedTab === 'consumer' && styles.activeTabText]}>
                    👥 Consumer
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, selectedTab === 'shop' && styles.activeTab]}
                  onPress={() => setSelectedTab('shop')}
                >
                  <Text style={[styles.tabText, selectedTab === 'shop' && styles.activeTabText]}>
                    🛍️ Shop
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, selectedTab === 'guide' && styles.activeTab]}
                  onPress={() => setSelectedTab('guide')}
                >
                  <Text style={[styles.tabText, selectedTab === 'guide' && styles.activeTabText]}>
                    📚 Guide
                  </Text>
                </Pressable>
              </View>

              {/* Content */}
              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {selectedTab === 'creator' && renderCreatorChart()}
                {selectedTab === 'consumer' && renderConsumerChart()}
                {selectedTab === 'shop' && renderShop()}
                {selectedTab === 'guide' && renderGuide()}
              </ScrollView>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 3,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  chartSection: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tierEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiText: {
    fontSize: 24,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  tierThreshold: {
    fontSize: 14,
    color: '#F62A54',
    fontWeight: '600',
  },
  tierSplit: {
    alignItems: 'flex-end',
  },
  splitText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '500',
  },
  tierBenefits: {
    alignItems: 'flex-end',
  },
  benefitsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    maxWidth: 120,
  },
  shopSection: {
    marginBottom: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 100) / 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  priceTag: {
    backgroundColor: '#F62A54',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  luckyDrawSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  luckyDrawTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  luckyDrawSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  ticketRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ticketCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ticketEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  ticketName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  ticketPrice: {
    fontSize: 12,
    color: '#F62A54',
    fontWeight: '600',
  },
  guideSection: {
    marginBottom: 20,
  },
  progressionPath: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  pathSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  pathSteps: {
    gap: 16,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F62A54',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
