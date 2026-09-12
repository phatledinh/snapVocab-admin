// ====================================================
// SNAPVOCAB BADGES & TITLES DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

export type BadgeCategory =
  | 'streak'        // Chuỗi ngày học liên tục (Mascot Snapy Orange)
  | 'scan'          // Nhận diện đồ vật camera AI (F-GAME-11)
  | 'vocabulary'    // Vốn từ vựng, cấp độ CEFR, thẻ SRS
  | 'quiz'          // Điểm số hoàn hảo, thử thách phản xạ
  | 'league'        // Bảng xếp hạng, thăng hạng mùa giải
  | 'special_event';// Sự kiện lễ hội, kỷ niệm, thử thách giới hạn

export type BadgeTier =
  | 'bronze'    // Hạng Đồng: Khởi đầu dễ tiếp cận
  | 'silver'    // Hạng Bạc: Kiên trì trung cấp
  | 'gold'      // Hạng Vàng: Thành tựu nổi bật (Reward Gold)
  | 'platinum'  // Hạng Bạch Kim: Xuất sắc chuyên sâu
  | 'diamond';  // Hạng Kim Cương: Huyền thoại tối thượng

export type BadgeStatus =
  | 'active'    // Đang phát động cho người học
  | 'draft'     // Đang biên soạn, chưa phát hành
  | 'secret'    // Huy hiệu bí mật (hiển thị ??? cho tới khi unlock)
  | 'archived'; // Đã dừng cấp phát, lưu trữ lịch sử

export type UnlockMetricType =
  | 'STREAK_DAYS'          // Số ngày streak liên tiếp
  | 'AI_SCAN_SAVED'        // Số lượng đồ vật scan và lưu từ thành công
  | 'SRS_MASTERED'         // Số lượng thẻ từ vựng đã ghi nhớ vĩnh viễn
  | 'PERFECT_QUIZ'         // Số lần đạt điểm 100% trong bài ôn tập
  | 'LEADERBOARD_RANK'     // Lọt top bảng xếp hạng tuần
  | 'TOPICS_COMPLETED'     // Số chủ đề (Deck) đã hoàn thành 100%
  | 'CHESTS_OPENED';       // Số rương tuần / rương ngày đã mở

export interface BadgeReward {
  xp: number;
  coins: number;
  gems?: number;
  titleId?: string;
  titleName?: string;
}

export interface Badge {
  id: string;
  code: string;                  // e.g. "BDG-STRK-07", "BDG-SCAN-100"
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  icon: string;                  // Vector icon identifier hoặc emoji
  unlockMetric: UnlockMetricType;
  targetValue: number;           // Ngưỡng đạt: 7, 30, 100, v.v.
  targetUnit: string;            // "ngày liên tục", "từ đã lưu", "thẻ SRS", v.v.
  reward: BadgeReward;
  status: BadgeStatus;
  isSecret?: boolean;            // Cờ bí mật (Easter Egg)
  secretHint?: string;           // Lời gợi ý khi còn khóa bí mật
  seriesId?: string;             // ID chuỗi bậc thang (e.g. "streak-chain")
  seriesLevel?: number;          // Cấp 1, 2, 3, 4 trong chuỗi
  totalEarners: number;          // Số lượng học viên đã mở khóa
  unlockRate: number;            // Tỷ lệ mở khóa toàn hệ thống (%)
  createdDate: string;
  lastUpdated: string;
  updatedBy: string;
  auditNotes?: string;
}

// ----------------------------------------------------
// HONORARY TITLES & PLAYER FLAIR CONTRACTS
// ----------------------------------------------------

export type TitleFlairTheme =
  | 'fire'      // Đỏ cam rực cháy (#FF8A00)
  | 'emerald'   // Lục bảo học thuật (#58CC02)
  | 'gold'      // Ánh kim vương giả (#FFC42E)
  | 'royal'     // Tím huyền bí (#8B5CF6)
  | 'neon';     // Lam điện tử hiện đại (#1CB0F6)

export interface HonoraryTitle {
  id: string;
  code: string;                  // e.g. "TTL-SCAN-01"
  name: string;                  // e.g. "[Bậc Thầy Scan]"
  description: string;
  rarity: BadgeTier;
  flairTheme: TitleFlairTheme;
  requiredBadgeId?: string;
  requiredBadgeName?: string;
  totalEquipped: number;         // Số học viên đang chọn hiển thị trên profile
  equipRate: number;             // % người sở hữu đang đeo
  status: 'active' | 'archived';
  createdDate: string;
}

// ----------------------------------------------------
// LEARNER BADGE LOG & AUDIT CONTRACTS
// ----------------------------------------------------

export interface LearnerBadgeRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  avatar: string;
  email: string;
  badgeId: string;
  badgeCode: string;
  badgeName: string;
  badgeTier: BadgeTier;
  badgeIcon: string;
  earnedAt: string;
  idempotencyKey: string;
  isEquippedFeatured: boolean;   // Đang ghim trong 3 huy hiệu nổi bật profile
  status: 'valid' | 'revoked';
  revokedReason?: string;
}

// ----------------------------------------------------
// UI STATE & NAVIGATION CONTRACTS
// ----------------------------------------------------

export type BadgesTabNavId =
  | 'badge-catalog'
  | 'titles-flair'
  | 'trigger-rules'
  | 'learner-grants';

export interface BadgeFilterState {
  searchQuery: string;
  category: 'ALL' | BadgeCategory;
  tier: 'ALL' | BadgeTier;
  status: 'ALL' | BadgeStatus;
  sortBy: 'tier' | 'earners' | 'unlockRate' | 'newest' | 'name';
}

export interface BadgesRibbonMetrics {
  totalBadges: number;
  activeBadgesCount: number;
  secretBadgesCount: number;
  archivedBadgesCount: number;
  totalTitles: number;
  activeWearersCount: number;
  avgEquipRate: number;
  unlocksVelocity24h: number;
  unlocksVelocityTrend: number;  // % tăng trưởng so với hôm qua (+14.2%)
  rarestBadgeName: string;
  rarestBadgeRate: number;
  totalCoinsMinted: number;
  totalGemsMinted: number;
}
