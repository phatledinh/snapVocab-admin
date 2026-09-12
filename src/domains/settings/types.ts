// ====================================================
// SNAPVOCAB SYSTEM & LIVEOPS SETTINGS DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/spec/specs.md
// ====================================================

export type SettingsTabNavId =
  | 'ai-pipeline'
  | 'srs-learning'
  | 'economy-guardrails'
  | 'security-access'
  | 'system-maintenance';

// ----------------------------------------------------
// 1. AI Vision Pipeline & Scan Quota Config
// ----------------------------------------------------
export interface AIPipelineConfig {
  modelName: string;
  internalEndpoint: string;
  workerConcurrency: number; // Mặc định 1 worker/GPU (1-8)
  workerTimeoutSeconds: number; // Mặc định 60s
  confidenceFloor: number; // 0.30 - 0.95 (Mặc định 0.65)
  clipScoreFloor: number; // 0.10 - 0.60 (Mặc định 0.28)
  tiledOverlapIou: number; // 0.45
  dailyScanQuotaFree: number; // Mặc định 20 scans/ngày
  dailyScanQuotaPremium: number; // Mặc định 100 scans/ngày
  maxQueueDepth: number; // Mặc định 50 jobs
  maxScanImageSizeMb: number; // 10 MB
  maxAvatarSizeMb: number; // 5 MB
  allowedMimeTypes: string[]; // ['image/jpeg', 'image/png', 'image/webp']
  autoRetryFailedJobs: boolean;
  saveToFineTuningDataset: boolean;
}

// ----------------------------------------------------
// 2. SRS & Learning Parameters Config
// ----------------------------------------------------
export interface SRSLearningConfig {
  algorithm: 'FSRS-4.5' | 'SM-2';
  matureIntervalDays: number; // Mặc định 21 ngày (specs.md L329)
  maxIntervalDays: number; // Mặc định 365 ngày
  requestedRetention: number; // Mặc định 0.90 (90%)
  maxNewCardsPerDay: number; // Mặc định 20 thẻ
  maxReviewsPerDay: number; // Mặc định 100 thẻ
  pushReminderStartHour: number; // 19 (19h00)
  pushReminderEndHour: number; // 21 (21h00)
  pushReminderMaxPerDay: number; // 1
  ttsDefaultVoice: 'en-US' | 'en-GB';
  ttsDefaultSpeed: number; // 0.8 | 1.0 | 1.2
  ttsDefaultPitch: number; // 0.5 - 1.5
  ttsCloudFallbackUrl: string;
  allowLearnerCustomTemplates: boolean;
}

// ----------------------------------------------------
// 3. LiveOps Guardrails & Economy Config
// ----------------------------------------------------
export interface EconomyGuardrailsConfig {
  maxMissionCoinRewardCap: number; // 1,000 Coins (design.md 7.3)
  maxMissionGemRewardCap: number; // 100 Gems
  superAdminOverrideRequired: boolean;
  streakFreezeCostCoins: number; // 200 Coins
  maxMonthlyStreakRepairs: number; // 3 lần/tháng
  requireSupportTicketForStreakRecovery: boolean; // true
  leaderboardStartDay: string; // 'MONDAY_00_00'
  leaderboardEndDay: string; // 'SUNDAY_23_59'
  serverTimezone: string; // 'Asia/Ho_Chi_Minh (UTC+7)'
  diamondTierRewardTop1Coins: number; // 500
  diamondTierRewardTop1Gems: number; // 50
  diamondTierRewardTop2Coins: number; // 300
  diamondTierRewardTop2Gems: number; // 30
  diamondTierRewardTop3Coins: number; // 150
  diamondTierRewardTop3Gems: number; // 15
}

// ----------------------------------------------------
// 4. Security, Access & RBAC Config
// ----------------------------------------------------
export type AdminRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_LEAD'
  | 'AI_OPERATOR'
  | 'LIVEOPS_MANAGER'
  | 'SUPPORT_MODERATOR';

export interface RolePermissionRule {
  role: AdminRole;
  roleNameVi: string;
  description: string;
  canPublishVocab: boolean;
  canReviewAiLabels: boolean;
  canModifyEconomy: boolean;
  canBanLearners: boolean;
  canChangeSystemConfig: boolean;
  canPurgeCache: boolean;
}

export interface AdminOperatorUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  twoFactorEnabled: boolean;
  lastActive: string;
  ipAddress: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface SecurityAccessConfig {
  sessionIdleTimeoutMinutes: number; // 60
  require2FAForAdmin: boolean; // true
  requireAuditReasonForFsmChanges: boolean; // true
  auditRetentionDays: number; // 365
  maxFailedLoginAttempts: number; // 5
  operators: AdminOperatorUser[];
  rolePermissions: RolePermissionRule[];
}

// ----------------------------------------------------
// 5. System Maintenance, Storage & Cache Config
// ----------------------------------------------------
export interface SystemMaintenanceConfig {
  minSupportedAppVersion: string; // "1.2.0"
  latestAppVersion: string; // "1.4.2"
  appStoreUrl: string;
  playStoreUrl: string;
  maintenanceModeActive: boolean;
  maintenanceMessageVi: string;
  storageBucketName: string;
  storageCdnDomain: string;
  storageUsedGb: number;
  storageMaxGb: number;
  lastDictionaryPurgeTime: string;
  lastAiQueuePurgeTime: string;
  lastLeaderboardPurgeTime: string;
}

// ----------------------------------------------------
// Master Settings Snapshot
// ----------------------------------------------------
export interface SystemSettingsSnapshot {
  aiPipeline: AIPipelineConfig;
  srsLearning: SRSLearningConfig;
  economyGuardrails: EconomyGuardrailsConfig;
  securityAccess: SecurityAccessConfig;
  systemMaintenance: SystemMaintenanceConfig;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

// ----------------------------------------------------
// Audit & Diff Tracking
// ----------------------------------------------------
export interface ConfigFieldDiff {
  category: SettingsTabNavId;
  fieldKey: string;
  labelVi: string;
  oldValue: any;
  newValue: any;
  isGuardrailViolation?: boolean;
  violationMessage?: string;
}

export interface GuardrailWarning {
  fieldKey: string;
  labelVi: string;
  currentValue: number;
  threshold: number;
  message: string;
  severity: 'WARNING' | 'CRITICAL';
}
