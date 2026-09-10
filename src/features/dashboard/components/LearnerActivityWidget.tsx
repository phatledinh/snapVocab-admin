import React from 'react';
import { LearnerActivityProjection, DashboardTimeRange } from '../../../domains/dashboard/types';
import { AreaChart } from '../../../components/charts';
import { Users, TrendingUp, Zap, Calendar } from 'lucide-react';

interface LearnerActivityWidgetProps {
  activity: LearnerActivityProjection;
  timeRange: DashboardTimeRange;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  onNavigate?: (navId: string) => void;
}

export const LearnerActivityWidget: React.FC<LearnerActivityWidgetProps> = ({
  activity,
  timeRange,
  onTimeRangeChange,
  onNavigate,
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between select-none">
      {/* Header & Filter Controls */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-light text-primary flex items-center justify-center">
              <Users size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text">Hoạt động Người học & Học tập SRS</h3>
              <p className="text-[10px] text-text-muted">
                Lượng người dùng hoạt động (DAU/MAU) và lượt ôn tập Flashcard
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-surface-subtle border border-border rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => onTimeRangeChange('today')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                timeRange === 'today'
                  ? 'bg-surface text-text font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => onTimeRangeChange('7d')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-surface text-text font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              7 ngày
            </button>
            <button
              type="button"
              onClick={() => onTimeRangeChange('30d')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-surface text-text font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              30 ngày
            </button>
          </div>
        </div>

        {/* 4 Compact Stat Pills */}
        <div className="grid grid-cols-4 gap-2 my-3">
          <div className="bg-surface-subtle/70 border border-border/80 rounded-lg p-2">
            <div className="text-[10px] text-text-muted">DAU hiện tại</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5">
              {activity.currentDau.toLocaleString('vi-VN')}
            </div>
          </div>

          <div className="bg-surface-subtle/70 border border-border/80 rounded-lg p-2">
            <div className="text-[10px] text-text-muted">MAU tháng này</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5">
              {(activity.currentMau / 1000).toFixed(1)}k
            </div>
          </div>

          <div className="bg-surface-subtle/70 border border-border/80 rounded-lg p-2">
            <div className="text-[10px] text-text-muted">Retention 7-Day</div>
            <div className="text-sm font-bold font-mono text-primary mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={12} />
              {activity.retention7dRate}%
            </div>
          </div>

          <div className="bg-surface-subtle/70 border border-border/80 rounded-lg p-2">
            <div className="text-[10px] text-text-muted">Flashcard SRS</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5 flex items-center gap-0.5">
              <Zap size={12} className="text-reward" />
              {(activity.flashcardsReviewedToday / 1000).toFixed(1)}k
            </div>
          </div>
        </div>

        {/* Abstracted Area Chart */}
        <div className="mt-1">
          <AreaChart
            data={activity.trendSeries}
            height={160}
            color="#58CC02"
            fillOpacity={0.12}
            showGrid={true}
            showDots={true}
          />
        </div>
      </div>

      {/* Footer Deep Link */}
      <div className="mt-2 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Thời gian học cao điểm: 20:00 - 22:30 hàng ngày</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('learners')}
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Quản lý người học →
        </button>
      </div>
    </div>
  );
};
