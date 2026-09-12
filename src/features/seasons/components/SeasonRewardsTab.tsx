import React from 'react';
import {
  SeasonTierRewardMatrix,
  LeagueConfig,
  EconomicForecast,
} from '../../../domains/seasons/types';
import {
  Gift,
  Coins,
  Gem,
  Award,
  Crown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Info,
} from 'lucide-react';

interface SeasonRewardsTabProps {
  rewardMatrices: SeasonTierRewardMatrix[];
  leagues: LeagueConfig[];
  economicForecast: EconomicForecast;
  totalCohorts: number;
}

export const SeasonRewardsTab: React.FC<SeasonRewardsTabProps> = ({
  rewardMatrices,
  leagues,
  economicForecast,
  totalCohorts,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. LiveOps Guardrails & Economic Faucet Banner */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary font-bold text-[11px] flex items-center gap-1">
                <ShieldCheck size={12} />
                LIVEOPS GUARDRAILS COMPLIANCE
              </span>
              <span className="text-xs text-text-muted font-medium">
                design.md §7.3
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-text tracking-tight mt-1">
              Kiểm Soát Trần Thưởng Mùa Giải & Dự Phóng Faucet Tiền Tệ
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Quy chuẩn hệ thống: Trần thưởng tối đa{' '}
              <strong className="text-text">
                ≤ {economicForecast.guardrailLimitCoins} Coins
              </strong>{' '}
              và{' '}
              <strong className="text-text">
                ≤ {economicForecast.guardrailLimitGems} Gems
              </strong>{' '}
              cho mỗi học viên. Cấu hình hiện tại hoàn toàn hợp lệ.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-canvas border border-border text-xs font-mono">
              <span className="text-[10px] text-text-muted block uppercase">
                Tổng Coins Dự Phóng
              </span>
              <div className="flex items-center gap-1.5 font-bold text-text text-sm">
                <Coins size={14} className="text-reward" />
                <span>
                  {(economicForecast.totalEstimatedCoins / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-text-muted font-normal">
                  ({totalCohorts} cohorts)
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas border border-border text-xs font-mono">
              <span className="text-[10px] text-text-muted block uppercase">
                Tổng Gems Dự Phóng
              </span>
              <div className="flex items-center gap-1.5 font-bold text-text text-sm">
                <Gem size={14} className="text-info" />
                <span>
                  {(economicForecast.totalEstimatedGems / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-text-muted font-normal">
                  ({totalCohorts} cohorts)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Faucet Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="p-2.5 rounded-lg bg-canvas border border-border/60">
            <span className="text-[11px] font-semibold text-text flex items-center gap-1.5 mb-1">
              <Crown size={13} className="text-reward" />
              Quán Quân Kim Cương (Top 1)
            </span>
            <span className="text-text-muted block text-[11px]">
              {economicForecast.top1PayoutCoins} Coins + 50 Gems + Danh hiệu đặc biệt
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-canvas border border-border/60">
            <span className="text-[11px] font-semibold text-text flex items-center gap-1.5 mb-1">
              <TrendingUp size={13} className="text-primary" />
              Tổng Thưởng Thăng Hạng (Top 4-5)
            </span>
            <span className="text-text-muted block text-[11px]">
              {economicForecast.promotionPayoutCoins} Coins / cohort (2 vị trí)
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-canvas border border-border/60">
            <span className="text-[11px] font-semibold text-text flex items-center gap-1.5 mb-1">
              <Sparkles size={13} className="text-snapy" />
              Tổng Thưởng Trụ Hạng (Safe Zone)
            </span>
            <span className="text-text-muted block text-[11px]">
              {economicForecast.safePayoutCoins} Coins / cohort (15 vị trí an toàn)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full Reward Matrix Data-Dense Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="p-3.5 bg-canvas border-b border-border flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-text uppercase tracking-wider">
              Ma Trận Phần Thưởng Mùa Giải Chi Tiết Theo 6 Hạng Đấu
            </h4>
            <span className="text-[11px] text-text-muted">
              Phần thưởng tự động chuyển vào hòm thư học viên ngay sau khi chốt mùa giải
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-primary-light text-primary text-[10px] font-bold">
            Idempotent Settlement Key
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas/60 text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
                <th className="py-2.5 px-3.5">Hạng Đấu</th>
                <th className="py-2.5 px-3">Quán Quân (Top 1)</th>
                <th className="py-2.5 px-3">Top 2 – 3 (Bạc / Đồng)</th>
                <th className="py-2.5 px-3">Top 4 – 5 (Thăng Hạng)</th>
                <th className="py-2.5 px-3">Hạng 6 – 20 (An Toàn)</th>
                <th className="py-2.5 px-3.5">Hạng 21 – 30 (Rớt Hạng)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {rewardMatrices.map((matrix) => {
                const league = leagues.find((l) => l.id === matrix.leagueId);
                if (!league) return null;

                return (
                  <tr
                    key={matrix.leagueId}
                    className="hover:bg-surface-subtle/80 transition-colors"
                  >
                    {/* League Info */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{league.icon}</span>
                        <div>
                          <div className="font-extrabold text-text">
                            {league.name}
                          </div>
                          <div className="text-[10px] font-mono text-text-muted">
                            {league.totalCohortsCount} cohorts
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Top 1 */}
                    <td className="py-3 px-3">
                      <div className="p-2 rounded-lg bg-reward-light/50 border border-reward/30 space-y-1">
                        <div className="flex items-center gap-2 font-mono font-bold text-text text-xs">
                          <span className="flex items-center gap-1 text-reward-hover">
                            <Coins size={13} />
                            {matrix.top1Reward.coins}
                          </span>
                          <span className="flex items-center gap-1 text-info">
                            <Gem size={13} />
                            {matrix.top1Reward.gems}
                          </span>
                        </div>
                        {matrix.top1Reward.titleName && (
                          <div className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 inline-block">
                            ★ {matrix.top1Reward.titleName}
                          </div>
                        )}
                        {matrix.top1Reward.badgeName && (
                          <div className="text-[10px] text-text-muted truncate block">
                            {matrix.top1Reward.badgeName}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Top 2 - 3 */}
                    <td className="py-3 px-3">
                      <div className="space-y-1 font-mono">
                        <div className="flex items-center gap-2 font-bold text-text text-xs">
                          <span className="flex items-center gap-1 text-reward-hover">
                            <Coins size={13} />
                            {matrix.top2_3Reward.coins}
                          </span>
                          <span className="flex items-center gap-1 text-info">
                            <Gem size={13} />
                            {matrix.top2_3Reward.gems}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-muted block">
                          + Thăng Hạng Kế Tiếp
                        </span>
                      </div>
                    </td>

                    {/* Top 4 - 5 */}
                    <td className="py-3 px-3">
                      <div className="space-y-1 font-mono">
                        <div className="flex items-center gap-2 font-bold text-text text-xs">
                          <span className="flex items-center gap-1 text-reward-hover">
                            <Coins size={13} />
                            {matrix.top4_5Reward.coins}
                          </span>
                          <span className="flex items-center gap-1 text-info">
                            <Gem size={13} />
                            {matrix.top4_5Reward.gems}
                          </span>
                        </div>
                        <span className="text-[10px] text-primary font-semibold block">
                          + Vé Thăng Hạng
                        </span>
                      </div>
                    </td>

                    {/* Safe Zone */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5 font-mono">
                        <span className="flex items-center gap-1 font-bold text-text text-xs">
                          <Coins size={13} className="text-reward" />
                          {matrix.safeZoneReward.coins}
                        </span>
                        <span className="text-[10px] text-text-muted block">
                          Trụ hạng an toàn
                        </span>
                      </div>
                    </td>

                    {/* Demotion Zone */}
                    <td className="py-3 px-3.5">
                      <div className="space-y-0.5 font-mono text-text-muted">
                        <span className="flex items-center gap-1 text-xs">
                          <Coins size={12} />
                          {matrix.demotionZoneReward.coins}
                        </span>
                        <span className="text-[10px] block">Quà an ủi tuần</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
