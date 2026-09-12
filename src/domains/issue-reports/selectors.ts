// ====================================================
// SNAPVOCAB ISSUE REPORTS SELECTORS & LOGIC
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

import {
  IssueReportItem,
  IssueFilterState,
  IssueRibbonMetrics,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from './types';

/**
 * Tính toán 4 cụm chỉ số KPI trên thanh Ribbon của Issue Reports
 */
export function computeIssueRibbonMetrics(
  issues: IssueReportItem[]
): IssueRibbonMetrics {
  const pendingIssues = issues.filter(
    (i) => i.status === 'PENDING' || i.status === 'INVESTIGATING'
  );

  const urgentP1Count = issues.filter(
    (i) =>
      i.priority === 'P1' &&
      (i.status === 'PENDING' || i.status === 'INVESTIGATING')
  ).length;

  const resolvedIssues = issues.filter((i) => i.status === 'RESOLVED');
  const resolvedTodayCount = resolvedIssues.length;

  const activeLearningFineTunedCount = issues.filter(
    (i) => i.scanData?.pushedToFineTuning === true
  ).length;

  const dictionaryFixesCount = issues.filter(
    (i) =>
      i.category === 'VOCABULARY' &&
      (i.resolution?.actionTaken === 'VOCABULARY_UPDATED_INLINE' ||
        i.resolution?.actionTaken === 'OPENED_IN_CONTENT_STUDIO')
  ).length;

  // Giả lập tỷ lệ SLA compliance
  const slaComplianceRate = 96.2;
  const avgResolutionTimeMinutes = 48;

  return {
    totalPendingIssues: pendingIssues.length,
    urgentP1Count,
    resolvedTodayCount,
    avgResolutionTimeMinutes,
    activeLearningFineTunedCount,
    dictionaryFixesCount,
    slaComplianceRate,
  };
}

/**
 * Bộ lọc đa tầng cho danh sách sự cố
 */
export function filterIssueReports(
  issues: IssueReportItem[],
  filters: IssueFilterState
): IssueReportItem[] {
  return issues
    .filter((issue) => {
      // 1. Tìm kiếm văn bản
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTicket = issue.ticketId.toLowerCase().includes(query);
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesLearner =
          issue.learner.fullName.toLowerCase().includes(query) ||
          issue.learner.email.toLowerCase().includes(query);
        const matchesWord =
          issue.targetWord?.toLowerCase().includes(query) ||
          issue.suggestedWord?.toLowerCase().includes(query) ||
          issue.scanData?.predictedLabel.toLowerCase().includes(query);

        if (!matchesTicket && !matchesTitle && !matchesLearner && !matchesWord) {
          return false;
        }
      }

      // 2. Lọc theo Phân loại
      if (filters.category !== 'ALL' && issue.category !== filters.category) {
        return false;
      }

      // 3. Lọc theo Độ ưu tiên
      if (filters.priority !== 'ALL' && issue.priority !== filters.priority) {
        return false;
      }

      // 4. Lọc theo Trạng thái
      if (filters.status !== 'ALL' && issue.status !== filters.status) {
        return false;
      }

      // 5. Lọc theo Nền tảng HĐH
      if (
        filters.platform !== 'ALL' &&
        issue.deviceInfo.platform !== filters.platform
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'priority') {
        const priorityWeight = { P1: 3, P2: 2, P3: 1 };
        const diff =
          priorityWeight[b.priority] - priorityWeight[a.priority];
        return filters.sortDirection === 'desc' ? diff : -diff;
      }

      if (filters.sortBy === 'slaDeadline') {
        const diff = a.slaRemainingMinutes - b.slaRemainingMinutes;
        return filters.sortDirection === 'asc' ? diff : -diff;
      }

      // Default: reportedAt
      const timeA = new Date(a.reportedAt).getTime();
      const timeB = new Date(b.reportedAt).getTime();
      return filters.sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
    });
}

/**
 * Trả về màu badge cho Mức độ ưu tiên
 */
export function getPriorityBadge(priority: IssuePriority) {
  switch (priority) {
    case 'P1':
      return {
        label: 'P1 · Khẩn cấp',
        className: 'bg-danger-light text-danger border border-danger/30 font-bold animate-pulse',
      };
    case 'P2':
      return {
        label: 'P2 · Cao',
        className: 'bg-snapy-light text-snapy border border-snapy/30 font-semibold',
      };
    case 'P3':
      return {
        label: 'P3 · Bình thường',
        className: 'bg-surface-subtle text-text-muted border border-border font-medium',
      };
  }
}

/**
 * Trả về màu badge cho Trạng thái
 */
export function getStatusBadge(status: IssueStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Chờ tiếp nhận',
        className: 'bg-danger-light text-danger border border-danger/20 font-semibold',
      };
    case 'INVESTIGATING':
      return {
        label: 'Đang xử lý',
        className: 'bg-info-light text-info border border-info/20 font-semibold',
      };
    case 'RESOLVED':
      return {
        label: 'Đã giải quyết',
        className: 'bg-primary-light text-primary border border-primary/20 font-semibold',
      };
    case 'DISMISSED':
      return {
        label: 'Đã bác bỏ',
        className: 'bg-surface-subtle text-text-muted border border-border font-normal',
      };
  }
}

/**
 * Trả về thông tin hiển thị cho Phân loại sự cố
 */
export function getCategoryInfo(category: IssueCategory) {
  switch (category) {
    case 'AI_SCAN':
      return {
        label: 'Scan Camera AI',
        color: 'text-snapy',
        bgColor: 'bg-snapy-light',
        borderColor: 'border-snapy/30',
        icon: '📸',
      };
    case 'VOCABULARY':
      return {
        label: 'Từ Vựng & Từ Điển',
        color: 'text-info',
        bgColor: 'bg-info-light',
        borderColor: 'border-info/30',
        icon: '📚',
      };
    case 'LIVEOPS_ACCOUNT':
      return {
        label: 'LiveOps & Tài Khoản',
        color: 'text-reward',
        bgColor: 'bg-reward-light',
        borderColor: 'border-reward/30',
        icon: '🔥',
      };
    case 'TECHNICAL_APP':
      return {
        label: 'Lỗi Ứng Dụng / App',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: '⚙️',
      };
  }
}
