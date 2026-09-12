import React from 'react';
import { LearnersRibbonMetrics } from '../../../domains/learners/types';
import {
  Users,
  Flame,
  BookOpen,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface LearnersMetricsRibbonProps {
  metrics: LearnersRibbonMetrics;
  onJumpToStreakDesk?: () => void;
}

export const LearnersMetricsRibbon: React.FC<LearnersMetricsRibbonProps> = ({
  metrics,
  onJumpToStreakDesk,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. Tổng Học Viên & Tương Tác Hôm Nay */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Tổng Học Viên & DAU
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <Users size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            {metrics.totalLearners.toLocaleString('vi-VN')}
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Hoạt động hôm nay: <strong className="text-primary font-bold">{metrics.activeLearnersToday}</strong> ({metrics.dauPercentage}% DAU)
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-primary font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Active Session Live
          </span>
          <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border/60">
            Role: Learner
          </span>
        </div>
      </div>

      {/* 2. Chuỗi Streak & Vận Hành Giữ Chân */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Duy Trì Chuỗi Streak
          </span>
          <div className="w-7 h-7 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
            <Flame size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            {metrics.activeStreaksCount} <span className="text-xs font-semibold text-text-muted">đang giữ streak</span>
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Chuỗi trung bình: <strong className="text-snapy font-bold">{metrics.avgStreakDays} ngày</strong>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          {metrics.streakRiskCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-snapy font-semibold text-[10px]">
              <Clock size={11} />
              {metrics.streakRiskCount} người chưa học (nguy cơ)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary font-semibold text-[10px]">
              <ShieldCheck size={11} />
              Toàn bộ chuỗi an toàn
            </span>
          )}
          <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border/60">
            Snapy Flame
          </span>
        </div>
      </div>

      {/* 3. Sức Khỏe Trí Nhớ & Thẻ FSRS Mastered */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Trí Nhớ FSRS & Mastered
          </span>
          <div className="w-7 h-7 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20">
            <BookOpen size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            {metrics.totalCardsMastered.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-text-muted">thẻ thuộc</span>
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Tỷ lệ recall thành công: <strong className="text-info font-bold">{metrics.avgRetentionRate}%</strong>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-info font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            FSRS Spaced Repetition
          </span>
          <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border/60">
            Mature Cards
          </span>
        </div>
      </div>

      {/* 4. LiveOps Support Desk & Khóa Tài Khoản */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            LiveOps Support & Rủi Ro
          </span>
          <div className="w-7 h-7 rounded-lg bg-danger-light text-danger flex items-center justify-center border border-danger/20">
            <AlertTriangle size={15} />
          </div>
        </div>
        <div className="truncate">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-text tracking-tight">
              {metrics.pendingStreakAppeals}
            </span>
            <span className="text-xs font-semibold text-danger">ticket khôi phục</span>
          </div>
          <span className="text-[11px] font-medium text-text-muted">
            Tài khoản khóa vi phạm: <strong className="text-danger font-bold">{metrics.suspendedAccountsCount}</strong>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={onJumpToStreakDesk}
            className="inline-flex items-center gap-1 text-danger hover:underline font-bold text-[10px] cursor-pointer"
          >
            <span>Xử lý ticket Streak</span>
            <ArrowUpRight size={11} />
          </button>
          <span className="text-[10px] text-danger font-mono bg-danger-light px-1.5 py-0.5 rounded border border-danger/20 font-semibold">
            P1 Queue
          </span>
        </div>
      </div>
    </div>
  );
};
