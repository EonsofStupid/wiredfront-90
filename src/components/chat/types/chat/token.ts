
import { TokenEnforcementMode } from '@/types/enums';

/**
 * Token state interface for the component level
 */
export interface TokenState {
  balance: number;
  limit: number;
  used: number;
  usagePercent: number;
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  usageHistory: TokenHistoryItem[];
  lastUpdated: string;
}

/**
 * Token history item interface
 */
export interface TokenHistoryItem {
  date: string;
  usage: number;
  provider?: string;
  feature?: string;
}

/**
 * Token enforcement settings
 */
export interface TokenEnforcementSettings {
  mode: TokenEnforcementMode;
  enabled: boolean;
  warningThreshold: number;
  blockingThreshold: number;
}
