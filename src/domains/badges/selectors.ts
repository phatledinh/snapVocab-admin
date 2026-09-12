import {
  Badge,
  HonoraryTitle,
  LearnerBadgeRecord,
  BadgeFilterState,
  BadgesRibbonMetrics,
  BadgeTier,
} from './types';

const TIER_WEIGHT: Record<BadgeTier, number> = {
  diamond: 5,
  platinum: 4,
  gold: 3,
  silver: 2,
  bronze: 1,
};

/**
 * Tính toán số liệu thống kê cho thanh Top Ribbon
 */
export function computeBadgesRibbonMetrics(
  badges: Badge[],
  titles: HonoraryTitle[],
  records: LearnerBadgeRecord[]
): BadgesRibbonMetrics {
  const totalBadges = badges.length;
  const activeBadgesCount = badges.filter((b) => b.status === 'active').length;
  const secretBadgesCount = badges.filter((b) => b.status === 'secret' || b.isSecret).length;
  const archivedBadgesCount = badges.filter((b) => b.status === 'archived').length;

  const totalTitles = titles.length;
  const activeWearersCount = titles.reduce((acc, t) => acc + (t.totalEquipped || 0), 0);
  const avgEquipRate =
    titles.length > 0
      ? Math.round((titles.reduce((acc, t) => acc + (t.equipRate || 0), 0) / titles.length) * 10) / 10
      : 0;

  // Giả lập velocity 24h từ lượng active records và hệ số quy mô
  const validRecordsCount = records.filter((r) => r.status === 'valid').length;
  const unlocksVelocity24h = 1680 + validRecordsCount * 25;
  const unlocksVelocityTrend = 14.2;

  // Huy hiệu hiếm nhất (tỷ lệ mở khóa thấp nhất > 0)
  const nonZeroBadges = badges.filter((b) => b.unlockRate > 0);
  const rarestBadge = nonZeroBadges.reduce(
    (min, b) => (b.unlockRate < min.unlockRate ? b : min),
    nonZeroBadges[0] || { name: 'Chưa có', unlockRate: 0 }
  );

  // Tổng tiền tệ faucet qua huy hiệu
  const totalCoinsMinted = badges.reduce(
    (sum, b) => sum + (b.reward.coins || 0) * (b.totalEarners || 0),
    0
  );
  const totalGemsMinted = badges.reduce(
    (sum, b) => sum + (b.reward.gems || 0) * (b.totalEarners || 0),
    0
  );

  return {
    totalBadges,
    activeBadgesCount,
    secretBadgesCount,
    archivedBadgesCount,
    totalTitles,
    activeWearersCount,
    avgEquipRate,
    unlocksVelocity24h,
    unlocksVelocityTrend,
    rarestBadgeName: rarestBadge.name,
    rarestBadgeRate: rarestBadge.unlockRate,
    totalCoinsMinted,
    totalGemsMinted,
  };
}

/**
 * Lọc và sắp xếp danh sách huy hiệu theo bộ lọc đa tầng
 */
export function filterAndSortBadges(
  badges: Badge[],
  filter: BadgeFilterState
): Badge[] {
  return badges
    .filter((b) => {
      // 1. Search query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const matchName = b.name.toLowerCase().includes(q);
        const matchCode = b.code.toLowerCase().includes(q);
        const matchDesc = b.description.toLowerCase().includes(q);
        const matchTarget = b.targetUnit.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc && !matchTarget) return false;
      }

      // 2. Category
      if (filter.category !== 'ALL' && b.category !== filter.category) {
        return false;
      }

      // 3. Tier
      if (filter.tier !== 'ALL' && b.tier !== filter.tier) {
        return false;
      }

      // 4. Status
      if (filter.status !== 'ALL') {
        if (filter.status === 'secret') {
          if (!b.isSecret && b.status !== 'secret') return false;
        } else if (b.status !== filter.status) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filter.sortBy) {
        case 'tier':
          return TIER_WEIGHT[b.tier] - TIER_WEIGHT[a.tier];
        case 'earners':
          return b.totalEarners - a.totalEarners;
        case 'unlockRate':
          return a.unlockRate - b.unlockRate; // Hiếm nhất lên trước
        case 'newest':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'vi');
      }
    });
}

/**
 * Lọc danh hiệu theo từ khóa và bậc độ hiếm
 */
export function filterAndSortTitles(
  titles: HonoraryTitle[],
  query: string,
  rarity: 'ALL' | BadgeTier
): HonoraryTitle[] {
  return titles
    .filter((t) => {
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchName = t.name.toLowerCase().includes(q);
        const matchCode = t.code.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc) return false;
      }
      if (rarity !== 'ALL' && t.rarity !== rarity) {
        return false;
      }
      return true;
    })
    .sort((a, b) => TIER_WEIGHT[b.rarity] - TIER_WEIGHT[a.rarity]);
}
