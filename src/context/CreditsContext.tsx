import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type CreditsContextValue = {
  credits: number;
  addCredits: (amount: number) => void;
  resetCredits: () => void;
};

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number>(0);

  const value = useMemo<CreditsContextValue>(() => ({
    credits,
    addCredits: (amount: number) => setCredits(prev => prev + amount),
    resetCredits: () => setCredits(0)
  }), [credits]);

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits(): CreditsContextValue {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider');
  return ctx;
}


