import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TikTokCreditContextType {
  credits: number;
  lastClaimDate: string | null;
  canClaimDaily: boolean;
  claimDailyCredit: () => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => void;
}

const TikTokCreditContext = createContext<TikTokCreditContextType | undefined>(undefined);

export const useTikTokCredits = () => {
  const context = useContext(TikTokCreditContext);
  if (!context) {
    throw new Error('useTikTokCredits must be used within a TikTokCreditProvider');
  }
  return context;
};

export const TikTokCreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const savedCredits = await AsyncStorage.getItem('tiktok_credits');
      const savedDate = await AsyncStorage.getItem('tiktok_last_claim');
      
      if (savedCredits) {
        setCredits(parseInt(savedCredits));
      }
      if (savedDate) {
        setLastClaimDate(savedDate);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  };

  const saveCredits = async (newCredits: number) => {
    try {
      await AsyncStorage.setItem('tiktok_credits', newCredits.toString());
    } catch (error) {
      console.error('Error saving credits:', error);
    }
  };

  const saveClaimDate = async (date: string) => {
    try {
      await AsyncStorage.setItem('tiktok_last_claim', date);
    } catch (error) {
      console.error('Error saving claim date:', error);
    }
  };

  const canClaimDaily = () => {
    if (!lastClaimDate) return true;
    
    const lastClaim = new Date(lastClaimDate);
    const today = new Date();
    
    return lastClaim.getDate() !== today.getDate() || 
           lastClaim.getMonth() !== today.getMonth() || 
           lastClaim.getFullYear() !== today.getFullYear();
  };

  const claimDailyCredit = () => {
    if (canClaimDaily()) {
      const newCredits = credits + 1;
      const today = new Date().toISOString().split('T')[0];
      
      setCredits(newCredits);
      setLastClaimDate(today);
      saveCredits(newCredits);
      saveClaimDate(today);
    }
  };

  const addCredits = (amount: number) => {
    const newCredits = credits + amount;
    setCredits(newCredits);
    saveCredits(newCredits);
  };

  const spendCredits = (amount: number) => {
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      saveCredits(newCredits);
      return true;
    }
    return false;
  };

  const value: TikTokCreditContextType = useMemo(() => ({
    credits,
    lastClaimDate,
    canClaimDaily: canClaimDaily(),
    claimDailyCredit,
    addCredits,
    spendCredits,
  }), [credits, lastClaimDate]);

  return (
    <TikTokCreditContext.Provider value={value}>
      {children}
    </TikTokCreditContext.Provider>
  );
};
