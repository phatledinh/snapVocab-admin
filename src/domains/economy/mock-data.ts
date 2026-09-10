import { LiveOpsEconomyState } from './types';

export const MOCK_ECONOMY_STATE: LiveOpsEconomyState = {
  coins: {
    faucet: 1284500, // 1.28M Coins earned
    sink: 892100,    // 892k Coins spent
  },
  gems: {
    faucet: 42500,   // 42.5k Gems earned
    sink: 31200,     // 31.2k Gems spent
  },
  guardrails: {
    maxCoinsCapPerQuest: 1000,
    maxGemsCapPerQuest: 100,
    violationsDetected: 0,
    status: 'healthy',
  },
  streakMetrics: {
    avgStreakDays: 6.8,
    activeStreakLearners: 9420,
    streaksOver7Days: 4120,
    streaksOver30Days: 840,
    pendingRecoveryRequests: 2,
  },
};
