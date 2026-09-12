import React, { useState, useEffect } from 'react';
import {
  Badge,
  BadgeCategory,
  BadgeTier,
  BadgeStatus,
  UnlockMetricType,
  HonoraryTitle,
} from '../../../domains/badges/types';
import {
  X,
  Check,
  Award,
  Sparkles,
  Lock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface BadgeFormModalProps {
  isOpen: boolean;
  editingBadge: Badge | null;
  titles: HonoraryTitle[];
  onClose: () => void;
  onSave: (badgeData: Partial<Badge>) => void;
}

const COMMON_ICONS = ['🔥', '⚡', '👑', '💎', '📷', '🦅', '✨', '🔮', '🌱', '📚', '🎓', '🏆', '🎯', '🦉', '🦊', '🚀', '🌟', '🛡️'];

const TIER_METALLIC_CLASSES: Record<BadgeTier, { border: string; bg: string; text: string }> = {
  bronze: {
    border: 'border-amber-700/60',
    bg: 'bg-gradient-to-b from-amber-100 to-amber-200/80',
    text: 'text-amber-900',
  },
  silver: {
    border: 'border-slate-400/80',
    bg: 'bg-gradient-to-b from-slate-100 to-slate-200',
    text: 'text-slate-800',
  },
  gold: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-200',
    text: 'text-amber-800',
  },
  platinum: {
    border: 'border-sky-400',
    bg: 'bg-gradient-to-b from-sky-50 via-cyan-100 to-sky-200',
    text: 'text-sky-800',
  },
  diamond: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-b from-purple-100 via-fuchsia-100 to-purple-200',
    text: 'text-purple-900',
  },
};

