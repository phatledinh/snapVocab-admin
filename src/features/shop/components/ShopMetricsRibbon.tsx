import React from 'react';
import { ShopEconomyRibbonMetrics } from '../../../domains/economy/types';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Award,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface ShopMetricsRibbonProps {
  metrics: ShopEconomyRibbonMetrics;
}

export const ShopMetricsRibbon: React.FC<ShopMetricsRibbonProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {/* 1. Tổng Sink Coins & Gems */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Tiêu Thụ Shop (Sink)
          </span>
          <div className="w-6 h-6 rounded-md bg-reward-light text-[#9A7000] flex items-center justify-center">
            <ShoppingBag size={14} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-text flex items-baseline gap-1">
            <span>{(metrics.totalSinkCoins / 1000).toFixed(0)}k</span>
            <span className="text-xs font-normal text-text-muted">Coins</span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5 font-mono">
            <span>và</span>
            <strong className="text-info font-bold">
              {(metrics.totalSinkGems / 1000).toFixed(1)}k Gems
            </strong>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-emerald-600 font-medium flex items-center gap-1">
          <span>↑ 12.4%</span>
          <span className="text-text-muted">so với tuần trước</span>
        </div>
      </div>

      {/* 2. Tỷ Lệ Faucet/Sink */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Tỷ Lệ Bơm / Hút
          </span>
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp size={14} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-[#9A7000]">
            {metrics.faucetSinkRatio.toFixed(2)}x
          </div>
          <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Thặng dư nhẹ (1.44x)</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-text-muted">
          <span>Ngưỡng chuẩn: 1.10x – 1.25x</span>
        </div>
      </div>

      {/* 3. Danh Mục Mặt Hàng Mở Bán */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Mặt Hàng Mở Bán
          </span>
          <div className="w-6 h-6 rounded-md bg-primary-light text-primary flex items-center justify-center">
            <Package size={14} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-text flex items-baseline gap-1">
            <span>{metrics.activeItemsCount + metrics.flashSaleItemsCount}</span>
            <span className="text-xs font-normal text-text-muted">Item</span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
            <span className="text-primary font-semibold">{metrics.activeItemsCount} Active</span>
            <span>·</span>
            <span className="text-snapy font-semibold">{metrics.flashSaleItemsCount} Sale</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-text-muted font-mono">
          <span>{metrics.draftItemsCount} bản nháp đang hoàn thiện</span>
        </div>
      </div>

      {/* 4. Mặt Hàng Bán Chạy Nhất (Top Sink) */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Top Sink Item
          </span>
          <div className="w-6 h-6 rounded-md bg-snapy-light text-snapy flex items-center justify-center">
            <Award size={14} />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-text truncate" title={metrics.topSinkItemName}>
            Streak Freeze
          </div>
          <div className="text-[11px] font-mono text-[#9A7000] font-semibold mt-0.5">
            {(metrics.topSinkItemVolume / 1000).toFixed(0)}k Coins hút về
          </div>
        </div>
        <div className="mt-2 text-[10px] text-text-muted">
          <span>Chiếm 48.0% tổng doanh thu</span>
        </div>
      </div>

      {/* 5. Hàng Rào Guardrails */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Hàng Rào An Toàn
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={14} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-emerald-600 flex items-center gap-1.5">
            <span>Healthy</span>
          </div>
          <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-text">{metrics.guardrailsViolations} Vi phạm</span>
            <span>· 0 Bị chặn</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-text-muted">
          <span>Trần: 1,000 Coins / 100 Gems</span>
        </div>
      </div>

      {/* 6. Giao Dịch 24h & Thành Công */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Sổ Cái Giao Dịch 24h
          </span>
          <div className="w-6 h-6 rounded-md bg-info-light text-info flex items-center justify-center">
            <Activity size={14} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-text">
            {metrics.totalTransactions24h.toLocaleString('vi-VN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <span>{metrics.transactionSuccessRate.toFixed(1)}% Thành công</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-text-muted">
          <span>0 Phát hiện gian lận</span>
        </div>
      </div>
    </div>
  );
};
