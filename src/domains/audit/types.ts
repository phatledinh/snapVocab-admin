// ====================================================
// SNAPVOCAB AUDIT ACTIVITY LOG DOMAIN CONTRACTS
// Source of Truth: docs/design/design.md & docs/design/colors.js
// ====================================================

export type AuditDomainCategory =
  | 'CONTENT_STUDIO'    // Từ vựng, phát âm IPA/TTS, ảnh minh họa, quy trình FSM
  | 'AI_SCAN'           // Nhãn camera AI, sửa nhãn Active Learning, dataset Gemini Vision
  | 'LIVEOPS_ECONOMY'   // Cửa hàng, nhiệm vụ, streak recovery, tiền tệ Coins/Gems, guardrails
  | 'LEARNERS_PEOPLE'   // Quản lý học viên, khóa tài khoản (Ban), reset mật khẩu, quota
  | 'ISSUE_REPORTS'     // Xử lý báo cáo sự cố, bác bỏ, cập nhật từ điển inline
  | 'SYSTEM_SECURITY';  // Phiên đăng nhập Admin, nâng quyền, xuất dữ liệu CSV, cấu hình hệ thống

export type AuditSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL' | 'SECURITY';

export type AuditActionType =
  // Content Studio
  | 'VOCAB_PUBLISHED'
  | 'VOCAB_SUBMIT_REVIEW'
  | 'VOCAB_REVISED'
  | 'VOCAB_ARCHIVED'
  | 'VOCAB_DELETED'
  | 'AUDIO_TTS_UPDATED'
  | 'DICTIONARY_IMPORTED'
  // AI Scan
  | 'AI_LABEL_CORRECTED'
  | 'AI_DATASET_SAVED'
  | 'AI_CONFIDENCE_OVERRIDDEN'
  // LiveOps & Economy
  | 'STREAK_RECOVERED'
  | 'CURRENCY_COMPENSATED'
  | 'SHOP_ITEM_UPDATED'
  | 'QUEST_REWARD_CAPPED'
  | 'GUARDRAIL_TRIGGERED'
  | 'SEASON_CONFIG_MODIFIED'
  // Learners & People
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_UNBANNED'
  | 'PASSWORD_RESET'
  | 'QUOTA_ADJUSTED'
  | 'PROFILE_FORCE_UPDATED'
  // Issue Reports
  | 'ISSUE_RESOLVED'
  | 'ISSUE_DISMISSED'
  | 'ISSUE_ESCALATED'
  // System & Security
  | 'ADMIN_LOGIN'
  | 'ROLE_ELEVATED'
  | 'BULK_DATA_EXPORT'
  | 'SYSTEM_CONFIG_UPDATED'
  | 'CACHE_PURGED';

export interface AuditOperator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  ipAddress: string;
  userAgent?: string;
}

export type AuditTargetType =
  | 'WORD'
  | 'LEARNER'
  | 'SCAN'
  | 'SHOP_ITEM'
  | 'TICKET'
  | 'SEASON'
  | 'SYSTEM';

export interface AuditTargetEntity {
  type: AuditTargetType;
  id: string;
  title: string;
  navDeepLink?: string; // e.g. 'content-studio', 'learners', 'shop', 'reports'
}

export interface AuditStateDiff {
  before: Record<string, any> | string;
  after: Record<string, any> | string;
}

export interface AuditLogEntry {
  id: string;                      // e.g. "AUD-2026-0911-001"
  timestamp: string;               // ISO 8601
  domain: AuditDomainCategory;
  action: AuditActionType;
  actionLabel: string;             // Tiêu đề hiển thị tiếng Việt rõ ràng
  severity: AuditSeverity;
  operator: AuditOperator;
  targetEntity: AuditTargetEntity;
  ticketId?: string;               // Mã Ticket hỗ trợ (Bắt buộc với các tác vụ nhạy cảm §7.3)
  reason: string;                  // Lý do kiểm toán bắt buộc (§5.3 & §7.1)
  details?: string;                // Mô tả bổ sung chi tiết
  diff?: AuditStateDiff;           // Biến động trạng thái Trước ➔ Sau
  canRollback?: boolean;           // Cho phép thử nghiệm hoàn tác trạng thái an toàn
  metadata: {
    executionTimeMs?: number;
    guardrailRule?: string;
    complianceValid: boolean;      // Đã xác thực tuân thủ giải trình (100% true)
    tamperHash: string;            // Chuỗi băm mã hóa kiểm định bất biến (SHA-256 simulation)
    blockHeight?: number;          // Vị trí thứ tự chuỗi sổ cái
  };
}

// ----------------------------------------------------
// NAVIGATION & FILTER STATE CONTRACTS
// ----------------------------------------------------

export type AuditTabNavId =
  | 'master-stream'         // Sổ cái kiểm toán toàn hệ thống (All domains)
  | 'content-ai'            // Lịch sử máy trạng thái Content Studio & AI Scan Loop
  | 'liveops-guardrails'    // Hàng rào kinh tế, khôi phục streak & tiền tệ
  | 'security-access'       // Bảo mật, khóa tài khoản & phiên Admin
  | 'compliance-export';    // Toàn vẹn dữ liệu bất biến & Xuất báo cáo

export type AuditDateRange = 'today' | '24h' | '7d' | '30d' | 'all';

export interface AuditFilterState {
  searchQuery: string;
  domain: 'ALL' | AuditDomainCategory;
  severity: 'ALL' | AuditSeverity;
  operatorId: 'ALL' | string;
  hasTicketOnly: boolean;
  guardrailOnly: boolean;
  dateRange: AuditDateRange;
  sortBy: 'timestamp' | 'severity' | 'domain' | 'operator';
  sortDirection: 'asc' | 'desc';
}

export interface AuditRibbonMetrics {
  totalLogsCount: number;
  logsTodayCount: number;
  criticalViolationsCount: number;
  complianceRate: number;          // Tỷ lệ có lý do/ticket hợp lệ (%) e.g. 100%
  activeOperatorsCount: number;
  avgEventsPerHour: number;
  guardrailViolationsBlocked: number;
}
