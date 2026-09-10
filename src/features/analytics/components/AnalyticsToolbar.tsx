import React from 'react';
import { AnalyticsFilter, AnalyticsTimeRange, LearnerSegment } from '../../../domains/analytics/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import { RotateCw, Download, Filter, Calendar } from 'lucide-react';

interface AnalyticsToolbarProps {
  filter: AnalyticsFilter;
  onFilterChange: (newFilter: AnalyticsFilter) => void;
  onExportCsv: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  filter,
  onFilterChange,
  onExportCsv,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  const timeRangeOptions: { value: AnalyticsTimeRange; label: string }[] = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày gần nhất' },
    { value: '90d', label: 'Quý này (90 ngày)' },
    { value: '12m', label: '12 tháng qua' },
  ];

  const cefrOptions: { value: CEFRLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả trình độ (A1 - C2)' },
    { value: 'A1', label: 'A1 · Sơ cấp cơ bản' },
    { value: 'A2', label: 'A2 · Sơ cấp nâng cao' },
    { value: 'B1', label: 'B1 · Trung cấp' },
    { value: 'B2', label: 'B2 · Trung cấp trên' },
    { value: 'C1', label: 'C1 · Cao cấp' },
    { value: 'C2', label: 'C2 · Thành thạo' },
  ];

  const segmentOptions: { value: LearnerSegment; label: string }[] = [
    { value: 'all', label: 'Toàn bộ học viên (86.4k MAU)' },
    { value: 'streak-active', label: 'Học viên giữ chuỗi (Streak ≥7 ngày)' },
    { value: 'new-learners', label: 'Học viên mới (≤14 ngày)' },
    { value: 'at-risk', label: 'Cảnh báo nguy cơ rời bỏ (At-risk)' },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-3.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 select-none">
      {/* Left: Dimension Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text">
          <Calendar size={13} className="text-text-muted" />
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Thời gian:</span>
          <select
            value={filter.timeRange}
            onChange={(e) =>
              onFilterChange({ ...filter, timeRange: e.target.value as AnalyticsTimeRange })
            }
            className="bg-transparent text-xs font-semibold text-text focus:outline-none cursor-pointer"
          >
            {timeRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* CEFR Level Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text">
          <Filter size={13} className="text-text-muted" />
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">CEFR:</span>
          <select
            value={filter.cefrLevel}
            onChange={(e) =>
              onFilterChange({ ...filter, cefrLevel: e.target.value as CEFRLevel | 'all' })
            }
            className="bg-transparent text-xs font-semibold text-text focus:outline-none cursor-pointer"
          >
            {cefrOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Segment Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Phân khúc:</span>
          <select
            value={filter.segment}
            onChange={(e) =>
              onFilterChange({ ...filter, segment: e.target.value as LearnerSegment })
            }
            className="bg-transparent text-xs font-semibold text-text focus:outline-none cursor-pointer"
          >
            {segmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-2.5 self-end lg:self-auto">
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-text-muted bg-surface-subtle px-2 py-1 rounded-lg border border-border/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cập nhật: {lastUpdated}</span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className={`p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all shadow-xs ${
            isRefreshing ? 'animate-spin text-primary' : ''
          }`}
          title="Làm mới dữ liệu thống kê"
        >
          <RotateCw size={14} />
        </button>

        <button
          type="button"
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text hover:text-primary transition-all shadow-xs"
          title="Xuất bảng dữ liệu CSV"
        >
          <Download size={13} className="text-primary" />
          <span>Xuất Báo Cáo CSV</span>
        </button>
      </div>
    </div>
  );
};
