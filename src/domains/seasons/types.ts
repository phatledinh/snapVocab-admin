// ====================================================
// SNAPVOCAB LEADERBOARD SEASONS DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

export type SeasonStatus =
  | 'upcoming'      // Sắp diễn ra (đang cấu hình trước)
  | 'active'        // Đang diễn ra (thu thập XP, realtime ranking)
  | 'settling'      // Đang chốt sổ & kết toán phần thưởng (00:00 - 01:00 Thứ 2)
  | 'completed'     // Đã kết thúc & lưu trữ bảng vinh danh
  | 'frozen';       // Đóng băng khẩn cấp (khi có bug hoặc bảo trì Redis)

export type SeasonCycleType = 'weekly' | 'monthly' | 'special_event';

export type LeagueTierId =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'ruby'
  | 'diamond';

export interface PromotionRule {
  promotionRankMax: number;    // Top 1 -> promotionRankMax (thăng hạng, e.g. 5)
  safeRankMax: number;         // promotionRankMax + 1 -> safeRankMax (giữ hạng, e.g. 20)
  demotionRankMin: number;     // safeRankMax + 1 -> demotionRankMin (rớt hạng, e.g. 21)
  minXpToPromote: number;      // Ngưỡng XP tối thiểu để đủ điều kiện thăng hạng (chống AFK)
}

export interface LeagueConfig {
  id: LeagueTierId;
  name: string;                // e.g. "Kim Cương (Diamond)", "Vàng (Gold)"
  tierOrder: number;           // 1 (Bronze) -> 6 (Diamond)
  icon: string;                // Emoji / asset identifier
  accentColor: string;         // Hex code e.g. "#8B5CF6"
  badgeBgColor: string;        // Tailwind class e.g. "bg-purple-50 text-purple-700 border-purple-200"
  cohortSize: number;          // Chuẩn hóa: 30 học viên / phòng đấu
  promotionRule: PromotionRule;
  canDemote: boolean;          // Bronze = false, Silver -> Diamond = true
  activeLearnersCount: number; // Số học viên hiện tại trong League
  totalCohortsCount: number;   // Số phòng đấu hiện tại
  learnerPercentage: number;   // Tỷ lệ % người học trên toàn hệ thống (Kim tự tháp)
}

export interface SeasonRewardItem {
  coins: number;
  gems: number;
  xpBonus?: number;
  badgeId?: string;
  badgeName?: string;
  titleId?: string;
  titleName?: string;
  exclusiveFrame?: string;
}

export interface SeasonTierRewardMatrix {
  leagueId: LeagueTierId;
  top1Reward: SeasonRewardItem;
  top2_3Reward: SeasonRewardItem;
  top4_5Reward: SeasonRewardItem;      // Vùng thăng hạng
  safeZoneReward: SeasonRewardItem;     // Hạng 6 - 20
  demotionZoneReward: SeasonRewardItem; // Hạng 21 - 30 (quà an ủi)
}

export interface Season {
  id: string;
  code: string;                 // e.g. "SEASON_2026_W37", "SEASON_AUTUMN_2026"
  name: string;                 // "Mùa 37: Snapy Vươn Xa", "Mùa Lễ Hội Mùa Thu"
  description: string;
  cycleType: SeasonCycleType;
  theme: string;                // "Snapy Autumn Blaze", "Cosmic Voyager"
  status: SeasonStatus;
  startDate: string;            // ISO String "2026-09-07T00:00:00+07:00"
  endDate: string;              // ISO String "2026-09-13T23:59:59+07:00"
  timeZone: string;             // "Asia/Ho_Chi_Minh (GMT+7)"
  totalParticipants: number;    // Tổng số người học có XP
  totalCohorts: number;         // Tổng số bảng đấu
  totalXpAccumulated: number;   // Tổng XP cày được
  isFrozen?: boolean;
  freezeReason?: string;
  lastSettledAt?: string;
  auditNotes?: string;
  createdBy: string;
}

export interface LeaderboardLearner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currentStreak: number;
  equippedTitle?: string;
  levelCefr: string;
  isCurrentUser?: boolean;
}

export type StandingMovement = 'up' | 'down' | 'same' | 'new';
export type StandingStatus = 'promotion' | 'safe' | 'demotion' | 'flagged';

export interface LeaderboardStandingEntry {
  id: string;
  rank: number;
  previousRank: number;
  movement: StandingMovement;
  movementDiff: number;        // e.g. +3, -2, 0
  learner: LeaderboardLearner;
  weeklyXp: number;
  leagueId: LeagueTierId;
  cohortId: string;            // e.g. "COHORT-DIA-08"
  status: StandingStatus;
  activityStats: {
    scansCount: number;
    srsReviewsCount: number;
    quizPerfectCount: number;
    lastActiveMinutesAgo: number;
  };
  anomalyFlag?: {
    type: 'velocity_spike' | 'quiz_bot' | 'abnormal_xp';
    detectedAt: string;
    xpSurge: number;
    severity: 'warning' | 'critical';
    details: string;
  };
}

export interface CohortGroup {
  id: string;                  // e.g. "COHORT-DIA-08"
  leagueId: LeagueTierId;
  name: string;                // "Bảng Kim Cương #08"
  seasonId: string;
  totalMembers: number;        // max 30
  averageXp: number;
  top1Xp: number;
  cutoffPromotionXp: number;   // Điểm số của Rank #5
  cutoffDemotionXp: number;    // Điểm số của Rank #25
}

export interface AnomalyViolation {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  cohortId: string;
  leagueId: LeagueTierId;
  detectedAt: string;
  anomalyType: 'velocity_spike' | 'suspicious_script' | 'packet_injection';
  xpDelta: number;
  timeWindowSeconds: number;
  status: 'pending_review' | 'deducted' | 'disqualified' | 'dismissed';
  actionTaken?: string;
  actionBy?: string;
  actionAt?: string;
  auditReason?: string;
}

export type SeasonsTabNavId =
  | 'seasons-schedule'    // Quản lý Mùa giải & Lịch trình
  | 'leagues-tiers'        // Hệ thống Hạng đấu & Phân hạng
  | 'season-rewards'       // Ma trận Phần thưởng & Dự phóng Kinh tế
  | 'standings-anticheat'; // Bảng Xếp Hạng Realtime & Chống Gian Lận

export interface SeasonsRibbonMetrics {
  activeSeasonName: string;
  activeSeasonCode: string;
  activeSeasonStatus: SeasonStatus;
  timeRemainingFormatted: string;
  totalActiveParticipants: number;
  totalActiveCohorts: number;
  promotionContentionRate: number; // % người cách Top 5 < 150 XP
  pendingAnomalyCount: number;
  totalCoinsProjected: number;
  totalGemsProjected: number;
}

export interface EconomicForecast {
  totalEstimatedCoins: number;
  totalEstimatedGems: number;
  top1PayoutCoins: number;
  promotionPayoutCoins: number;
  safePayoutCoins: number;
  isWithinGuardrails: boolean;
  guardrailLimitCoins: number;
  guardrailLimitGems: number;
}
