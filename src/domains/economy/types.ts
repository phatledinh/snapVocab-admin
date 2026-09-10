export interface CurrencyFlow {
  faucet: number; // Tiền phát hành (Earned qua bài học, streak, missions)
  sink: number;   // Tiền tiêu thụ (Shop, Streak Freeze, Chests)
}

export interface LiveOpsEconomyState {
  coins: CurrencyFlow;
  gems: CurrencyFlow;
  guardrails: {
    maxCoinsCapPerQuest: number;
    maxGemsCapPerQuest: number;
    violationsDetected: number;
    status: 'healthy' | 'warning' | 'breached';
  };
  streakMetrics: {
    avgStreakDays: number;
    activeStreakLearners: number;
    streaksOver7Days: number;
    streaksOver30Days: number;
    pendingRecoveryRequests: number;
  };
}
