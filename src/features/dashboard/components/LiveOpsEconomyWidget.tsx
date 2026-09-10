import React from 'react';
import { LiveOpsProjection } from '../../../domains/dashboard/types';
import { ShoppingBag, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface LiveOpsEconomyWidgetProps {
  liveops: LiveOpsProjection;
  onNavigate?: (navId: string) => void;
}

export const LiveOpsEconomyWidget: React.FC<LiveOpsEconomyWidgetProps> = ({
  liveops,
  onNavigate,
}) => {
  const { coins, gems, streak, guardrails } = liveops;
  const coinNet = coins.faucet - coins.sink;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-reward-light text-[#9A7000] flex items-center justify-center">
              <ShoppingBag size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text">LiveOps Console & Sức Khỏe Kinh Tế Ảo</h3>
              <p className="text-[10px] text-text-muted">
                Cân đối dòng tiền tệ (Coins/Gems), Chuỗi Streak và Hàng rào An toàn
              </p>
            </div>
          </div>

          {/* Guardrail status indicator */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <ShieldCheck size={12} />
            <span>Guardrails: {guardrails.violations} Vi phạm</span>
          </div>
        </div>

        {/* Currency Faucet vs Sink Grid */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Coins balance */}
          <div className="p-3 rounded-lg bg-surface-subtle border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <span className="w-4 h-4 rounded-full bg-reward/30 text-[#9A7000] flex items-center justify-center text-[10px]">
                  🟡
                </span>
                <span>Coins Vận Hành</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600">
                +{(coinNet / 1000).toFixed(0)}k ròng
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Phát hành (Faucet):</span>
                <span className="font-mono font-semibold text-text">
                  +{(coins.faucet / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Tiêu thụ Shop (Sink):</span>
                <span className="font-mono font-semibold text-text">
                  -{(coins.sink / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Faucet/Sink ratio bar */}
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden flex mt-1">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(coins.faucet / (coins.faucet + coins.sink)) * 100}%` }}
                  title="Tỷ lệ phát hành"
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${(coins.sink / (coins.faucet + coins.sink)) * 100}%` }}
                  title="Tỷ lệ tiêu thụ"
                />
              </div>
            </div>
          </div>

          {/* Gems balance */}
          <div className="p-3 rounded-lg bg-surface-subtle border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <span className="w-4 h-4 rounded-full bg-info/30 text-info flex items-center justify-center text-[10px]">
                  💎
                </span>
                <span>Gems Cao Cấp</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-info">
                +{(gems.faucet / 1000).toFixed(1)}k / -{(gems.sink / 1000).toFixed(1)}k
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Thưởng tuần & Milestone:</span>
                <span className="font-mono font-semibold text-text">
                  +{gems.faucet.toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Đổi vật phẩm Streak Freeze:</span>
                <span className="font-mono font-semibold text-text">
                  -{gems.sink.toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden flex mt-1">
                <div
                  className="bg-info h-full"
                  style={{ width: `${(gems.faucet / (gems.faucet + gems.sink)) * 100}%` }}
                />
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: `${(gems.sink / (gems.faucet + gems.sink)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak Monitor & Support Tools */}
        <div className="p-2.5 rounded-lg bg-snapy-light/60 border border-snapy/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-snapy-light border border-snapy/30 text-snapy flex items-center justify-center">
              <Flame size={16} />
            </div>
            <div className="text-xs">
              <div className="font-bold text-text flex items-center gap-2">
                <span>Streak TB: {streak.avgDays} ngày</span>
                <span className="text-[10px] text-text-muted font-normal">
                  ({streak.over7Days.toLocaleString('vi-VN')} users &gt; 7 ngày)
                </span>
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {streak.recoveryPending > 0
                  ? `Có ${streak.recoveryPending} yêu cầu khôi phục chuỗi do lỗi kỹ thuật cần phê duyệt`
                  : 'Không có yêu cầu khôi phục streak nào đang chờ'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('learners')}
            className="px-2.5 py-1 rounded-md bg-surface text-text font-bold text-xs border border-border hover:bg-surface-subtle transition-all shrink-0"
          >
            Mở Streak Tool
          </button>
        </div>
      </div>

      {/* Footer Deep Link */}
      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <span>Giới hạn trần thưởng: 1,000 Coins / 100 Gems mỗi nhiệm vụ</span>
        <button
          type="button"
          onClick={() => onNavigate?.('shop')}
          className="text-xs font-semibold text-[#9A7000] hover:underline flex items-center gap-1"
        >
          <span>Quản lý Cửa hàng & Nhiệm vụ</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
