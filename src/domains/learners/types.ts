// ====================================================
// SNAPVOCAB LEARNERS DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearnerStatus =
  | 'active'        // Tài khoản đang hoạt động bình thường
  | 'suspended'     // Tài khoản bị khóa (vi phạm quy chuẩn hoặc bot)
  | 'unverified';   // Tài khoản chưa xác thực email/OTP

export type UserRole = 'ROLE_LEARNER' | 'ROLE_ADMIN';

export type LeagueTierId =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'ruby'
  | 'diamond';

// ----------------------------------------------------
// FSRS SRS (SPACED REPETITION) PROGRESS CONTRACTS
// ----------------------------------------------------

export interface ReviewLogSummary {
  id: string;
  word: string;
  cefr: CEFRLevel;
  rating: 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
  ratingLabel: 'Again' | 'Hard' | 'Good' | 'Easy';
  reviewedAt: string;
  intervalDays: number;
  stabilityScore: number;
}

export interface LearnerFsrsSummary {
  totalDecks: number;           // Số bộ từ vựng cá nhân
  totalNotes: number;           // Số từ đã lưu (Saved vocabulary)
  totalCards: number;           // Tổng thẻ flashcard đang ôn tập
  cardsNew: number;             // Thẻ mới chưa học
  cardsLearning: number;        // Thẻ đang học (short-term)
  cardsReview: number;          // Thẻ đang ôn tập định kỳ
  cardsMastered: number;        // Thẻ đã ghi nhớ vĩnh viễn (mature FSRS)
  dueCardsToday: number;        // Số thẻ đến hạn cần học hôm nay
  retentionRate: number;        // Tỷ lệ recall thành công (%) (e.g. 89.2)
  avgStabilityDays: number;     // Độ bền trí nhớ trung bình (ngày)
  streakDaysConsistent: number; // Số ngày học liên tục gần nhất
}

// ----------------------------------------------------
// STREAK & LIVEOPS ENGAGEMENT CONTRACTS
// ----------------------------------------------------

export interface LearnerStreakInfo {
  currentStreak: number;        // Chuỗi ngày học hiện tại
  maxStreak: number;            // Kỷ lục chuỗi cao nhất
  streakShields: number;        // Số lượt khiên bảo vệ chuỗi (Streak Freeze)
  isFrozenToday: boolean;       // Đang dùng khiên bảo vệ trong ngày
  lastActiveDate: string;       // Ngày gần nhất thực hiện bài học (YYYY-MM-DD)
  isAtRisk: boolean;            // Cảnh báo nguy cơ đứt chuỗi trong ngày (chưa học trước 23:00)
  recoveredCount: number;       // Số lần đã được LiveOps khôi phục do sự cố
}

// ----------------------------------------------------
// ECONOMY & GAMIFICATION CONTRACTS
// ----------------------------------------------------

export interface LearnerEconomyInfo {
  coins: number;                // Số dư Coin vàng
  gems: number;                 // Số dư Kim cương tím
  totalXp: number;              // Tổng điểm kinh nghiệm tích lũy
  weeklyXp: number;             // XP tích lũy trong tuần hiện tại
  league: LeagueTierId;         // Hạng giải đấu hiện tại
  leagueRank: number;           // Vị trí trong phòng đấu (Cohort 30 người)
  cohortId: string;             // Mã phòng thi đấu
  equippedTitle?: string;       // Danh hiệu đang hiển thị (e.g. "Bậc Thầy Scan")
  unlockedBadgesCount: number;  // Số huy hiệu đã mở
  equippedBadgeIcons: string[]; // 3 huy hiệu ghim trên profile mobile
  dailyScanQuota: number;       // Hạn mức AI Scan mỗi ngày (mặc định 20)
  scansUsedToday: number;       // Số lượt scan đã dùng hôm nay
}

// ----------------------------------------------------
// RECENT AI SCAN ACTIVITY (ACTIVE LEARNING LOOP)
// ----------------------------------------------------

