// ====================================================
// SNAPVOCAB MISSIONS & QUESTS DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

export type MissionType = 'daily' | 'weekly' | 'achievement' | 'special_event';

export type MissionActionType =
  | 'SCAN_OBJECT'       // Quét đồ vật bằng AI Camera (kèm điều kiện lưu từ - F-GAME-11)
  | 'REVIEW_SRS'         // Ôn tập flashcard đến hạn SRS
  | 'LEARN_NEW_WORDS'    // Học từ mới trong Deck/Topic
  | 'QUIZ_PERFECT'       // Hoàn thành Quiz đạt 100%
  | 'MAINTAIN_STREAK'    // Duy trì chuỗi Streak
  | 'EXPLORE_TOPIC'      // Hoàn thành 1 chủ đề từ vựng
  | 'LISTEN_AUDIO';      // Nghe phát âm từ vựng qua TTS/Audio

export type MissionStatus = 'active' | 'draft' | 'scheduled' | 'archived';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export type MissionTargetAudience =
  | 'all'
  | 'new_users'
  | 'intermediate'
  | 'advanced'
  | 'at_risk_streak';

export interface MissionReward {
  xp: number;
  coins: number;
  gems?: number;
  badgeId?: string;
}

export interface Mission {
  id: string;
  code: string;                  // e.g. "MS-D-01", "MS-W-03"
  title: string;
  description: string;
  type: MissionType;
  actionType: MissionActionType;
  targetCount: number;           // Số lượng mục tiêu (e.g. 3 đồ vật, 15 thẻ, 100% quiz)
  unit: string;                  // "từ", "lượt scan", "thẻ SRS", "ngày", "điểm"
  difficulty: MissionDifficulty;
  reward: MissionReward;
  weight: number;                // 1 - 100 (trọng số xuất hiện trong pool)
  status: MissionStatus;
  targetAudience: MissionTargetAudience;
  isBonus?: boolean;             // Nhiệm vụ thưởng thêm (+1 bonus ngoài 5 mandatory)
  validFrom?: string;
  validTo?: string;
  completionRate: number;        // Tỷ lệ hoàn thành (%)
  claimRate: number;             // Tỷ lệ nhận thưởng (%)
  totalCompletedCount: number;
  totalClaimedCount: number;
  lastUpdated: string;
  updatedBy: string;
  auditNotes?: string;
}

// ----------------------------------------------------
// DAILY CYCLE & CHEST CONFIGURATION CONTRACTS
// ----------------------------------------------------

export interface DailyCycleConfig {
  resetTime: string;             // "00:00"
  timeZone: string;              // "Asia/Ho_Chi_Minh (GMT+7)"
  requiredDailyCount: number;    // 5 nhiệm vụ bắt buộc
  maxBonusCount: number;         // 1 nhiệm vụ thưởng
  dailyChestReward: {
    coins: number;
    xp: number;
    gems: number;
    chestName: string;
  };
  weightedRandomSeed: string;
  autoRefreshPool: boolean;
}

export interface WeeklyStampMilestone {
  stampsRequired: number;        // 3, 5, 7 stamps
  tier: 'bronze' | 'silver' | 'gold';
  chestName: string;
  reward: {
    coins: number;
    xp: number;
    gems: number;
    exclusiveItem?: string;      // Tên avatar frame, title, hoặc booster
  };
  icon: string;
}

export interface WeeklyMilestoneConfig {
  cycleName: string;             // "Thứ 2 → Chủ Nhật (GMT+7)"
  totalStampsMax: number;        // 7
  milestones: WeeklyStampMilestone[];
}

// ----------------------------------------------------
// LIVEOPS GUARDRAILS & ANTI-CHEAT CONTRACTS
// ----------------------------------------------------

export interface MissionGuardrailConfig {
  maxCoinsCapPerQuest: number;   // Mặc định 1000 Coins
  maxGemsCapPerQuest: number;    // Mặc định 100 Gems
  maxDailyPoolCoinsOutput: number;// Mặc định 2500 Coins/ngày/học viên
  requireSuperAdminForOverride: boolean; // Bắt buộc Super Admin duyệt ngoại lệ
  antiSpamScanRule: boolean;     // F-GAME-11: Yêu cầu "≥ 1 từ lưu thành công"
  strictIdempotencyKey: boolean; // Chống spam claim kép khi retry
  notifyLearnerBeforeResetHours: number; // Thông báo nhắc claim trước giờ reset (e.g. 2 giờ)
}

export type ViolationSeverity = 'low' | 'medium' | 'high';

export type MissionViolationType =
  | 'COIN_CAP_EXCEEDED'
  | 'GEM_CAP_EXCEEDED'
  | 'DAILY_OUTPUT_SPIKE'
  | 'ANTI_CHEAT_SUSPICION'
  | 'UNCLAIMED_EXPIRY_SPIKE';

export interface MissionViolation {
  id: string;
  missionId: string;
  missionCode: string;
  missionTitle: string;
  severity: ViolationSeverity;
  violationType: MissionViolationType;
  description: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'whitelisted';
  mitigatedBy?: string;
  reason?: string;
}

// ----------------------------------------------------
// LEARNER SAMPLE & AUDIT PROGRESS CONTRACTS
// ----------------------------------------------------

export interface LearnerMissionProgressSample {
  learnerId: string;
  learnerName: string;
  avatar: string;
  email: string;
  currentStreakDays: number;
  dailyCompleted: number;        // e.g. 5/5
  dailyTotal: number;
  dailyChestClaimed: boolean;
  weeklyStamps: number;          // 0 - 7
  unclaimedCoinsAtRisk: number;  // Số coin đã hoàn thành nhưng chưa claim
  lastActiveTime: string;
  status: 'in_progress' | 'claimed_all' | 'unclaimed_risk' | 'flagged';
  recentEventKey?: string;
}

// ----------------------------------------------------
// UI STATE & NAVIGATION CONTRACTS
// ----------------------------------------------------

export type MissionsTabNavId =
  | 'mission-pool'
  | 'cycle-chests'
  | 'guardrails'
  | 'learner-progress';

export interface MissionFilterState {
  searchQuery: string;
  type: 'ALL' | MissionType;
  actionType: 'ALL' | MissionActionType;
  status: 'ALL' | MissionStatus;
  difficulty: 'ALL' | MissionDifficulty;
  targetAudience: 'ALL' | MissionTargetAudience;
  sortBy: 'weight' | 'completion' | 'reward' | 'newest';
}

export interface MissionsRibbonMetrics {
  totalPoolCount: number;
  activeDailyPoolCount: number;
  activeWeeklyPoolCount: number;
  avgCompletionRate: number;
  avgClaimRate: number;
  unclaimedRiskRate: number;
  faucetCoins24h: number;
  faucetGems24h: number;
  guardrailStatus: 'healthy' | 'warning' | 'breached';
  activeViolationsCount: number;
}
