
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/components/chat/types/chat/enums';

interface TokenState {
  // Token balance and limits
  balance: number;
  limit: number;
  usagePercent: number;
  
  // Enforcement settings
  enforcementMode: TokenEnforcementMode;
  enforcementSettings: Record<string, any>;
  
  // Usage tracking
  usageHistory: {
    date: string;
    usage: number;
  }[];
  lastUpdated: string;
  
  // Actions
  setBalance: (balance: number) => void;
  setLimit: (limit: number) => void;
  addTokens: (amount: number) => void;
  deductTokens: (amount: number) => void;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setEnforcementSettings: (settings: Record<string, any>) => void;
  resetUsage: () => void;
}

export const useTokenStore = create<TokenState>()(
  devtools(
    (set, get) => ({
      // Initial state
      balance: 1000, // Default starting balance
      limit: 2000,   // Default token limit
      usagePercent: 0,
      enforcementMode: TokenEnforcementMode.Warn,
      enforcementSettings: {},
      usageHistory: [],
      lastUpdated: new Date().toISOString(),
      
      // Actions
      setBalance: (balance: number) => {
        set({
          balance,
          usagePercent: Math.min(100, Math.round((balance / get().limit) * 100)),
          lastUpdated: new Date().toISOString()
        });
        logger.info('Token balance updated', { balance });
      },
      
      setLimit: (limit: number) => {
        set({
          limit,
          usagePercent: Math.min(100, Math.round((get().balance / limit) * 100)),
          lastUpdated: new Date().toISOString()
        });
        logger.info('Token limit updated', { limit });
      },
      
      addTokens: (amount: number) => {
        const balance = get().balance + amount;
        const limit = get().limit;
        
        set({
          balance,
          usagePercent: Math.min(100, Math.round((balance / limit) * 100)),
          lastUpdated: new Date().toISOString(),
          usageHistory: [
            ...get().usageHistory,
            { date: new Date().toISOString(), usage: -amount }
          ]
        });
        
        logger.info('Tokens added', { amount, newBalance: balance });
      },
      
      deductTokens: (amount: number) => {
        const balance = Math.max(0, get().balance - amount);
        const limit = get().limit;
        
        set({
          balance,
          usagePercent: Math.min(100, Math.round((balance / limit) * 100)),
          lastUpdated: new Date().toISOString(),
          usageHistory: [
            ...get().usageHistory,
            { date: new Date().toISOString(), usage: amount }
          ]
        });
        
        logger.info('Tokens deducted', { amount, newBalance: balance });
      },
      
      setEnforcementMode: (mode: TokenEnforcementMode) => {
        set({ enforcementMode: mode });
        logger.info('Token enforcement mode updated', { mode });
      },
      
      setEnforcementSettings: (settings: Record<string, any>) => {
        set({ enforcementSettings: settings });
        logger.info('Token enforcement settings updated', { settings });
      },
      
      resetUsage: () => {
        set({
          usageHistory: [],
          lastUpdated: new Date().toISOString()
        });
        logger.info('Token usage history reset');
      }
    }),
    {
      name: 'TokenStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

export default useTokenStore;
