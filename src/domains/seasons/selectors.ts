import {
  Season,
  LeagueConfig,
  SeasonTierRewardMatrix,
  LeaderboardStandingEntry,
  AnomalyViolation,
  SeasonsRibbonMetrics,
  EconomicForecast,
  LeagueTierId,
} from './types';

/**
 * Tính toán thời gian còn lại đến Chủ Nhật 23:59:59 GMT+7
 */
export function calculateWeeklyCountdown(targetEndDateStr?: string): string {
  const now = new Date();
  // Chuyển sang GMT+7
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nowGmt7 = new Date(utc + 3600000 * 7);

  let targetDate: Date;
  if (targetEndDateStr) {
    targetDate = new Date(targetEndDateStr);
  } else {
    // Tìm Chủ Nhật tuần hiện tại
    const dayOfWeek = nowGmt7.getDay(); // 0 = Sunday, 1 = Monday
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    targetDate = new Date(nowGmt7);
    targetDate.setDate(nowGmt7.getDate() + daysUntilSunday);
    targetDate.setHours(23, 59, 59, 999);
  }

  const diffMs = targetDate.getTime() - nowGmt7.getTime();
  if (diffMs <= 0) {
    return '00:00:00 (Đã kết thúc)';
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days} ngày ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Tính toán chỉ số tổng hợp Top Ribbon Metrics
 */
export function computeSeasonsRibbonMetrics(
  seasons: Season[],
  standings: LeaderboardStandingEntry[],
  anomalies: AnomalyViolation[],
  rewardMatrices: SeasonTierRewardMatrix[]
): SeasonsRibbonMetrics {
  const activeSeason = seasons.find((s) => s.status === 'active') || seasons[0];

  // Tính tỷ lệ bám đuổi thăng hạng (% người đứng thứ 6-10 chỉ cách Top 5 dưới 150 XP)
  const rank5Xp = standings.find((s) => s.rank === 5)?.weeklyXp || 1400;
  const chasingLearners = standings.filter(
    (s) => s.rank > 5 && s.rank <= 12 && rank5Xp - s.weeklyXp <= 150
  );
  const promotionContentionRate = Math.round((chasingLearners.length / 7) * 100);

  const pendingAnomalyCount = anomalies.filter(
    (a) => a.status === 'pending_review'
  ).length;

  // Dự phóng kinh tế tổng giải đấu
  const forecast = computeEconomicForecast(
    activeSeason ? activeSeason.totalCohorts : 494,
    rewardMatrices
  );

  return {
    activeSeasonName: activeSeason ? activeSeason.name : 'Mùa Giải Tuần',
    activeSeasonCode: activeSeason ? activeSeason.code : 'SEASON_W37',
    activeSeasonStatus: activeSeason ? activeSeason.status : 'active',
    timeRemainingFormatted: calculateWeeklyCountdown(activeSeason?.endDate),
    totalActiveParticipants: activeSeason ? activeSeason.totalParticipants : 14820,
    totalActiveCohorts: activeSeason ? activeSeason.totalCohorts : 494,
    promotionContentionRate: promotionContentionRate || 71,
    pendingAnomalyCount,
    totalCoinsProjected: forecast.totalEstimatedCoins,
    totalGemsProjected: forecast.totalEstimatedGems,
  };
}

/**
 * Tính toán dự phóng dòng tiền Faucet của Mùa giải & kiểm tra LiveOps Guardrails
 */
export function computeEconomicForecast(
  totalCohorts: number,
  rewardMatrices: SeasonTierRewardMatrix[]
): EconomicForecast {
  // Lấy ma trận phần thưởng Diamond làm đại diện trần cao nhất
  const diamondReward = rewardMatrices.find((r) => r.leagueId === 'diamond');
  const top1Coins = diamondReward?.top1Reward.coins || 500;
  const top1Gems = diamondReward?.top1Reward.gems || 50;

  // Trung bình mỗi cohort phát khoảng:
  // Top 1: 300 coins, Top 2-3: 400 coins, Top 4-5: 200 coins, Safe (15 người): 600 coins = ~1,500 coins / cohort
  const avgCoinsPerCohort = 1450;
  const avgGemsPerCohort = 85;

  const totalEstimatedCoins = totalCohorts * avgCoinsPerCohort;
  const totalEstimatedGems = totalCohorts * avgGemsPerCohort;

  const guardrailLimitCoins = 1000; // design.md §7.3
  const guardrailLimitGems = 100;

  const isWithinGuardrails =
    top1Coins <= guardrailLimitCoins && top1Gems <= guardrailLimitGems;

  return {
    totalEstimatedCoins,
    totalEstimatedGems,
    top1PayoutCoins: top1Coins,
    promotionPayoutCoins: (diamondReward?.top4_5Reward.coins || 200) * 2,
    safePayoutCoins: (diamondReward?.safeZoneReward.coins || 80) * 15,
    isWithinGuardrails,
    guardrailLimitCoins,
    guardrailLimitGems,
  };
}

/**
 * Lọc và sắp xếp danh sách Mùa giải
 */
export function filterAndSortSeasons(
  seasons: Season[],
  searchQuery: string,
  statusFilter: string
): Season[] {
  return seasons.filter((season) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      season.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      season.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      season.theme.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || season.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

/**
 * Lọc và sắp xếp bảng xếp hạng Live Standings
 */
export function filterAndSortStandings(
  standings: LeaderboardStandingEntry[],
  searchQuery: string,
  statusFilter: string
): LeaderboardStandingEntry[] {
  return standings
    .filter((entry) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        entry.learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.cohortId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'flagged' ? !!entry.anomalyFlag : entry.status === statusFilter);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.rank - b.rank);
}