export interface LearnerScanHistoryItem {
  id: string;
  imageUrl: string;
  detectedObject: string;
  mappedWord: string;
  confidenceScore: number;
  timestamp: string;
  isSavedToDeck: boolean;
  status: 'SUCCESS' | 'FEEDBACK_REPORTED' | 'MANUALLY_CORRECTED';
}

// ----------------------------------------------------
// AUDIT LOG & SUPPORT TICKETS CONTRACTS
// ----------------------------------------------------

export type LearnerAuditAction =
  | 'STREAK_RECOVERED'
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_UNBANNED'
  | 'PASSWORD_RESET'
  | 'QUOTA_ADJUSTED'
  | 'CURRENCY_COMPENSATED';

export interface LearnerAuditLogEntry {
  id: string;
  learnerId: string;
  learnerName: string;
  action: LearnerAuditAction;
  operatorName: string;
  ticketId?: string;            // Bắt buộc dạng "TK-XXXXX" cho các hành động nhạy cảm
  timestamp: string;
  details: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

export type StreakLossReason =
  | 'app_crash'
  | 'server_downtime'
  | 'timezone_bug'
  | 'hospitalized_goodwill'
  | 'other';

export interface StreakRecoveryRequest {
  id: string;
  ticketId: string;             // Mã Ticket hỗ trợ (e.g. "TK-2026-8941")
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  avatar: string;
  lostStreakDays: number;
  targetStreakDays: number;
  lossReason: StreakLossReason;
  lossReasonLabel: string;
  proofNote: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionReason?: string;
}

// ----------------------------------------------------
// MASTER LEARNER 360 PROFILE CONTRACT
// ----------------------------------------------------

export interface LearnerProfile {
  id: string;                   // e.g. "USR-98401"
  email: string;
  fullName: string;
  avatar: string;
  role: UserRole;
  status: LearnerStatus;
  cefrLevel: CEFRLevel;
  joinedAt: string;             // ISO string
  lastActiveAt: string;         // ISO string
  appVersion: string;           // e.g. "v1.4.2"
  devicePlatform: 'ios' | 'android' | 'web';
  deviceModel: string;          // e.g. "iPhone 15 Pro", "Samsung S24"
  fsrs: LearnerFsrsSummary;
  streak: LearnerStreakInfo;
  economy: LearnerEconomyInfo;
  recentScans: LearnerScanHistoryItem[];
  recentReviews: ReviewLogSummary[];
  auditHistory: LearnerAuditLogEntry[];
  banInfo?: {
    bannedAt: string;
    bannedBy: string;
    reason: string;
    banDuration: '24h' | '7d' | '30d' | 'permanent';
  };
}

// ----------------------------------------------------
// NAVIGATION & FILTER STATE CONTRACTS
// ----------------------------------------------------

export type LearnersTabNavId =
  | 'roster'            // Danh bạ học viên (Data-Dense Table)
  | 'streak-desk'       // Bàn vận hành xử lý Ticket khôi phục Streak
  | 'retention-fsrs'    // Phân tích trí nhớ FSRS & Retention
  | 'audit-log';        // Nhật ký kiểm toán vận hành người học

export interface LearnerFilterState {
  searchQuery: string;
  status: 'ALL' | LearnerStatus;
  cefr: 'ALL' | CEFRLevel;
  league: 'ALL' | LeagueTierId;
  streakTier: 'ALL' | 'zero' | 'active_1_7' | 'streak_8_30' | 'streak_30_plus' | 'at_risk';
  sortBy: 'lastActive' | 'streak' | 'xp' | 'cards' | 'name' | 'newest';
  sortDirection: 'asc' | 'desc';
}

export interface LearnersRibbonMetrics {
  totalLearners: number;
  activeLearnersToday: number;  // DAU
  dauPercentage: number;        // DAU / MAU
  activeStreaksCount: number;   // Số người đang có chuỗi >= 1
  avgStreakDays: number;
  streakRiskCount: number;      // Đang có nguy cơ đứt chuỗi
  totalCardsMastered: number;
  avgRetentionRate: number;     // e.g. 89.4%
  pendingStreakAppeals: number; // Số ticket khôi phục đang chờ xử lý
  suspendedAccountsCount: number;
}
