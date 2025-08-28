import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTikTokCredits } from '../contexts/TikTokCreditContext';

const { width } = Dimensions.get('window');

interface DailyCreditPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function DailyCreditPopup({ visible, onClose }: DailyCreditPopupProps) {
  const { canClaimDaily, claimDailyCredit, credits } = useTikTokCredits();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
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

  const handleClaim = () => {
    if (canClaimDaily) {
      claimDailyCredit();
      onClose();
    }
  };

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
              <View style={styles.iconContainer}>
                <Ionicons name="gift" size={40} color="#fff" />
              </View>
              
              <Text style={styles.title}>Daily Reward!</Text>
              <Text style={styles.subtitle}>
                Claim your free TikTok credit
              </Text>
              
              <View style={styles.creditDisplay}>
                <Text style={styles.creditAmount}>+1</Text>
                <Text style={styles.creditLabel}>TikTok Credit</Text>
              </View>
              
              <Text style={styles.currentCredits}>
                You have {credits} credits total
              </Text>
              
              <Pressable
                style={[styles.claimButton, !canClaimDaily && styles.disabledButton]}
                onPress={handleClaim}
                disabled={!canClaimDaily}
              >
                <Text style={styles.claimButtonText}>
                  {canClaimDaily ? 'Claim Now!' : 'Already Claimed Today'}
                </Text>
              </Pressable>
              
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
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
    width: width * 0.85,
    maxWidth: 320,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 3,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(40, 215, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 20,
  },
  creditDisplay: {
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
  currentCredits: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  claimButton: {
    backgroundColor: '#F62A54',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});