export const BadgeFormModal: React.FC<BadgeFormModalProps> = ({
  isOpen,
  editingBadge,
  titles,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BadgeCategory>('streak');
  const [tier, setTier] = useState<BadgeTier>('bronze');
  const [icon, setIcon] = useState('🔥');
  const [unlockMetric, setUnlockMetric] = useState<UnlockMetricType>('STREAK_DAYS');
  const [targetValue, setTargetValue] = useState<number>(7);
  const [targetUnit, setTargetUnit] = useState('ngày liên tục');
  const [xpReward, setXpReward] = useState<number>(100);
  const [coinsReward, setCoinsReward] = useState<number>(150);
  const [gemsReward, setGemsReward] = useState<number>(0);
  const [attachedTitleId, setAttachedTitleId] = useState<string>('');
  const [status, setStatus] = useState<BadgeStatus>('active');
  const [isSecret, setIsSecret] = useState<boolean>(false);
  const [secretHint, setSecretHint] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingBadge) {
      setCode(editingBadge.code);
      setName(editingBadge.name);
      setDescription(editingBadge.description);
      setCategory(editingBadge.category);
      setTier(editingBadge.tier);
      setIcon(editingBadge.icon);
      setUnlockMetric(editingBadge.unlockMetric);
      setTargetValue(editingBadge.targetValue);
      setTargetUnit(editingBadge.targetUnit);
      setXpReward(editingBadge.reward.xp);
      setCoinsReward(editingBadge.reward.coins);
      setGemsReward(editingBadge.reward.gems || 0);
      setAttachedTitleId(editingBadge.reward.titleId || '');
      setStatus(editingBadge.status);
      setIsSecret(!!editingBadge.isSecret);
      setSecretHint(editingBadge.secretHint || '');
    } else {
      setCode(`BDG-${category.toUpperCase().slice(0, 4)}-${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setDescription('');
      setCategory('streak');
      setTier('bronze');
      setIcon('🔥');
      setUnlockMetric('STREAK_DAYS');
      setTargetValue(7);
      setTargetUnit('ngày liên tục');
      setXpReward(100);
      setCoinsReward(150);
      setGemsReward(0);
      setAttachedTitleId('');
      setStatus('active');
      setIsSecret(false);
      setSecretHint('');
    }
    setErrors({});
  }, [editingBadge, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = 'Mã huy hiệu không được để trống';
    if (!name.trim()) errs.name = 'Tên huy hiệu bắt buộc nhập';
    if (!description.trim()) errs.description = 'Mô tả thành tựu bắt buộc nhập';
    if (targetValue <= 0) errs.targetValue = 'Giá trị mục tiêu phải > 0';
    if (coinsReward < 0) errs.coinsReward = 'Coins thưởng không hợp lệ';
    if (isSecret && !secretHint.trim()) {
      errs.secretHint = 'Huy hiệu bí mật cần có lời gợi ý (hint)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedTitle = titles.find((t) => t.id === attachedTitleId);

    const badgePayload: Partial<Badge> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      category,
      tier,
      icon,
      unlockMetric,
      targetValue,
      targetUnit: targetUnit.trim(),
      reward: {
        xp: xpReward,
        coins: coinsReward,
        gems: gemsReward > 0 ? gemsReward : undefined,
        titleId: attachedTitleId || undefined,
        titleName: selectedTitle ? selectedTitle.name : undefined,
      },
      status,
      isSecret,
      secretHint: isSecret ? secretHint.trim() : undefined,
    };

    onSave(badgePayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">
                {editingBadge ? `Chỉnh Sửa Huy Hiệu: ${editingBadge.code}` : 'Tạo Huy Hiệu Mới'}
              </h3>
              <p className="text-[11px] text-text-muted">
                Cấu hình thuộc tính, tiêu chuẩn mở khóa và phần thưởng cho học viên
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Live Preview & Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-surface-subtle rounded-xl border border-border">
            {/* Live Token Preview */}
            <div className="flex flex-col items-center justify-center text-center p-3 bg-surface rounded-xl border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase mb-1">
                Xem trước huy hiệu
              </span>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 my-1.5 shadow-sm ${
                  TIER_METALLIC_CLASSES[tier].border
                } ${TIER_METALLIC_CLASSES[tier].bg}`}
              >
                <span>{isSecret ? '❓' : icon}</span>
              </div>
              <span className="text-xs font-bold text-text truncate max-w-[120px]">
                {name || 'Tên huy hiệu'}
              </span>
              <span
                className={`text-[9px] font-bold uppercase mt-0.5 font-mono ${
                  TIER_METALLIC_CLASSES[tier].text
                }`}
              >
                {tier}
              </span>
            </div>

            {/* Code & Name */}
            <div className="sm:col-span-2 space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Mã Huy Hiệu (Code): <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VD: BDG-STRK-30"
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold uppercase focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {errors.code && <p className="text-[10px] text-danger mt-0.5">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Tên Huy Hiệu: <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Thói Quen Vàng"
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {errors.name && <p className="text-[10px] text-danger mt-0.5">{errors.name}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Mô Tả Thành Tựu & Ý Nghĩa: <span className="text-danger">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Duy trì chuỗi học liên tục suốt 30 ngày không gián đoạn..."
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {errors.description && (
              <p className="text-[10px] text-danger mt-0.5">{errors.description}</p>
            )}
          </div>

          {/* Category, Tier, Icon Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Danh Mục:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BadgeCategory)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="streak">Chuỗi ngày (Streak)</option>
                <option value="scan">Quét AI Camera</option>
                <option value="vocabulary">Vốn từ vựng (SRS)</option>
                <option value="quiz">Trắc nghiệm (Quiz)</option>
                <option value="league">Giải đấu & Xếp hạng</option>
                <option value="special_event">Sự kiện đặc biệt</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Bậc Độ Hiếm (Rarity Tier):
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as BadgeTier)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-semibold uppercase focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="bronze">Bronze (Hạng Đồng)</option>
                <option value="silver">Silver (Hạng Bạc)</option>
                <option value="gold">Gold (Hạng Vàng)</option>
                <option value="platinum">Platinum (Bạch Kim)</option>
                <option value="diamond">Diamond (Kim Cương)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Trạng Thái:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BadgeStatus)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="active">Hoạt động (Active)</option>
                <option value="draft">Bản nháp (Draft)</option>
                <option value="secret">Bí mật (Secret)</option>
                <option value="archived">Lưu trữ (Archived)</option>
              </select>
            </div>
          </div>

          {/* Quick Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Biểu Tượng Icon:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap p-2 bg-surface-subtle rounded-lg border border-border">
              {COMMON_ICONS.map((ico) => (
                <button
                  key={ico}
                  type="button"
                  onClick={() => setIcon(ico)}
                  className={`w-7 h-7 rounded-lg text-base flex items-center justify-center transition-all ${
                    icon === ico
                      ? 'bg-primary text-white scale-110 shadow-xs'
                      : 'bg-surface hover:bg-white text-text border border-border'
                  }`}
                >
                  {ico}
                </button>
              ))}
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Custom"
                className="w-14 text-xs p-1 text-center rounded-lg border border-border bg-surface text-text ml-auto font-mono"
              />
            </div>
          </div>

          {/* Trigger Condition Rule */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-200/60 rounded-xl space-y-3">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Tiêu Chuẩn Kích Hoạt Tự Động (Trigger Rule)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Chỉ số đo lường:
                </label>
                <select
                  value={unlockMetric}
                  onChange={(e) => setUnlockMetric(e.target.value as UnlockMetricType)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono"
                >
                  <option value="STREAK_DAYS">STREAK_DAYS (Số ngày streak)</option>
                  <option value="AI_SCAN_SAVED">AI_SCAN_SAVED (Số lần scan lưu từ)</option>
                  <option value="SRS_MASTERED">SRS_MASTERED (Thẻ SRS vĩnh viễn)</option>
                  <option value="PERFECT_QUIZ">PERFECT_QUIZ (Lần quiz 100%)</option>
                  <option value="LEADERBOARD_RANK">LEADERBOARD_RANK (Hạng tuần)</option>
                  <option value="TOPICS_COMPLETED">TOPICS_COMPLETED (Chủ đề xong)</option>
                  <option value="CHESTS_OPENED">CHESTS_OPENED (Rương đã mở)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Ngưỡng mục tiêu: <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Đơn vị hiển thị:
                </label>
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="VD: ngày liên tục"
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text"
                />
              </div>
            </div>
          </div>

          {/* Reward Configuration */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-3">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Award size={14} className="text-reward-hover" />
              Cấu Hình Phần Thưởng Nhận Được
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Điểm XP:
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={xpReward}
                  onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Tiền Coin:
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={coinsReward}
                  onChange={(e) => setCoinsReward(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Đá Quý Gems (Tùy chọn):
                </label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={gemsReward}
                  onChange={(e) => setGemsReward(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono"
                />
              </div>
            </div>

            {/* Attached Title */}
            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1">
                Gắn kèm Danh hiệu mở khóa (Tùy chọn):
              </label>
              <select
                value={attachedTitleId}
                onChange={(e) => setAttachedTitleId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-semibold"
              >
                <option value="">-- Không đính kèm danh hiệu --</option>
                {titles.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Hạng {t.rarity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secret / Easter Egg Toggle */}
          <div className="p-3 bg-purple-50/50 border border-purple-200/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSecretCheckbox"
                  checked={isSecret}
                  onChange={(e) => {
                    setIsSecret(e.target.checked);
                    if (e.target.checked && status !== 'secret') {
                      setStatus('secret');
                    }
                  }}
                  className="w-4 h-4 text-purple-600 rounded border-border focus:ring-purple-500"
                />
                <label
                  htmlFor="isSecretCheckbox"
                  className="text-xs font-bold text-purple-900 cursor-pointer"
                >
                  Huy Hiệu Bí Mật (Easter Egg - Ẩn điều kiện ??? cho người học)
                </label>
              </div>
            </div>

            {isSecret && (
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Lời gợi ý mở (Secret Hint): <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={secretHint}
                  onChange={(e) => setSecretHint(e.target.value)}
                  placeholder="VD: Hãy thử mở app và vượt qua một bài kiểm tra khi cả thành phố đã ngủ say..."
                  className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.secretHint && (
                  <p className="text-[10px] text-danger mt-0.5">{errors.secretHint}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-muted hover:text-text transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check size={14} />
              <span>{editingBadge ? 'Lưu Thay Đổi' : 'Tạo Huy Hiệu Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
