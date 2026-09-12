// ====================================================
// SNAPVOCAB LEARNERS SELECTORS & BUSINESS COMPUTATIONS
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

import {
  LearnerProfile,
  StreakRecoveryRequest,
  LearnerFilterState,
  LearnersRibbonMetrics,
  CEFRLevel,
} from './types';

/**
 * Tính toán 4 cụm chỉ số trên thanh LearnersMetricsRibbon
 */
export function computeLearnersRibbonMetrics(
  learners: LearnerProfile[],
  streakRequests: StreakRecoveryRequest[]
): LearnersRibbonMetrics {
  const total = learners.length;
  if (total === 0) {
    return {
      totalLearners: 0,
      activeLearnersToday: 0,
      dauPercentage: 0,
      activeStreaksCount: 0,
      avgStreakDays: 0,
      streakRiskCount: 0,
      totalCardsMastered: 0,
      avgRetentionRate: 0,
      pendingStreakAppeals: 0,
      suspendedAccountsCount: 0,
    };
  }

  // Hôm nay được mock là 2026-09-11
  const todayStr = '2026-09-11';
  const activeTodayCount = learners.filter(
    (l) => l.lastActiveAt.startsWith(todayStr) || l.streak.lastActiveDate === todayStr
  ).length;

  const activeStreaks = learners.filter((l) => l.streak.currentStreak > 0);
  const totalStreakDays = activeStreaks.reduce(
    (acc, l) => acc + l.streak.currentStreak,
    0
  );
  const avgStreak =
    activeStreaks.length > 0
      ? Math.round((totalStreakDays / activeStreaks.length) * 10) / 10
      : 0;

  const streakRiskCount = learners.filter((l) => l.streak.isAtRisk).length;

  const totalCardsMastered = learners.reduce(
    (acc, l) => acc + l.fsrs.cardsMastered,
    0
  );

  const learnersWithRetention = learners.filter((l) => l.fsrs.retentionRate > 0);
  const totalRetention = learnersWithRetention.reduce(
    (acc, l) => acc + l.fsrs.retentionRate,
    0
  );
  const avgRetentionRate =
    learnersWithRetention.length > 0
      ? Math.round((totalRetention / learnersWithRetention.length) * 10) / 10
      : 0;

  const pendingStreakAppeals = streakRequests.filter(
    (r) => r.status === 'pending'
  ).length;

  const suspendedAccountsCount = learners.filter(
    (l) => l.status === 'suspended'
  ).length;

  return {
    totalLearners: total,
    activeLearnersToday: activeTodayCount,
    dauPercentage: Math.round((activeTodayCount / total) * 100),
    activeStreaksCount: activeStreaks.length,
    avgStreakDays: avgStreak,
    streakRiskCount,
    totalCardsMastered,
    avgRetentionRate,
    pendingStreakAppeals,
    suspendedAccountsCount,
  };
}

/**
 * Bộ lọc đa tầng kết hợp tìm kiếm & sắp xếp cho bảng dữ liệu học viên
 */
export function filterLearners(
  learners: LearnerProfile[],
  filter: LearnerFilterState
): LearnerProfile[] {
  return learners
    .filter((learner) => {
      // 1. Tìm kiếm văn bản (Tên, Email, ID)
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchName = learner.fullName.toLowerCase().includes(query);
        const matchEmail = learner.email.toLowerCase().includes(query);
        const matchId = learner.id.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchId) {
          return false;
        }
      }

      // 2. Trạng thái tài khoản
      if (filter.status !== 'ALL' && learner.status !== filter.status) {
        return false;
      }

      // 3. Cấp độ CEFR
      if (filter.cefr !== 'ALL' && learner.cefrLevel !== filter.cefr) {
        return false;
      }

      // 4. Hạng giải đấu League
      if (filter.league !== 'ALL' && learner.economy.league !== filter.league) {
        return false;
      }

      // 5. Cấp độ chuỗi Streak
      if (filter.streakTier !== 'ALL') {
        const streak = learner.streak.currentStreak;
        switch (filter.streakTier) {
          case 'zero':
            if (streak !== 0) return false;
            break;
          case 'active_1_7':
            if (streak < 1 || streak > 7) return false;
            break;
          case 'streak_8_30':
            if (streak < 8 || streak > 30) return false;
            break;
          case 'streak_30_plus':
            if (streak <= 30) return false;
            break;
          case 'at_risk':
            if (!learner.streak.isAtRisk) return false;
            break;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const dir = filter.sortDirection === 'asc' ? 1 : -1;
      switch (filter.sortBy) {
        case 'streak':
          return (a.streak.currentStreak - b.streak.currentStreak) * dir;
        case 'xp':
          return (a.economy.totalXp - b.economy.totalXp) * dir;
        case 'cards':
          return (a.fsrs.cardsMastered - b.fsrs.cardsMastered) * dir;
        case 'name':
          return a.fullName.localeCompare(b.fullName, 'vi') * dir;
        case 'newest':
          return (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir;
        case 'lastActive':
        default:
          return (new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime()) * dir;
      }
    });
}

/**
 * Thống kê phân bổ FSRS toàn hệ thống
 */
export function computeFsrsDistribution(learners: LearnerProfile[]) {
  return learners.reduce(
    (acc, l) => {
      acc.newCards += l.fsrs.cardsNew;
      acc.learning += l.fsrs.cardsLearning;
      acc.review += l.fsrs.cardsReview;
      acc.mastered += l.fsrs.cardsMastered;
      return acc;
    },
    { newCards: 0, learning: 0, review: 0, mastered: 0 }
  );
}

/**
 * Thống kê tỷ lệ retention theo từng cấp độ CEFR
 */
export function computeCefrRetentionBreakdown(learners: LearnerProfile[]) {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return levels.map((lvl) => {
    const list = learners.filter((l) => l.cefrLevel === lvl);
    const count = list.length;
    const avgRetention =
      count > 0
        ? Math.round(
            (list.reduce((acc, l) => acc + l.fsrs.retentionRate, 0) / count) * 10
          ) / 10
        : 0;
    const totalMastered = list.reduce((acc, l) => acc + l.fsrs.cardsMastered, 0);

    return {
      level: lvl,
      count,
      avgRetention,
      totalMastered,
    };
  });
}
