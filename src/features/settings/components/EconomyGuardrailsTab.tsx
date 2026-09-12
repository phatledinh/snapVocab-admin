import React from 'react';
import {
  ShieldAlert,
  Coins,
  Flame,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { EconomyGuardrailsConfig } from '../../../domains/settings/types';

interface EconomyGuardrailsTabProps {
  config: EconomyGuardrailsConfig;
  onChange: (updated: Partial<EconomyGuardrailsConfig>) => void;
}

export const EconomyGuardrailsTab: React.FC<EconomyGuardrailsTabProps> = ({ config, onChange }) => {
  const isCoinCapViolated = config.maxMissionCoinRewardCap > 1000;
  const isGemCapViolated = config.maxMissionGemRewardCap > 100;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-reward/15 via-reward/5 to-transparent border border-reward/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-reward text-neutral-900 flex items-center justify-center shadow-md shadow-reward/25 shrink-0 font-black">
            <Coins size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-text tracking-tight">
                Hàng Rào An Toàn Kinh Tế Ảo (LiveOps Economy Guardrails)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-reward-light text-neutral-800 border border-reward/40">
                design.md mục 7.3
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Thiết lập trần thưởng chống lạm phát Coins/Gems, quy tắc can thiệp chuỗi Streak và lịch trình mùa giải Leaderboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface/90 px-3.5 py-2 rounded-xl border border-reward/30 shadow-xs text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Trần Coins nhiệm vụ</span>
            <span className={`font-bold ${isCoinCapViolated ? 'text-amber-600' : 'text-text'}`}>
              {config.maxMissionCoinRewardCap} Coins {isCoinCapViolated && '⚠️'}
            </span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Trần Gems nhiệm vụ</span>
            <span className={`font-bold ${isGemCapViolated ? 'text-amber-600' : 'text-text'}`}>
              {config.maxMissionGemRewardCap} Gems {isGemCapViolated && '⚠️'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Mission Reward Caps & Domain Validation */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-reward-hover" />
              <h3 className="font-bold text-sm text-text">Trần Thưởng Nhiệm Vụ (Mission Caps)</h3>
            </div>
            <span className="text-[11px] font-mono text-reward-hover font-bold">Domain Validation</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Coins Cap */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-text">
                  Trần Thưởng Coins Tối Đa / Nhiệm Vụ
                </label>
                <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                  isCoinCapViolated
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-reward-light text-neutral-800 border-reward/30'
                }`}>
                  {config.maxMissionCoinRewardCap} Coins
                </span>
              </div>
              <input
                type="number"
                min={100}
                max={5000}
                step={50}
                value={config.maxMissionCoinRewardCap}
                onChange={(e) => onChange({ maxMissionCoinRewardCap: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-reward font-bold text-xs"
              />
              {isCoinCapViolated ? (
                <div className="mt-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Vượt quá trần <strong>1,000 Coins</strong> quy định tại <code>design.md mục 7.3</code>.
                    Sẽ bắt buộc Super Admin xác nhận trách nhiệm khi lưu cấu hình.
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Giới hạn mức thưởng an toàn tối đa cho mỗi nhiệm vụ hằng ngày hoặc thử thách tuần.
                </span>
              )}
            </div>

            {/* Gems Cap */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-text">
                  Trần Thưởng Gems Tối Đa / Nhiệm Vụ
                </label>
                <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                  isGemCapViolated
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-reward-light text-neutral-800 border-reward/30'
                }`}>
                  {config.maxMissionGemRewardCap} Gems
                </span>
              </div>
              <input
                type="number"
                min={5}
                max={500}
                step={5}
                value={config.maxMissionGemRewardCap}
                onChange={(e) => onChange({ maxMissionGemRewardCap: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-reward font-bold text-xs"
              />
              {isGemCapViolated ? (
                <div className="mt-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Vượt quá trần <strong>100 Gems</strong>. Gems liên quan trực tiếp đến doanh thu IAP (In-App Purchase).
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Trần tối đa cho phép gán trong Quest Builder.
                </span>
              )}
            </div>

            {/* Super Admin Override Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border">
              <div>
                <div className="font-semibold text-text">Yêu Cầu Super Admin Khi Vượt Trần</div>
                <div className="text-[11px] text-neutral-400">
                  Chặn LiveOps Operator lưu sự kiện nếu vượt quá ngưỡng trần mà không có Super Admin bảo lãnh.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.superAdminOverrideRequired}
                onChange={(e) => onChange({ superAdminOverrideRequired: e.target.checked })}
                className="w-4 h-4 rounded text-reward focus:ring-reward"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Streak Policy & Recovery Tool */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-snapy" />
              <h3 className="font-bold text-sm text-text">Chính Sách Chuỗi Học (Streak Guardrails)</h3>
            </div>
            <span className="text-[11px] font-mono text-snapy font-bold">Mascot Snapy</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Giá Đóng Băng Streak (Streak Freeze)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    step={10}
                    value={config.streakFreezeCostCoins}
                    onChange={(e) => onChange({ streakFreezeCostCoins: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-snapy font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">Coins</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Giá niêm yết trong Shop.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Khôi Phục Streak Tối Đa / Tháng
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={config.maxMonthlyStreakRepairs}
                    onChange={(e) => onChange({ maxMonthlyStreakRepairs: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-snapy font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">lần/tháng</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Giới hạn chống lạm dụng sửa chuỗi.
                </span>
              </div>
            </div>

            {/* Require Support Ticket Toggle */}
            <div className="p-3.5 rounded-xl bg-snapy-light/30 border border-snapy/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text flex items-center gap-1.5">
                  <Lock size={13} className="text-snapy" />
                  Bắt Buộc Đính Kèm Ticket Khi Sửa Streak
                </span>
                <input
                  type="checkbox"
                  checked={config.requireSupportTicketForStreakRecovery}
                  onChange={(e) => onChange({ requireSupportTicketForStreakRecovery: e.target.checked })}
                  className="w-4 h-4 rounded text-snapy focus:ring-snapy"
                />
              </div>
              <p className="text-[11px] text-neutral-600">
                Hỗ trợ phục hồi chuỗi học cho người dùng bị mất streak do lỗi kỹ thuật, bắt buộc đính kèm mã ticket hỗ trợ vào nhật ký Audit Log (design.md 7.3).
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Leaderboard Cadence & Diamond Tier Rewards (Full width) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-reward-hover" />
              <h3 className="font-bold text-sm text-text">Chu Kỳ Mùa Giải Leaderboard & Phần Thưởng Tuần</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">specs.md FR-09.05</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Cadence Info */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-text mb-1">Thời Gian Khởi Tranh Tuần</label>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-border font-mono font-bold text-neutral-800">
                  {config.leaderboardStartDay}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-text mb-1">Thời Điểm Chốt Mùa Giải Tuần</label>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-border font-mono font-bold text-neutral-800">
                  {config.leaderboardEndDay}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-text mb-1">Múi Giờ Máy Chủ (Server Timezone)</label>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-border font-semibold text-neutral-700">
                  {config.serverTimezone}
                </div>
              </div>
            </div>

            {/* Top 1, 2, 3 Rewards Setup */}
            <div className="md:col-span-2 space-y-3">
              <label className="block font-semibold text-text">
                Cơ Cấu Thưởng Top 3 Hạng Kim Cương (Diamond Tier) Mỗi Tuần
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* Top 1 */}
                <div className="p-3.5 rounded-xl bg-reward-light/50 border border-reward/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-reward-hover text-xs">
                    <span>🥇 Top 1 Tuần</span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Coins</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop1Coins}
                      onChange={(e) => onChange({ diamondTierRewardTop1Coins: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Gems</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop1Gems}
                      onChange={(e) => onChange({ diamondTierRewardTop1Gems: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Top 2 */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-border space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-600 text-xs">
                    <span>🥈 Top 2 Tuần</span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Coins</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop2Coins}
                      onChange={(e) => onChange({ diamondTierRewardTop2Coins: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Gems</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop2Gems}
                      onChange={(e) => onChange({ diamondTierRewardTop2Gems: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Top 3 */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-border space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 text-xs">
                    <span>🥉 Top 3 Tuần</span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Coins</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop3Coins}
                      onChange={(e) => onChange({ diamondTierRewardTop3Coins: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Gems</label>
                    <input
                      type="number"
                      value={config.diamondTierRewardTop3Gems}
                      onChange={(e) => onChange({ diamondTierRewardTop3Gems: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-border bg-surface font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
