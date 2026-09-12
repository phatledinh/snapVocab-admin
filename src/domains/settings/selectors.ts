// ====================================================
// SNAPVOCAB SETTINGS SELECTORS & UTILITIES
// ====================================================

import {
  SystemSettingsSnapshot,
  ConfigFieldDiff,
  GuardrailWarning,
  SettingsTabNavId,
} from './types';

// Map nhãn tiếng Việt cho các trường cấu hình
const FIELD_LABELS: Record<string, string> = {
  // AI Pipeline
  'aiPipeline.modelName': 'Mô hình AI Vision & SAM',
  'aiPipeline.internalEndpoint': 'Endpoint FastAPI nội bộ',
  'aiPipeline.workerConcurrency': 'Số Worker AI/GPU',
  'aiPipeline.workerTimeoutSeconds': 'Thời gian Timeout xử lý AI (giây)',
  'aiPipeline.confidenceFloor': 'Ngưỡng tin cậy nhận diện (Confidence Floor)',
  'aiPipeline.clipScoreFloor': 'Ngưỡng bộ lọc CLIP Score',
  'aiPipeline.tiledOverlapIou': 'Độ chồng khớp Tiled IoU',
  'aiPipeline.dailyScanQuotaFree': 'Hạn ngạch scan miễn phí (lượt/ngày)',
  'aiPipeline.dailyScanQuotaPremium': 'Hạn ngạch scan Premium (lượt/ngày)',
  'aiPipeline.maxQueueDepth': 'Độ sâu hàng đợi tối đa (Max Queue)',
  'aiPipeline.maxScanImageSizeMb': 'Dung lượng ảnh scan tối đa (MB)',
  'aiPipeline.maxAvatarSizeMb': 'Dung lượng avatar tối đa (MB)',
  'aiPipeline.autoRetryFailedJobs': 'Tự động thử lại job lỗi',
  'aiPipeline.saveToFineTuningDataset': 'Lưu vào tập dữ liệu Fine-tuning',

  // SRS Learning
  'srsLearning.algorithm': 'Thuật toán lặp lại ngắt quãng (SRS)',
  'srsLearning.matureIntervalDays': 'Ngưỡng thẻ trưởng thành (Mature Days)',
  'srsLearning.maxIntervalDays': 'Khoảng cách ôn tập tối đa (ngày)',
  'srsLearning.requestedRetention': 'Tỷ lệ ghi nhớ kỳ vọng (Retention Rate)',
  'srsLearning.maxNewCardsPerDay': 'Thẻ mới tối đa / ngày',
  'srsLearning.maxReviewsPerDay': 'Lượt ôn tập tối đa / ngày',
  'srsLearning.pushReminderStartHour': 'Giờ bắt đầu push nhắc học (h)',
  'srsLearning.pushReminderEndHour': 'Giờ kết thúc push nhắc học (h)',
  'srsLearning.pushReminderMaxPerDay': 'Số lần push tối đa / ngày',
  'srsLearning.ttsDefaultVoice': 'Giọng đọc mặc định',
  'srsLearning.ttsDefaultSpeed': 'Tốc độ đọc TTS',
  'srsLearning.ttsDefaultPitch': 'Cao độ giọng TTS',
  'srsLearning.ttsCloudFallbackUrl': 'Endpoint TTS Cloud Fallback',
  'srsLearning.allowLearnerCustomTemplates': 'Cho phép học viên tùy biến Card Template',

  // Economy Guardrails
  'economyGuardrails.maxMissionCoinRewardCap': 'Trần thưởng Coins tối đa / nhiệm vụ',
  'economyGuardrails.maxMissionGemRewardCap': 'Trần thưởng Gems tối đa / nhiệm vụ',
  'economyGuardrails.superAdminOverrideRequired': 'Yêu cầu Super Admin duyệt khi vượt trần',
  'economyGuardrails.streakFreezeCostCoins': 'Giá vật phẩm Đóng băng Streak (Coins)',
  'economyGuardrails.maxMonthlyStreakRepairs': 'Lượt khôi phục Streak tối đa / tháng',
  'economyGuardrails.requireSupportTicketForStreakRecovery': 'Bắt buộc nhập Ticket ID khi sửa Streak',
  'economyGuardrails.leaderboardStartDay': 'Thời điểm mở mùa giải tuần',
  'economyGuardrails.leaderboardEndDay': 'Thời điểm chốt mùa giải tuần',
  'economyGuardrails.serverTimezone': 'Múi giờ máy chủ LiveOps',
  'economyGuardrails.diamondTierRewardTop1Coins': 'Thưởng Top 1 Bảng Kim Cương (Coins)',
  'economyGuardrails.diamondTierRewardTop1Gems': 'Thưởng Top 1 Bảng Kim Cương (Gems)',

  // Security Access
  'securityAccess.sessionIdleTimeoutMinutes': 'Thời gian chờ tự động đăng xuất (phút)',
  'securityAccess.require2FAForAdmin': 'Bắt buộc xác thực 2FA cho Admin',
  'securityAccess.requireAuditReasonForFsmChanges': 'Bắt buộc nhập lý do khi đổi trạng thái thẻ FSM',
  'securityAccess.auditRetentionDays': 'Thời gian lưu trữ nhật ký Audit Log (ngày)',
  'securityAccess.maxFailedLoginAttempts': 'Số lần đăng nhập sai tối đa trước khi khóa',

  // System Maintenance
  'systemMaintenance.minSupportedAppVersion': 'Phiên bản App di động tối thiểu bắt buộc',
  'systemMaintenance.latestAppVersion': 'Phiên bản App mới nhất trên Store',
  'systemMaintenance.maintenanceModeActive': 'Trạng thái Chế độ Bảo trì Hệ thống',
  'systemMaintenance.maintenanceMessageVi': 'Thông điệp bảo trì tiếng Việt',
  'systemMaintenance.storageBucketName': 'Tên Bucket Storage Cloudflare R2',
  'systemMaintenance.storageCdnDomain': 'Tên miền CDN Media',
};

