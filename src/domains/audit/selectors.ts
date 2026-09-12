// ====================================================
// SNAPVOCAB AUDIT ACTIVITY LOG SELECTORS & EXPORTERS
// Source of Truth: docs/design/design.md & docs/design/colors.js
// ====================================================

import {
  AuditLogEntry,
  AuditFilterState,
  AuditRibbonMetrics,
  AuditSeverity,
} from './types';

/**
 * Tính toán 6 chỉ số vận hành trên thanh Ribbon của Audit Activity Log
 */
export function computeAuditMetrics(logs: AuditLogEntry[]): AuditRibbonMetrics {
  const todayPrefix = '2026-09-11';
  const logsToday = logs.filter((l) => l.timestamp.startsWith(todayPrefix));

  const criticalViolations = logs.filter(
    (l) => l.severity === 'CRITICAL' || l.severity === 'SECURITY'
  );

  const guardrailBlocked = logs.filter(
    (l) => l.action === 'GUARDRAIL_TRIGGERED'
  );

  const operatorsSet = new Set(logs.map((l) => l.operator.id));

  // Tỷ lệ có lý do giải trình hợp lệ (chuẩn quy định §5.3 & §7.1: 100% bắt buộc)
  const validReasonsCount = logs.filter((l) => l.reason.trim().length > 10).length;
  const complianceRate = logs.length > 0 ? Math.round((validReasonsCount / logs.length) * 100) : 100;

  return {
    totalLogsCount: logs.length,
    logsTodayCount: logsToday.length,
    criticalViolationsCount: criticalViolations.length,
    complianceRate,
    activeOperatorsCount: operatorsSet.size,
    avgEventsPerHour: 4.8,
    guardrailViolationsBlocked: guardrailBlocked.length,
  };
}

/**
 * Bộ lọc đa tầng cho Sổ cái kiểm toán
 */
export function filterAuditLogs(
  logs: AuditLogEntry[],
  filters: AuditFilterState
): AuditLogEntry[] {
  const filtered = logs.filter((entry) => {
    // 1. Tìm kiếm văn bản tự do
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = entry.id.toLowerCase().includes(q);
      const matchAction = entry.actionLabel.toLowerCase().includes(q) || entry.action.toLowerCase().includes(q);
      const matchReason = entry.reason.toLowerCase().includes(q);
      const matchDetails = entry.details?.toLowerCase().includes(q) || false;
      const matchTicket = entry.ticketId?.toLowerCase().includes(q) || false;
      const matchOperator = entry.operator.name.toLowerCase().includes(q) || entry.operator.role.toLowerCase().includes(q);
      const matchTarget = entry.targetEntity.title.toLowerCase().includes(q) || entry.targetEntity.id.toLowerCase().includes(q);
      const matchIp = entry.operator.ipAddress.toLowerCase().includes(q);

      if (!matchId && !matchAction && !matchReason && !matchDetails && !matchTicket && !matchOperator && !matchTarget && !matchIp) {
        return false;
      }
    }

    // 2. Lọc theo Phân hệ
    if (filters.domain !== 'ALL' && entry.domain !== filters.domain) {
      return false;
    }

    // 3. Lọc theo Mức độ nghiêm trọng
    if (filters.severity !== 'ALL' && entry.severity !== filters.severity) {
      return false;
    }

    // 4. Lọc theo Người thao tác (Operator)
    if (filters.operatorId !== 'ALL' && entry.operator.id !== filters.operatorId) {
      return false;
    }

    // 5. Lọc chỉ xem tác vụ có Ticket ID
    if (filters.hasTicketOnly && !entry.ticketId) {
      return false;
    }

    // 6. Lọc chỉ xem vi phạm Guardrail / Critical
    if (filters.guardrailOnly && entry.severity !== 'CRITICAL' && entry.action !== 'GUARDRAIL_TRIGGERED') {
      return false;
    }

    // 7. Lọc theo Khung thời gian
    if (filters.dateRange !== 'all') {
      const entryTime = new Date(entry.timestamp).getTime();
      const now = new Date('2026-09-11T08:50:00Z').getTime();
      const hoursDiff = (now - entryTime) / (1000 * 60 * 60);

      if (filters.dateRange === 'today' || filters.dateRange === '24h') {
        if (hoursDiff > 24) return false;
      } else if (filters.dateRange === '7d') {
        if (hoursDiff > 24 * 7) return false;
      } else if (filters.dateRange === '30d') {
        if (hoursDiff > 24 * 30) return false;
      }
    }

    return true;
  });

  // Sắp xếp
  return filtered.sort((a, b) => {
    let comp = 0;
    if (filters.sortBy === 'timestamp') {
      comp = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (filters.sortBy === 'severity') {
      const severityWeight: Record<AuditSeverity, number> = {
        CRITICAL: 5,
        SECURITY: 4,
        WARNING: 3,
        NOTICE: 2,
        INFO: 1,
      };
      comp = severityWeight[b.severity] - severityWeight[a.severity];
    } else if (filters.sortBy === 'domain') {
      comp = a.domain.localeCompare(b.domain);
    } else if (filters.sortBy === 'operator') {
      comp = a.operator.name.localeCompare(b.operator.name);
    }

    return filters.sortDirection === 'asc' ? -comp : comp;
  });
}

/**
 * Xuất dữ liệu Sổ cái kiểm toán ra file CSV tải về trình duyệt
 */
export function exportAuditLogsToCsv(logs: AuditLogEntry[]): void {
  const headers = [
    'Audit ID',
    'Thời Gian (ISO)',
    'Phân Hệ',
    'Hành Động',
    'Mức Độ',
    'Mã Ticket',
    'Đối Tượng Tác Động',
    'Lý Do Giải Trình',
    'Người Thao Tác',
    'Vai Trò',
    'Địa Chỉ IP',
    'Mã Băm Kiểm Định (Tamper Hash)',
  ];

  const escapeCsv = (str?: string) => {
    if (!str) return '""';
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = logs.map((log) => [
    escapeCsv(log.id),
    escapeCsv(log.timestamp),
    escapeCsv(log.domain),
    escapeCsv(log.actionLabel),
    escapeCsv(log.severity),
    escapeCsv(log.ticketId || 'N/A'),
    escapeCsv(`${log.targetEntity.type}: ${log.targetEntity.title}`),
    escapeCsv(log.reason),
    escapeCsv(log.operator.name),
    escapeCsv(log.operator.role),
    escapeCsv(log.operator.ipAddress),
    escapeCsv(log.metadata.tamperHash),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SnapVocab_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Xuất dữ liệu Sổ cái kiểm toán ra file JSON tải về trình duyệt
 */
export function exportAuditLogsToJson(logs: AuditLogEntry[]): void {
  const jsonContent = JSON.stringify(logs, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SnapVocab_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
