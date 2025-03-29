
import { useTokenStore } from '@/stores/token';
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Adapter class that forwards token actions to the main token store
 * This ensures backwards compatibility with code using the chat-specific token actions
 */
export const useTokenActions = () => {
  const tokenStore = useTokenStore();
  
  return {
    addTokens: tokenStore.addTokens,
    spendTokens: tokenStore.spendTokens,
    setTokens: tokenStore.setTokenBalance,
    setTokenBalance: tokenStore.setTokenBalance,
    setEnforcementMode: tokenStore.setEnforcementMode,
    setEnforcementEnabled: tokenStore.setEnforcementEnabled,
    initialize: tokenStore.initialize,
    fetchTokenData: tokenStore.fetchTokenData,
    resetTokens: tokenStore.resetTokens,
    resetQueriesUsed: tokenStore.resetQueriesUsed,
    updateTokenSettings: tokenStore.updateTokenSettings,
    setWarningThreshold: tokenStore.setWarningThreshold,
    setResetDate: tokenStore.setResetDate,
    setBalance: tokenStore.setBalance
  };
};

// Re-export token enforcement mode for legacy compatibility
export { TokenEnforcementMode };