/**
 * Tính toán danh sách các trường thay đổi (Diff) giữa snapshot gốc và snapshot hiện tại.
 */
export function computeSettingsDiff(
  original: SystemSettingsSnapshot,
  current: SystemSettingsSnapshot
): ConfigFieldDiff[] {
  const diffs: ConfigFieldDiff[] = [];

  const checkCategory = (
    categoryKey: keyof Omit<SystemSettingsSnapshot, 'version' | 'updatedAt' | 'updatedBy'>,
    categoryTab: SettingsTabNavId
  ) => {
    const origObj = original[categoryKey] as Record<string, any>;
    const currObj = current[categoryKey] as Record<string, any>;

    Object.keys(currObj).forEach((key) => {
      const fullKey = `${categoryKey}.${key}`;
      const oldVal = origObj[key];
      const newVal = currObj[key];

      // Bỏ qua mảng operators hoặc mảng phức tạp nếu xử lý sâu
      if (Array.isArray(newVal)) {
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          diffs.push({
            category: categoryTab,
            fieldKey: fullKey,
            labelVi: FIELD_LABELS[fullKey] || fullKey,
            oldValue: Array.isArray(oldVal) ? oldVal.join(', ') : oldVal,
            newValue: newVal.join(', '),
          });
        }
        return;
      }

      if (oldVal !== newVal) {
        let isViolation = false;
        let violationMsg = '';

        // Kiểm tra Guardrail cho trường này
        if (fullKey === 'economyGuardrails.maxMissionCoinRewardCap' && newVal > 1000) {
          isViolation = true;
          violationMsg = 'Vượt trần quy định an toàn 1,000 Coins (cần Super Admin duyệt)';
        } else if (fullKey === 'economyGuardrails.maxMissionGemRewardCap' && newVal > 100) {
          isViolation = true;
          violationMsg = 'Vượt trần quy định an toàn 100 Gems (cần Super Admin duyệt)';
        }

        diffs.push({
          category: categoryTab,
          fieldKey: fullKey,
          labelVi: FIELD_LABELS[fullKey] || fullKey,
          oldValue: oldVal,
          newValue: newVal,
          isGuardrailViolation: isViolation,
          violationMessage: violationMsg,
        });
      }
    });
  };

  checkCategory('aiPipeline', 'ai-pipeline');
  checkCategory('srsLearning', 'srs-learning');
  checkCategory('economyGuardrails', 'economy-guardrails');
  checkCategory('securityAccess', 'security-access');
  checkCategory('systemMaintenance', 'system-maintenance');

  return diffs;
}

