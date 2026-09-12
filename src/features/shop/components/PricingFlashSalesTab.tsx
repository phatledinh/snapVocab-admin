import React, { useState, useEffect } from 'react';
import {
  FlashSaleCampaign,
  ShopItem,
} from '../../../domains/economy/types';
import {
  Zap,
  Clock,
  Plus,
  Tag,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PricingFlashSalesTabProps {
  campaigns: FlashSaleCampaign[];
  items: ShopItem[];
  onCreateCampaign: (campaign: FlashSaleCampaign) => void;
  onEndCampaign: (campaignId: string) => void;
}

export const PricingFlashSalesTab: React.FC<PricingFlashSalesTabProps> = ({
  campaigns,
  items,
  onCreateCampaign,
  onEndCampaign,
}) => {
  // Live Countdown tick
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 48,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick New Campaign Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campDiscount, setCampDiscount] = useState(25);
  const [campItemId, setCampItemId] = useState(items[0]?.id || '');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;

    const newCamp: FlashSaleCampaign = {
      id: `sale-${Date.now()}`,
      name: campName,
      description: campDesc || 'Sự kiện khuyến mãi có thời hạn kích cầu học tập',
      discountPercent: Number(campDiscount),
      startDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      endDate: '2026-09-15 23:59',
      status: 'active',
      itemIds: [campItemId],
      purchaseLimitPerUser: 2,
      unitsSold: 0,
      revenueLift: 0,
    };

    onCreateCampaign(newCamp);
    setIsFormOpen(false);
    setCampName('');
    setCampDesc('');
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner: Active Flash Sale Countdown */}
      <div className="bg-gradient-to-r from-amber-500 via-[#E0AB26] to-amber-600 rounded-2xl p-5 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-xs shrink-0">
            <Zap size={24} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                LIVE FLASH SALE
              </span>
              <span className="text-xs font-semibold text-amber-100">Chiến dịch cuối tuần</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-0.5">
              Weekend Streak Rescue (-20% Lá Chắn Chuỗi)
            </h2>
            <p className="text-xs text-amber-50 max-w-lg mt-0.5 leading-relaxed">
              Hút 84k Coins về hệ thống trong 24h qua. Đã có 420 người học mua lá chắn bảo vệ chuỗi ngày.
            </p>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="flex items-center gap-2 bg-black/25 px-4 py-2.5 rounded-xl border border-white/20">
          <Clock size={16} className="text-amber-200" />
          <div className="text-center">
            <div className="text-[10px] text-amber-200 font-semibold uppercase tracking-wider">
              Kết thúc sau
            </div>
            <div className="font-mono text-base font-black tracking-wider text-white">
              {String(timeLeft.hours).padStart(2, '0')}h :{' '}
              {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Campaigns List */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-[#9A7000]" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  Các Chiến Dịch Khuyến Mãi & Seasonal Drops
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="px-3 py-1 rounded-lg bg-surface-subtle hover:bg-neutral-200 text-text font-bold text-xs border border-border flex items-center gap-1 transition-all"
              >
                <Plus size={13} />
                <span>Thêm Chiến Dịch</span>
              </button>
            </div>

            {/* Campaign Cards */}
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const isActive = camp.status === 'active';
                const isScheduled = camp.status === 'scheduled';

                return (
                  <div
                    key={camp.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                        : isScheduled
                        ? 'bg-info-light/40 border-info/30'
                        : 'bg-surface-subtle border-border opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-amber-100 text-[#9A7000] border border-amber-300 animate-pulse'
                                : isScheduled
                                ? 'bg-info-light text-info border border-info/30'
                                : 'bg-neutral-200 text-text-muted'
                            }`}
                          >
                            {camp.status}
                          </span>
                          <h4 className="text-xs font-bold text-text">{camp.name}</h4>
                          <span className="text-xs font-black font-mono text-danger">
                            -{camp.discountPercent}%
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {camp.description}
                        </p>
                      </div>

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => onEndCampaign(camp.id)}
                          className="px-2.5 py-1 rounded-md bg-surface border border-border text-danger hover:bg-danger-light font-bold text-[11px] transition-all shrink-0"
                        >
                          Kết thúc sớm
                        </button>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-muted font-mono">
                      <div className="flex items-center gap-3">
                        <span>Đã bán: <strong className="text-text">{camp.unitsSold}</strong></span>
                        <span>·</span>
                        <span>
                          Coins thu về thêm:{' '}
                          <strong className="text-[#9A7000]">
                            +{(camp.revenueLift / 1000).toFixed(0)}k
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} />
                        <span>{camp.startDate} ➔ {camp.endDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Campaign Creator / Pricing Simulator */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
              <Sparkles size={15} className="text-primary" />
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                Thiết Lập Khuyến Mãi Mới
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Tên Chiến Dịch <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="VD: Mid-Autumn Booster Drop..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Vật Phẩm Áp Dụng
                </label>
                <select
                  value={campItemId}
                  onChange={(e) => setCampItemId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.icon} {i.name} ({i.originalPrice} {i.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-text">Mức Giảm Giá</label>
                  <span className="font-mono font-bold text-xs text-danger">
                    -{campDiscount}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={campDiscount}
                  onChange={(e) => setCampDiscount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-[10px] text-text-muted mt-0.5">
                  <span>10% (Nhẹ)</span>
                  <span>25% (Tiêu chuẩn)</span>
                  <span>50% (Xả kho)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">Mô Tả Chiến Dịch</label>
                <textarea
                  rows={2}
                  value={campDesc}
                  onChange={(e) => setCampDesc(e.target.value)}
                  placeholder="Lý do khuyến mãi, thông điệp trên banner mobile..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text resize-none font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Zap size={14} />
                <span>Kích Hoạt Flash Sale Ngay</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-text-muted">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-1">
              <TrendingUp size={12} />
              <span>Dự báo tăng trưởng tiêu thụ:</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Các chiến dịch Flash Sale giúp tăng tốc độ hút Coins thêm <strong>+28% – 45%</strong> mà không làm phá vỡ cân bằng lạm phát.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
