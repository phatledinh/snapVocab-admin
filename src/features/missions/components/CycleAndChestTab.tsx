import React, { useState } from 'react';
import {
  DailyCycleConfig,
  WeeklyMilestoneConfig,
  WeeklyStampMilestone,
} from '../../../domains/missions/types';
import {
  CalendarClock,
  Clock,
  Gift,
  Coins,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCw,
  AlertCircle,
  Trophy,
  Award,
  Layers,
} from 'lucide-react';

interface CycleAndChestTabProps {
  dailyConfig: DailyCycleConfig;
  weeklyConfig: WeeklyMilestoneConfig;
  countdownText: string;
  onUpdateDailyConfig: (newConfig: DailyCycleConfig) => void;
  onUpdateWeeklyConfig: (newConfig: WeeklyMilestoneConfig) => void;
}

export const CycleAndChestTab: React.FC<CycleAndChestTabProps> = ({
  dailyConfig,
  weeklyConfig,
  countdownText,
  onUpdateDailyConfig,
  onUpdateWeeklyConfig,
}) => {
  const [dailyForm, setDailyForm] = useState<DailyCycleConfig>(dailyConfig);
  const [weeklyForm, setWeeklyForm] = useState<WeeklyMilestoneConfig>(weeklyConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDailyConfig(dailyForm);
    onUpdateWeeklyConfig(weeklyForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdateMilestone = (
    index: number,
    field: 'coins' | 'xp' | 'gems' | 'exclusiveItem',
    val: string | number
  ) => {
    const updatedMilestones = [...weeklyForm.milestones];
    const target = { ...updatedMilestones[index] };
    if (field === 'exclusiveItem') {
      target.reward = { ...target.reward, exclusiveItem: val as string };
    } else {
      target.reward = { ...target.reward, [field]: Number(val) };
    }
    updatedMilestones[index] = target;
    setWeeklyForm({ ...weeklyForm, milestones: updatedMilestones });
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-5 select-none text-xs">
      {/* Top Banner Countdown & Save Toast */}
      <div className="bg-gradient-to-r from-snapy-light/80 to-amber-50 border border-snapy/20 rounded-2xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snapy text-white flex items-center justify-center shadow-xs">
            <Clock size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-text">
                Chu Kỳ Reset 00:00 Asia/Ho_Chi_Minh (GMT+7)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-snapy text-white font-mono">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Thời gian đếm ngược còn lại của ngày hôm nay:{' '}
              <strong className="text-snapy font-mono font-bold text-xs">
                {countdownText}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <Check size={14} />
              <span>Đã lưu cấu hình LiveOps!</span>
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Check size={14} />
            <span>Lưu & Cập Nhật Chu Kỳ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* KHỐI 1: CẤU HÌNH DAILY CYCLE & THUẬT TOÁN POOL */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <CalendarClock size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text">Chu Kỳ Reset Hàng Ngày</h3>
                <p className="text-[11px] text-text-muted">
                  Quy tắc F-GAME-10 & Cơ chế Random Weighted Pool
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              00:00 GMT+7
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Số Nhiệm Vụ Bắt Buộc / Ngày
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={dailyForm.requiredDailyCount}
                  onChange={(e) =>
                    setDailyForm({
                      ...dailyForm,
                      requiredDailyCount: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Tiêu chuẩn: 5 nhiệm vụ/ngày
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Nhiệm Vụ Thưởng Thêm (+Bonus)
                </label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={dailyForm.maxBonusCount}
                  onChange={(e) =>
                    setDailyForm({
                      ...dailyForm,
                      maxBonusCount: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Tiêu chuẩn: Tối đa 1 bonus
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Seed Thuật Toán Xoay Tua Pool (Weighted Random)
              </label>
              <input
                type="text"
                value={dailyForm.weightedRandomSeed}
                onChange={(e) =>
                  setDailyForm({
                    ...dailyForm,
                    weightedRandomSeed: e.target.value,
                  })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono text-xs focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-text-muted mt-0.5 block">
                Dựa trên phân bổ trọng số (Weight) kết hợp phân khúc người học
              </span>
            </div>

            {/* Note alert */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Quy chuẩn nghiêm ngặt (F-GAME-10):</strong> Sau mốc 00:00 GMT+7,
                mọi tiến độ nhiệm vụ ngày chưa hoàn thành hoặc đã hoàn thành nhưng chưa
                nhận thưởng sẽ hết hạn và <strong>không cộng dồn sang ngày sau</strong>.
              </div>
            </div>
          </div>

          {/* CẤU HÌNH DAILY CHEST */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-[#9A7000]" />
                <span className="font-bold text-text">
                  Phần Thưởng Rương Ngày (Daily Chest)
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-reward-light px-2 py-0.5 rounded border border-reward/30">
                Đạt 5/5 Nhiệm Vụ
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">Coins</label>
                <input
                  type="number"
                  min="0"
                  value={dailyForm.dailyChestReward.coins}
                  onChange={(e) =>
                    setDailyForm({
                      ...dailyForm,
                      dailyChestReward: {
                        ...dailyForm.dailyChestReward,
                        coins: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">XP</label>
                <input
                  type="number"
                  min="0"
                  value={dailyForm.dailyChestReward.xp}
                  onChange={(e) =>
                    setDailyForm({
                      ...dailyForm,
                      dailyChestReward: {
                        ...dailyForm.dailyChestReward,
                        xp: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Gems</label>
                <input
                  type="number"
                  min="0"
                  value={dailyForm.dailyChestReward.gems}
                  onChange={(e) =>
                    setDailyForm({
                      ...dailyForm,
                      dailyChestReward: {
                        ...dailyForm.dailyChestReward,
                        gems: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 2: CẤU HÌNH 3 MỐC RƯƠNG TUẦN & ACTIVITY STAMPS */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-snapy-light text-snapy flex items-center justify-center">
                <Trophy size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text">
                  3 Mốc Rương Tuần (Activity Stamps)
                </h3>
                <p className="text-[11px] text-text-muted">
                  Chu kỳ Thứ 2 → Chủ Nhật (F-GAME-04, MH-GAME-02)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-snapy-light text-snapy font-bold">
              7 Stamps Max
            </span>
          </div>

          <p className="text-text-muted text-[11px] leading-relaxed">
            Mỗi ngày học viên hoàn thành trọn vẹn 5/5 nhiệm vụ hàng ngày sẽ được cấp{' '}
            <strong>1 Activity Stamp</strong>. Khi tích lũy đủ 3, 5, hoặc 7 stamps trong tuần,
            học viên sẽ mở khóa các mốc rương tương ứng:
          </p>

          <div className="space-y-3">
            {weeklyForm.milestones.map((ms, index) => (
              <div
                key={ms.tier}
                className="p-3.5 bg-surface-subtle/70 border border-border rounded-xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ms.icon}</span>
                    <div>
                      <div className="font-bold text-text">{ms.chestName}</div>
                      <div className="text-[10px] text-text-muted">
                        Yêu cầu: <strong>{ms.stampsRequired} Stamps</strong> trong tuần
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ms.tier === 'gold'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : ms.tier === 'silver'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {ms.tier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-text mb-0.5">
                      Coins
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ms.reward.coins}
                      onChange={(e) =>
                        handleUpdateMilestone(index, 'coins', e.target.value)
                      }
                      className="w-full p-1.5 rounded-md border border-border bg-surface text-text font-mono font-bold text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-text mb-0.5">
                      XP
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ms.reward.xp}
                      onChange={(e) =>
                        handleUpdateMilestone(index, 'xp', e.target.value)
                      }
                      className="w-full p-1.5 rounded-md border border-border bg-surface text-text font-mono font-bold text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-text mb-0.5">
                      Gems
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ms.reward.gems}
                      onChange={(e) =>
                        handleUpdateMilestone(index, 'gems', e.target.value)
                      }
                      className="w-full p-1.5 rounded-md border border-border bg-surface text-text font-mono font-bold text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {ms.tier !== 'bronze' && (
                  <div>
                    <label className="block text-[10px] font-semibold text-text mb-0.5">
                      Vật Phẩm / Danh Hiệu Kèm Theo
                    </label>
                    <input
                      type="text"
                      value={ms.reward.exclusiveItem || ''}
                      onChange={(e) =>
                        handleUpdateMilestone(index, 'exclusiveItem', e.target.value)
                      }
                      placeholder="VD: Khung Avatar Hoàng Gia / Booster x2 XP..."
                      className="w-full p-1.5 rounded-md border border-border bg-surface text-text text-[11px] focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
