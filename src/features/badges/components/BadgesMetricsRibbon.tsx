import React from 'react';
import { BadgesRibbonMetrics } from '../../../domains/badges/types';
import {
  Award,
  Crown,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Coins,
} from 'lucide-react';

interface BadgesMetricsRibbonProps {
  metrics: BadgesRibbonMetrics;
}

export const BadgesMetricsRibbon: React.FC<BadgesMetricsRibbonProps> = ({
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. Badges Defined */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Tổng Huy Hiệu (Badges)
          </span>
          <div className="w-7 h-7 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
            <Award size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalBadges}
          </span>
          <span className="text-[11px] text-text-muted font-medium">huy hiệu</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {metrics.activeBadgesCount} Active
          </span>
          <span className="text-border-strong">·</span>
          <span className="inline-flex items-center gap-1 text-purple-600 font-medium">
            {metrics.secretBadgesCount} Bí mật (???)
          </span>
          {metrics.archivedBadgesCount > 0 && (
            <>
              <span className="text-border-strong">·</span>
              <span className="text-text-muted">{metrics.archivedBadgesCount} Lưu trữ</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Honorary Titles */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Danh Hiệu & Profile Flair
          </span>
          <div className="w-7 h-7 rounded-lg bg-reward-light text-reward-hover flex items-center justify-center border border-reward/20">
            <Crown size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalTitles}
          </span>
          <span className="text-[11px] text-text-muted font-medium">danh xưng</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-muted">
            <span className="font-bold text-text font-mono">
              {metrics.activeWearersCount.toLocaleString('vi-VN')}
            </span>{' '}
            người đang đeo
          </span>
          <span className="px-1.5 py-0.5 rounded bg-reward-light text-reward-hover font-bold text-[10px] border border-reward/20">
            {metrics.avgEquipRate}% trang bị
          </span>
        </div>
      </div>

      {/* 3. Unlocks Velocity */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Tốc Độ Mở Khóa (24h)
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <TrendingUp size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
            {metrics.unlocksVelocity24h.toLocaleString('vi-VN')}
          </span>
          <span className="text-[11px] text-primary font-bold">
            +{metrics.unlocksVelocityTrend}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Kinh tế Faucet:</span>
          <span className="font-semibold text-text flex items-center gap-1 font-mono">
            <Coins size={12} className="text-reward" />
            {(metrics.totalCoinsMinted / 1000).toFixed(1)}k Coins
          </span>
        </div>
      </div>

      {/* 4. Rarest Badge */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Huy Hiệu Quý Tộc Nhất
          </span>
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Sparkles size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-sm font-extrabold text-text tracking-tight">
            {metrics.rarestBadgeName}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-muted">Tỷ lệ mở khóa:</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] font-mono border border-purple-200">
            {metrics.rarestBadgeRate}% học viên
          </span>
        </div>
      </div>
    </div>
  );
};
