import React, { useState } from 'react';
import { Badge, HonoraryTitle, BadgeTier } from '../../../domains/badges/types';
import {
  Smartphone,
  Sparkles,
  Award,
  Crown,
  Lock,
  ChevronRight,
  Flame,
  CheckCircle2,
  X,
  Share2,
  BookmarkCheck,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface MobileBadgeSimulatorProps {
  badges: Badge[];
  titles: HonoraryTitle[];
  selectedBadgeForDetail?: Badge | null;
  onSelectBadge?: (b: Badge) => void;
  onClose?: () => void;
}

const TIER_METALLIC_CLASSES: Record<BadgeTier, { border: string; bg: string; text: string; glow: string }> = {
  bronze: {
    border: 'border-amber-700/60',
    bg: 'bg-gradient-to-b from-amber-100 to-amber-200/80',
    text: 'text-amber-900',
    glow: 'shadow-[0_0_12px_rgba(180,83,9,0.25)]',
  },
  silver: {
    border: 'border-slate-400/80',
    bg: 'bg-gradient-to-b from-slate-100 to-slate-200',
    text: 'text-slate-800',
    glow: 'shadow-[0_0_12px_rgba(100,116,139,0.25)]',
  },
  gold: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-200',
    text: 'text-amber-800',
    glow: 'shadow-[0_0_16px_rgba(245,158,11,0.4)]',
  },
  platinum: {
    border: 'border-sky-400',
    bg: 'bg-gradient-to-b from-sky-50 via-cyan-100 to-sky-200',
    text: 'text-sky-800',
    glow: 'shadow-[0_0_16px_rgba(14,165,233,0.4)]',
  },
  diamond: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-b from-purple-100 via-fuchsia-100 to-purple-200',
    text: 'text-purple-900',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  },
};

const FLAIR_THEME_CLASSES: Record<string, string> = {
  fire: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 text-white shadow-xs',
  emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs',
  gold: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-amber-950 font-extrabold shadow-xs',
  royal: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xs',
  neon: 'bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 text-slate-950 font-extrabold shadow-xs',
};

