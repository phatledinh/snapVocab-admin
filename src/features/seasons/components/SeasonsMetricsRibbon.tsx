import React from 'react';
import { SeasonsRibbonMetrics } from '../../../domains/seasons/types';
import {
  Calendar,
  Users,
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
  Coins,
  Gem,
} from 'lucide-react';

interface SeasonsMetricsRibbonProps {
  metrics: SeasonsRibbonMetrics;
  onJumpToAnomaly?: () => void;
}

export const SeasonsMetricsRibbon: React.FC<SeasonsMetricsRibbonProps> = ({
  metrics,
  onJumpToAnomaly,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. Mùa giải hiện tại & Đếm ngược */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Mùa Giải Hiện Tại
          </span>
          <div className="w-7 h-7 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
            <Calendar size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-base font-extrabold text-text tracking-tight truncate block">
            {metrics.activeSeasonName}
          </span>
          <span className="text-[11px] font-mono font-semibold text-snapy">
            {metrics.activeSeasonCode}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Active
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-text-muted text-[10px] bg-canvas px-1.5 py-0.5 rounded border border-border">
            <Clock size={11} className="text-info" />
            {metrics.timeRemainingFormatted}
          </span>
        </div>
      </div>

      {/* 2. Người Học Tham Gia & Cohorts */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Học Viên Tham Gia (Tuần)
          </span>
          <div className="w-7 h-7 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20">
            <Users size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalActiveParticipants.toLocaleString('vi-VN')}
          </span>
          <span className="text-[11px] text-text-muted font-medium">học viên</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-muted">
            <span className="font-bold text-text font-mono">
              {metrics.totalActiveCohorts}
            </span>{' '}
            phòng đấu (Cohorts)
          </span>
          <span className="px-1.5 py-0.5 rounded bg-info-light text-info font-bold text-[10px]">
            30 users / cohort
          </span>
        </div>
      </div>

      {/* 3. Tỷ Lệ Tranh Đua Thăng Hạng */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Tranh Đua Thăng Hạng
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <Flame size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.promotionContentionRate}%
          </span>
          <span className="text-[11px] text-primary font-bold">bám đuổi Top 5</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Dự phóng Payout:</span>
          <span className="font-semibold text-text flex items-center gap-1 font-mono">
            <Coins size={12} className="text-reward" />
            {(metrics.totalCoinsProjected / 1000).toFixed(1)}k
            <span className="text-border-strong">·</span>
            <Gem size={12} className="text-info" />
            {(metrics.totalGemsProjected / 1000).toFixed(1)}k
          </span>
        </div>
      </div>

      {/* 4. Cảnh Báo Anomaly / Chống Gian Lận */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Kiểm Soát Gian Lận (XP)
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              metrics.pendingAnomalyCount > 0
                ? 'bg-danger-light text-danger border-danger/20 animate-pulse'
                : 'bg-primary-light text-primary border-primary/20'
            }`}
          >
            <AlertTriangle size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.pendingAnomalyCount}
          </span>
          <span className="text-[11px] text-text-muted font-medium">
            tài khoản nghi vấn
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          {metrics.pendingAnomalyCount > 0 ? (
            <>
              <span className="text-danger font-semibold">Tăng tốc bất thường</span>
              <button
                type="button"
                onClick={onJumpToAnomaly}
                className="px-2 py-0.5 rounded bg-danger-light text-danger font-bold text-[10px] hover:bg-danger/20 transition-all"
              >
                Xử lý ngay →
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary font-semibold">
              <Sparkles size={12} /> Hệ thống sạch sẽ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
