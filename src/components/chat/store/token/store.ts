
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createTokenActions } from './actions';
import { TokenState } from './types';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

// Initial token state
const initialState: TokenState = {
  balance: 0,
  enforcementMode: 'never' as TokenEnforcementMode,
  lastUpdated: null,
  tokensPerQuery: 1,
  freeQueryLimit: 5,
  queriesUsed: 0,
  isEnforcementEnabled: false
};

// Token store type
export type TokenStore = TokenState & ReturnType<typeof createTokenActions>;

// Create the token store
export const useTokenStore = create<TokenStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createTokenActions(set, get),
    }),
    {
      name: 'TokenStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