export const MobileBadgeSimulator: React.FC<MobileBadgeSimulatorProps> = ({
  badges,
  titles,
  selectedBadgeForDetail,
  onSelectBadge,
  onClose,
}) => {
  // Mobile Simulator View: 'gallery' (MH-GAME-03) or 'profile' (MH-PROFILE-01)
  const [screenMode, setScreenMode] = useState<'gallery' | 'profile'>('gallery');
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [activeBottomSheetBadge, setActiveBottomSheetBadge] = useState<Badge | null>(null);

  // Simulated unlocked badge ids for testing
  const [simulatedUnlocked, setSimulatedUnlocked] = useState<Record<string, boolean>>({
    'bdg-strk-01': true,
    'bdg-strk-02': true,
    'bdg-scan-01': true,
    'bdg-scan-02': true,
    'bdg-scan-03': true,
    'bdg-voc-01': true,
    'bdg-quiz-01': true,
  });

  // Equipped Title & Featured Badges
  const [equippedTitleId, setEquippedTitleId] = useState<string>('ttl-scan-01');
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState<string[]>([
    'bdg-scan-03',
    'bdg-strk-02',
    'bdg-quiz-01',
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // Filter badges for mobile gallery
  const filteredBadges = badges.filter((b) => {
    if (b.status === 'archived') return false;
    if (galleryCategory === 'all') return true;
    return b.category === galleryCategory;
  });

  const equippedTitle =
    titles.find((t) => t.id === equippedTitleId) || titles[0];

  const handleBadgeClick = (b: Badge) => {
    setActiveBottomSheetBadge(b);
    if (onSelectBadge) onSelectBadge(b);
  };

  const handleToggleUnlock = (badgeId: string) => {
    setSimulatedUnlocked((prev) => {
      const next = !prev[badgeId];
      if (next) showToast('Đã mở khóa huy hiệu (Mô phỏng)!');
      else showToast('Đã chuyển sang trạng thái Đang khóa.');
      return { ...prev, [badgeId]: next };
    });
  };

  const handleTogglePin = (badgeId: string) => {
    if (pinnedBadgeIds.includes(badgeId)) {
      setPinnedBadgeIds((prev) => prev.filter((id) => id !== badgeId));
      showToast('Đã bỏ ghim khỏi Hồ sơ');
    } else {
      if (pinnedBadgeIds.length >= 3) {
        setPinnedBadgeIds((prev) => [prev[1], prev[2], badgeId]);
      } else {
        setPinnedBadgeIds((prev) => [...prev, badgeId]);
      }
      showToast('Đã ghim huy hiệu vào 3 vị trí danh giá Hồ sơ!');
    }
  };

  return (
    <div className="w-full lg:w-[380px] bg-surface border border-border rounded-2xl p-4 shadow-card flex flex-col shrink-0 select-none">
      {/* Simulator Toolbar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-snapy-light text-snapy flex items-center justify-center">
            <Smartphone size={14} />
          </div>
          <span className="text-xs font-bold text-text">Mobile Simulator</span>
        </div>

        {/* Screen Switcher */}
        <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setScreenMode('gallery')}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
              screenMode === 'gallery'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            MH-GAME-03
          </button>
          <button
            type="button"
            onClick={() => setScreenMode('profile')}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
              screenMode === 'profile'
                ? 'bg-surface text-snapy shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            MH-PROFILE-01
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text p-1 rounded-md"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Phone Chassis */}
      <div className="w-full flex justify-center py-1">
        <div className="w-[320px] h-[610px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/60 relative flex flex-col">
          {/* Inner Screen */}
          <div className="w-full h-full bg-[#F8F9F7] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800">
            {/* Phone Status Bar */}
            <div className="w-full h-7 pt-1 px-5 flex items-center justify-between text-slate-800 text-[10px] font-semibold select-none z-30 shrink-0">
              <span>09:41</span>
              {/* Dynamic Island */}
              <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1 text-slate-700 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* In-Phone App Navigation Bar */}
            <div className="px-3.5 py-2 bg-surface/90 backdrop-blur-xs border-b border-border/60 flex items-center justify-between z-20 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🦊</span>
                <span className="text-xs font-black text-text tracking-tight">
                  {screenMode === 'gallery' ? 'Kho Huy Hiệu' : 'Hồ Sơ Học Viên'}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-reward-light text-reward-hover border border-reward/20 text-[10px] font-bold font-mono">
                <Flame size={11} className="fill-current text-snapy" />
                <span>30d</span>
              </div>
            </div>

            {/* In-App Toast Notification */}
            {toastMsg && (
              <div className="absolute top-12 left-3 right-3 z-40 bg-slate-900/90 text-white text-[10px] font-medium py-1.5 px-3 rounded-lg shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                <Sparkles size={12} className="text-reward shrink-0" />
                <span className="truncate">{toastMsg}</span>
              </div>
            )}

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto p-3 relative">
              {/* SCREEN 1: MH-GAME-03 (ACHIEVEMENT GALLERY) */}
              {screenMode === 'gallery' && (
                <div className="space-y-3">
                  {/* Category Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'streak', label: 'Chuỗi ngày' },
                      { id: 'scan', label: 'Quét AI' },
                      { id: 'vocabulary', label: 'Từ vựng' },
                      { id: 'quiz', label: 'Quiz' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setGalleryCategory(c.id)}
                        className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                          galleryCategory === c.id
                            ? 'bg-text text-white shadow-xs'
                            : 'bg-surface text-text-muted border border-border hover:text-text'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {filteredBadges.map((b) => {
                      const isUnlocked = simulatedUnlocked[b.id];
                      const isSecretLocked = b.isSecret && !isUnlocked;
                      const tierStyle = TIER_METALLIC_CLASSES[b.tier];

                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleBadgeClick(b)}
                          className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all relative ${
                            isUnlocked
                              ? `${tierStyle.border} ${tierStyle.bg} ${tierStyle.glow}`
                              : 'border-border/80 bg-surface/60 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {/* Pin indicator */}
                          {pinnedBadgeIds.includes(b.id) && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-snapy shadow-xs" />
                          )}

                          {/* Icon Container */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl my-1 relative ${
                              isUnlocked
                                ? 'filter drop-shadow-md'
                                : 'grayscale contrast-50'
                            }`}
                          >
                            {isSecretLocked ? (
                              <span className="text-base font-black text-text-muted">
                                ❓
                              </span>
                            ) : (
                              <span>{b.icon}</span>
                            )}

                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-[0.5px]">
                                <Lock size={12} className="text-white" />
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <span className="text-[10px] font-bold text-text line-clamp-1 leading-tight">
                            {isSecretLocked ? '???' : b.name}
                          </span>

                          {/* Tier & Status Tag */}
                          <span
                            className={`text-[8px] font-semibold mt-1 px-1 rounded uppercase tracking-wider font-mono ${
                              isUnlocked ? tierStyle.text : 'text-text-muted'
                            }`}
                          >
                            {isUnlocked ? b.tier : 'Khóa'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SCREEN 2: MH-PROFILE-01 (LEARNER PROFILE SHOWCASE) */}
              {screenMode === 'profile' && (
                <div className="space-y-3.5">
                  {/* User Profile Card */}
                  <div className="bg-surface rounded-2xl p-3.5 border border-border shadow-xs text-center flex flex-col items-center">
                    <div className="relative mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop"
                        alt="Avatar"
                        className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-primary text-white text-[9px] font-bold">
                        Lv.28
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-text">Nguyễn Văn Hoà</h3>

                    {/* Equipped Title Flair */}
                    {equippedTitle && (
                      <div className="mt-1.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            FLAIR_THEME_CLASSES[equippedTitle.flairTheme] ||
                            'bg-primary text-white'
                          }`}
                        >
                          <Sparkles size={10} />
                          <span>{equippedTitle.name}</span>
                        </span>
                      </div>
                    )}

                    <p className="text-[10px] text-text-muted mt-1">
                      {equippedTitle?.description || 'Học viên chăm chỉ'}
                    </p>
                  </div>

                  {/* Top 3 Featured Badges */}
                  <div className="bg-surface rounded-2xl p-3 border border-border shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-text flex items-center gap-1">
                        <Award size={12} className="text-reward-hover" />
                        Huy hiệu nổi bật (Top 3)
                      </span>
                      <button
                        type="button"
                        onClick={() => setScreenMode('gallery')}
                        className="text-[9px] text-primary font-bold hover:underline"
                      >
                        Đổi ghim
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {pinnedBadgeIds.map((bId) => {
                        const b = badges.find((item) => item.id === bId);
                        if (!b) return null;
                        const tierStyle = TIER_METALLIC_CLASSES[b.tier];
                        return (
                          <div
                            key={b.id}
                            className={`p-2 rounded-xl border flex flex-col items-center text-center ${tierStyle.border} ${tierStyle.bg}`}
                          >
                            <span className="text-xl mb-1">{b.icon}</span>
                            <span className="text-[9px] font-bold text-text truncate w-full">
                              {b.name}
                            </span>
                            <span className="text-[8px] font-semibold text-text-muted font-mono uppercase">
                              {b.tier}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="bg-surface p-2.5 rounded-xl border border-border">
                      <span className="text-text-muted block text-[9px]">Tổng từ vựng</span>
                      <span className="font-extrabold text-xs text-text font-mono">540 từ</span>
                    </div>
                    <div className="bg-surface p-2.5 rounded-xl border border-border">
                      <span className="text-text-muted block text-[9px]">Đồ vật đã quét</span>
                      <span className="font-extrabold text-xs text-text font-mono">102 lượt</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM-SHEET DETAIL MODAL OVERLAY (MH-GAME-03 SPEC) */}
              {activeBottomSheetBadge && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-150">
                  <div className="bg-surface rounded-t-3xl border-t border-border p-4 shadow-2xl max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                    {/* Header with Close */}
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                        {activeBottomSheetBadge.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveBottomSheetBadge(null)}
                        className="p-1 rounded-full text-text-muted hover:text-text hover:bg-surface-subtle"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Big Badge Showcase */}
                    <div className="flex flex-col items-center text-center my-3">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 border-2 ${
                          TIER_METALLIC_CLASSES[activeBottomSheetBadge.tier].border
                        } ${TIER_METALLIC_CLASSES[activeBottomSheetBadge.tier].bg} ${
                          TIER_METALLIC_CLASSES[activeBottomSheetBadge.tier].glow
                        } ${
                          simulatedUnlocked[activeBottomSheetBadge.id]
                            ? ''
                            : 'grayscale contrast-50 opacity-70'
                        }`}
                      >
                        {activeBottomSheetBadge.isSecret &&
                        !simulatedUnlocked[activeBottomSheetBadge.id] ? (
                          <span>❓</span>
                        ) : (
                          <span>{activeBottomSheetBadge.icon}</span>
                        )}
                      </div>

                      <h4 className="text-xs font-black text-text">
                        {activeBottomSheetBadge.isSecret &&
                        !simulatedUnlocked[activeBottomSheetBadge.id]
                          ? 'Huy Hiệu Bí Mật'
                          : activeBottomSheetBadge.name}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase font-mono ${
                            TIER_METALLIC_CLASSES[activeBottomSheetBadge.tier].text
                          } bg-surface-subtle border border-border`}
                        >
                          Hạng {activeBottomSheetBadge.tier}
                        </span>
                        <span className="text-[9px] text-text-muted">
                          {activeBottomSheetBadge.unlockRate}% học viên đạt
                        </span>
                      </div>

                      <p className="text-[10px] text-text-muted mt-2 leading-relaxed px-2">
                        {activeBottomSheetBadge.isSecret &&
                        !simulatedUnlocked[activeBottomSheetBadge.id]
                          ? activeBottomSheetBadge.secretHint ||
                            'Điều kiện đang được ẩn giấu...'
                          : activeBottomSheetBadge.description}
                      </p>
                    </div>

                    {/* Unlock Condition Card */}
                    <div className="bg-surface-subtle p-2.5 rounded-xl border border-border/80 text-[10px] space-y-1.5 mb-3">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-text">Tiêu chí mở khóa</span>
                        <span className="text-primary font-mono">
                          {activeBottomSheetBadge.targetValue}{' '}
                          {activeBottomSheetBadge.targetUnit}
                        </span>
                      </div>
                      {/* Simulated Progress bar */}
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: simulatedUnlocked[activeBottomSheetBadge.id]
                              ? '100%'
                              : '60%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Rewards Card */}
                    <div className="p-2.5 bg-reward-light/30 rounded-xl border border-reward/20 text-[10px] mb-3">
                      <span className="font-bold text-reward-hover block mb-1">
                        Phần thưởng đính kèm:
                      </span>
                      <div className="flex items-center gap-2 font-mono font-bold text-text">
                        <span>+{activeBottomSheetBadge.reward.xp} XP</span>
                        <span>+{activeBottomSheetBadge.reward.coins} Coins</span>
                        {activeBottomSheetBadge.reward.gems && (
                          <span className="text-snapy">
                            +{activeBottomSheetBadge.reward.gems} Gems
                          </span>
                        )}
                      </div>
                      {activeBottomSheetBadge.reward.titleName && (
                        <div className="mt-1.5 pt-1.5 border-t border-reward/20 text-[9px] text-reward-hover font-semibold">
                          Mở khóa danh hiệu:{' '}
                          <span className="font-bold underline">
                            {activeBottomSheetBadge.reward.titleName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleUnlock(activeBottomSheetBadge.id)
                        }
                        className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          simulatedUnlocked[activeBottomSheetBadge.id]
                            ? 'bg-danger-light text-danger border border-danger/20 hover:bg-danger/20'
                            : 'bg-primary text-white hover:bg-primary-hover shadow-xs'
                        }`}
                      >
                        {simulatedUnlocked[activeBottomSheetBadge.id]
                          ? 'Đổi Thành Đang Khóa (Demo)'
                          : 'Giả Lập Mở Khóa Ngay (Demo)'}
                      </button>

                      {simulatedUnlocked[activeBottomSheetBadge.id] && (
                        <button
                          type="button"
                          onClick={() =>
                            handleTogglePin(activeBottomSheetBadge.id)
                          }
                          className="w-full py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-[10px] font-semibold text-text flex items-center justify-center gap-1"
                        >
                          <BookmarkCheck size={12} className="text-primary" />
                          <span>
                            {pinnedBadgeIds.includes(activeBottomSheetBadge.id)
                              ? 'Bỏ ghim khỏi Top 3'
                              : 'Ghim vào 3 Huy hiệu Hồ sơ'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-full h-4 flex items-center justify-center pb-0.5 shrink-0">
              <div className="w-24 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Footnote */}
      <div className="w-full text-center text-[10px] text-text-muted pt-2 border-t border-border mt-2">
        Mô phỏng trực quan theo đặc tả{' '}
        <span className="font-mono text-primary font-bold">MH-GAME-03</span> &{' '}
        <span className="font-mono text-snapy font-bold">MH-PROFILE-01</span>
      </div>
    </div>
  );
};