/**
 * Kiểm tra các cảnh báo Guardrails cho cấu hình hiện tại
 */
export function checkGuardrailWarnings(settings: SystemSettingsSnapshot): GuardrailWarning[] {
  const warnings: GuardrailWarning[] = [];

  // 1. Check Coin Cap (> 1000)
  if (settings.economyGuardrails.maxMissionCoinRewardCap > 1000) {
    warnings.push({
      fieldKey: 'economyGuardrails.maxMissionCoinRewardCap',
      labelVi: 'Trần thưởng Coins nhiệm vụ',
      currentValue: settings.economyGuardrails.maxMissionCoinRewardCap,
      threshold: 1000,
      message: 'Mức thưởng vượt quá trần an toàn 1,000 Coins. Nguy cơ gây mất cân đối lạm phát kinh tế ảo!',
      severity: 'CRITICAL',
    });
  }

  // 2. Check Gem Cap (> 100)
  if (settings.economyGuardrails.maxMissionGemRewardCap > 100) {
    warnings.push({
      fieldKey: 'economyGuardrails.maxMissionGemRewardCap',
      labelVi: 'Trần thưởng Gems nhiệm vụ',
      currentValue: settings.economyGuardrails.maxMissionGemRewardCap,
      threshold: 100,
      message: 'Mức thưởng vượt quá 100 Gems. Gems là tài nguyên trả phí cao cấp, yêu cầu phê duyệt nghiêm ngặt.',
      severity: 'CRITICAL',
    });
  }

  // 3. Check Free Scan Quota (> 50)
  if (settings.aiPipeline.dailyScanQuotaFree > 50) {
    warnings.push({
      fieldKey: 'aiPipeline.dailyScanQuotaFree',
      labelVi: 'Hạn ngạch scan miễn phí',
      currentValue: settings.aiPipeline.dailyScanQuotaFree,
      threshold: 50,
      message: 'Hạn ngạch miễn phí > 50 scan/ngày có thể làm quá tải cụm GPU T4 và gia tăng chi phí hạ tầng.',
      severity: 'WARNING',
    });
  }

  // 4. Check Mature Interval (< 14 ngày)
  if (settings.srsLearning.matureIntervalDays < 14) {
    warnings.push({
      fieldKey: 'srsLearning.matureIntervalDays',
      labelVi: 'Ngưỡng thẻ trưởng thành',
      currentValue: settings.srsLearning.matureIntervalDays,
      threshold: 14,
      message: 'Ngưỡng < 14 ngày quá ngắn so với tiêu chuẩn FSRS/Anki (khuyến nghị >= 21 ngày).',
      severity: 'WARNING',
    });
  }

  return warnings;
}

/**
 * Đếm số thay đổi theo từng Tab
 */
export function countDiffsPerTab(diffs: ConfigFieldDiff[]): Record<SettingsTabNavId, number> {
  const counts: Record<SettingsTabNavId, number> = {
    'ai-pipeline': 0,
    'srs-learning': 0,
    'economy-guardrails': 0,
    'security-access': 0,
    'system-maintenance': 0,
  };

  diffs.forEach((d) => {
    if (counts[d.category] !== undefined) {
      counts[d.category]++;
    }
  });

  return counts;
}

/**
 * Tải file snapshot cấu hình về máy khách
 */
export function exportSettingsAsJson(settings: SystemSettingsSnapshot) {
  const jsonStr = JSON.stringify(settings, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `snapvocab-config-v${settings.version}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
