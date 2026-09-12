import {
  Mission,
  MissionViolation,
  MissionsRibbonMetrics,
  MissionFilterState,
  MissionReward,
  MissionGuardrailConfig,
} from './types';

export function computeMissionRibbonMetrics(
  missions: Mission[],
  violations: MissionViolation[]
): MissionsRibbonMetrics {
  const activeMissions = missions.filter((m) => m.status === 'active');
  const activeDaily = activeMissions.filter((m) => m.type === 'daily');
  const activeWeekly = activeMissions.filter((m) => m.type === 'weekly');

  const totalPoolCount = missions.length;
  const activeDailyPoolCount = activeDaily.length;
  const activeWeeklyPoolCount = activeWeekly.length;

  const validRateMissions = activeMissions.filter((m) => m.completionRate > 0);
  const avgCompletionRate =
    validRateMissions.length > 0
      ? Number(
          (
            validRateMissions.reduce((acc, m) => acc + m.completionRate, 0) /
            validRateMissions.length
          ).toFixed(1)
        )
      : 0;

  const avgClaimRate =
    validRateMissions.length > 0
      ? Number(
          (
            validRateMissions.reduce((acc, m) => acc + m.claimRate, 0) /
            validRateMissions.length
          ).toFixed(1)
        )
      : 0;

  const unclaimedRiskRate = Math.max(0, Number((avgCompletionRate - avgClaimRate).toFixed(1)));

  // Ước tính faucet 24h dựa trên claim count
  const faucetCoins24h = activeDaily.reduce(
    (acc, m) => acc + (m.reward.coins || 0) * Math.round(m.totalClaimedCount * 0.25),
    48500
  );

  const faucetGems24h = activeDaily.reduce(
    (acc, m) => acc + (m.reward.gems || 0) * Math.round(m.totalClaimedCount * 0.2),
    340
  );

  const activeViolations = violations.filter((v) => v.status === 'active');
  const activeViolationsCount = activeViolations.length;

  let guardrailStatus: 'healthy' | 'warning' | 'breached' = 'healthy';
  if (activeViolations.some((v) => v.severity === 'high')) {
    guardrailStatus = 'breached';
  } else if (activeViolationsCount > 0) {
    guardrailStatus = 'warning';
  }

  return {
    totalPoolCount,
    activeDailyPoolCount,
    activeWeeklyPoolCount,
    avgCompletionRate,
    avgClaimRate,
    unclaimedRiskRate,
    faucetCoins24h,
    faucetGems24h,
    guardrailStatus,
    activeViolationsCount,
  };
}

export function filterMissions(
  missions: Mission[],
  filters: MissionFilterState
): Mission[] {
  return missions
    .filter((m) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchTitle = m.title.toLowerCase().includes(query);
        const matchCode = m.code.toLowerCase().includes(query);
        const matchDesc = m.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchDesc) return false;
      }

      // 2. Type
      if (filters.type !== 'ALL' && m.type !== filters.type) {
        return false;
      }

      // 3. Action Type
      if (filters.actionType !== 'ALL' && m.actionType !== filters.actionType) {
        return false;
      }

      // 4. Status
      if (filters.status !== 'ALL' && m.status !== filters.status) {
        return false;
      }

      // 5. Difficulty
      if (filters.difficulty !== 'ALL' && m.difficulty !== filters.difficulty) {
        return false;
      }

      // 6. Target Audience
      if (
        filters.targetAudience !== 'ALL' &&
        m.targetAudience !== filters.targetAudience &&
        m.targetAudience !== 'all'
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'weight':
          return b.weight - a.weight;
        case 'completion':
          return b.completionRate - a.completionRate;
        case 'reward':
          return (b.reward.coins || 0) - (a.reward.coins || 0);
        case 'newest':
        default:
          return b.id.localeCompare(a.id);
      }
    });
}

export function validateMissionRewardGuardrails(
  reward: MissionReward,
  config: MissionGuardrailConfig
): {
  isValid: boolean;
  issues: string[];
  isCritical: boolean;
} {
  const issues: string[] = [];
  let isCritical = false;

  if (reward.coins > config.maxCoinsCapPerQuest) {
    issues.push(
      `Phần thưởng ${reward.coins.toLocaleString()} Coins vượt trần an toàn (${config.maxCoinsCapPerQuest.toLocaleString()} Coins).`
    );
    isCritical = true;
  }

  if (reward.gems && reward.gems > config.maxGemsCapPerQuest) {
    issues.push(
      `Phần thưởng ${reward.gems} Gems vượt trần an toàn (${config.maxGemsCapPerQuest} Gems).`
    );
    isCritical = true;
  }

  if (reward.coins <= 0 && (!reward.xp || reward.xp <= 0)) {
    issues.push('Nhiệm vụ cần có ít nhất phần thưởng XP hoặc Coins lớn hơn 0.');
  }

  return {
    isValid: issues.length === 0,
    issues,
    isCritical,
  };
}
