import React from 'react';
import {
  AuditFilterState,
  AuditDomainCategory,
  AuditSeverity,
  AuditDateRange,
} from '../../../domains/audit/types';
import { AUDIT_OPERATORS } from '../../../domains/audit/mock-data';
import {
  Search,
  Filter,
  X,
  Download,
  Ticket,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface AuditFilterToolbarProps {
  filterState: AuditFilterState;
  onFilterChange: (updater: (prev: AuditFilterState) => AuditFilterState) => void;
  onResetFilters: () => void;
  onOpenExportModal: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const AuditFilterToolbar: React.FC<AuditFilterToolbarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  onOpenExportModal,
  totalFilteredCount,
  totalCount,
}) => {
  const isFiltered =
    filterState.searchQuery.trim() !== '' ||
    filterState.domain !== 'ALL' ||
    filterState.severity !== 'ALL' ||
    filterState.operatorId !== 'ALL' ||
    filterState.hasTicketOnly ||
    filterState.guardrailOnly ||
    filterState.dateRange !== 'all';

  return (
    <div className="bg-surface border border-border rounded-xl p-3 shadow-card space-y-2.5 select-none">
      {/* Row 1: Search Bar + Quick Filters + Export Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) =>
              onFilterChange((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Tìm theo Ticket ID (TK-XXXX), Admin, từ vựng, học viên, lý do, IP..."
            className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-border bg-surface text-xs text-text placeholder:text-text-muted/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {filterState.searchQuery && (
            <button
              type="button"
              onClick={() =>
                onFilterChange((prev) => ({ ...prev, searchQuery: '' }))
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ticket only toggle */}
          <button
            type="button"
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                hasTicketOnly: !prev.hasTicketOnly,
              }))
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterState.hasTicketOnly
                ? 'bg-primary-light text-primary border-primary/30 shadow-xs'
                : 'bg-surface hover:bg-surface-subtle text-text-muted border-border'
            }`}
          >
            <Ticket size={13} />
            <span>Có Ticket ID</span>
          </button>

          {/* Guardrails only toggle */}
          <button
            type="button"
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                guardrailOnly: !prev.guardrailOnly,
              }))
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterState.guardrailOnly
                ? 'bg-danger-light text-danger border-danger/30 shadow-xs'
                : 'bg-surface hover:bg-surface-subtle text-text-muted border-border'
            }`}
          >
            <AlertTriangle size={13} />
            <span>Chỉ Vi Phạm / Guardrail</span>
          </button>

          {/* Export CTA */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle text-text text-xs font-bold border border-border shadow-xs hover:border-primary/40 transition-all"
          >
            <Download size={13} className="text-primary" />
            <span>Xuất Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Row 2: Secondary Dropdown Filters + Date Range Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/60">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Subsystem / Domain */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-muted font-medium">Phân hệ:</span>
            <select
              value={filterState.domain}
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  domain: e.target.value as 'ALL' | AuditDomainCategory,
                }))
              }
              className="px-2 py-1 rounded-md border border-border bg-surface text-xs font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL">Tất cả phân hệ</option>
              <option value="CONTENT_STUDIO">Content Studio</option>
              <option value="AI_SCAN">AI Scan Engine</option>
              <option value="LIVEOPS_ECONOMY">LiveOps & Kinh tế</option>
              <option value="LEARNERS_PEOPLE">Học viên & Tài khoản</option>
              <option value="ISSUE_REPORTS">Báo cáo Sự cố</option>
              <option value="SYSTEM_SECURITY">Bảo mật & Hệ thống</option>
            </select>
          </div>

          {/* Severity */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-muted font-medium">Mức độ:</span>
            <select
              value={filterState.severity}
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  severity: e.target.value as 'ALL' | AuditSeverity,
                }))
              }
              className="px-2 py-1 rounded-md border border-border bg-surface text-xs font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="INFO">Info (Thông tin)</option>
              <option value="NOTICE">Notice (Lưu ý)</option>
              <option value="WARNING">Warning (Cảnh báo)</option>
              <option value="CRITICAL">Critical (Khẩn cấp)</option>
              <option value="SECURITY">Security (An ninh)</option>
            </select>
          </div>

          {/* Operator */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-muted font-medium">Operator:</span>
            <select
              value={filterState.operatorId}
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  operatorId: e.target.value,
                }))
              }
              className="px-2 py-1 rounded-md border border-border bg-surface text-xs font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL">Tất cả người thao tác</option>
              {Object.values(AUDIT_OPERATORS).map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name} ({op.role})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] text-danger hover:underline font-bold px-1.5 py-0.5"
            >
              <RotateCcw size={11} />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* Date range pills & counts */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-0.5 bg-surface-subtle border border-border rounded-lg text-[11px]">
            {(['today', '24h', '7d', 'all'] as AuditDateRange[]).map((range) => {
              const labelMap: Record<AuditDateRange, string> = {
                today: 'Hôm nay',
                '24h': '24h',
                '7d': '7 ngày',
                '30d': '30 ngày',
                all: 'Tất cả',
              };
              const isSelected = filterState.dateRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() =>
                    onFilterChange((prev) => ({ ...prev, dateRange: range }))
                  }
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    isSelected
                      ? 'bg-surface text-text shadow-xs font-bold border border-border/50'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {labelMap[range]}
                </button>
              );
            })}
          </div>

          {/* Counts pill */}
          <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded bg-surface-subtle border border-border">
            <b className="text-text font-bold">{totalFilteredCount}</b> / {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
};
