import React from 'react';
import { Badge, BadgeTier } from '../../../domains/badges/types';
import {
  X,
  Award,
  Sparkles,
  Lock,
  Edit,
  Copy,
  Archive,
  CheckCircle2,
  Users,
  Coins,
  History,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface BadgeInspectorDrawerProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (b: Badge) => void;
  onDuplicate: (b: Badge) => void;
  onToggleStatus: (b: Badge) => void;
  onArchive: (b: Badge) => void;
}

const TIER_METALLIC_CLASSES: Record<BadgeTier, { border: string; bg: string; text: string; glow: string }> = {
  bronze: {
    border: 'border-amber-700/60',
    bg: 'bg-gradient-to-b from-amber-100 to-amber-200/80',
    text: 'text-amber-900',
    glow: 'shadow-[0_0_15px_rgba(180,83,9,0.25)]',
  },
  silver: {
    border: 'border-slate-400/80',
    bg: 'bg-gradient-to-b from-slate-100 to-slate-200',
    text: 'text-slate-800',
    glow: 'shadow-[0_0_15px_rgba(100,116,139,0.25)]',
  },
  gold: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-200',
    text: 'text-amber-800',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  },
  platinum: {
    border: 'border-sky-400',
    bg: 'bg-gradient-to-b from-sky-50 via-cyan-100 to-sky-200',
    text: 'text-sky-800',
    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.4)]',
  },
  diamond: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-b from-purple-100 via-fuchsia-100 to-purple-200',
    text: 'text-purple-900',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
  },
};

export const BadgeInspectorDrawer: React.FC<BadgeInspectorDrawerProps> = ({
  badge,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onArchive,
}) => {
  if (!isOpen || !badge) return null;

  const tierStyle = TIER_METALLIC_CLASSES[badge.tier];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface border-l border-border h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-text-muted">
              {badge.code}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                badge.status === 'active'
                  ? 'bg-primary-light text-primary border border-primary/20'
                  : badge.status === 'secret'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : badge.status === 'draft'
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {badge.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Badge Showcase Hero */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-subtle border border-border">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3 border-2 ${tierStyle.border} ${tierStyle.bg} ${tierStyle.glow}`}
            >
              <span>{badge.isSecret && badge.status === 'secret' ? '❓' : badge.icon}</span>
            </div>

            <h3 className="text-base font-extrabold text-text tracking-tight">
              {badge.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${tierStyle.text} bg-surface border border-border`}
              >
                Hạng {badge.tier}
              </span>
              <span className="text-border-strong">·</span>
              <span className="text-xs text-text-muted font-medium">
                Nhóm: <span className="text-text capitalize">{badge.category}</span>
              </span>
            </div>

            <p className="text-xs text-text-muted mt-2.5 leading-relaxed px-2">
              {badge.description}
            </p>

            {badge.isSecret && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-left text-xs">
                <span className="font-bold text-purple-900 block text-[11px] mb-0.5">
                  🔮 Lời gợi ý bí mật (Secret Hint):
                </span>
                <p className="text-purple-800 text-[11px] italic">
                  "{badge.secretHint || 'Không có lời gợi ý nào'}"
                </p>
              </div>
            )}
          </div>

          {/* Metric & Unlock Criteria */}
          <div className="p-3.5 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text">
              <span>Tiêu chuẩn mở khóa</span>
              <span className="font-mono text-primary font-bold">
                {badge.targetValue} {badge.targetUnit}
              </span>
            </div>
            <div className="text-[11px] text-text-muted flex items-center justify-between">
              <span>Chỉ số theo dõi:</span>
              <span className="font-mono font-semibold text-text">{badge.unlockMetric}</span>
            </div>
          </div>

          {/* Performance & Distribution */}
          <div className="p-3.5 bg-surface rounded-xl border border-border space-y-2.5">
            <span className="text-xs font-bold text-text block">
              Thống kê mở khóa trên người học
            </span>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] text-text-muted block">Tổng học viên đạt</span>
                <span className="text-base font-extrabold text-text font-mono">
                  {badge.totalEarners.toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] text-text-muted block">Tỷ lệ mở khóa</span>
                <span className="text-base font-extrabold text-primary font-mono">
                  {badge.unlockRate}%
                </span>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] text-text-muted font-medium">
                <span>Tỷ lệ hoàn thành toàn hệ thống</span>
                <span>{badge.unlockRate}%</span>
              </div>
              <div className="w-full bg-surface-subtle border border-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(2, badge.unlockRate))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rewards Breakdown */}
          <div className="p-3.5 bg-reward-light/30 rounded-xl border border-reward/20 space-y-2">
            <span className="text-xs font-bold text-reward-hover flex items-center gap-1.5">
              <Coins size={14} className="text-reward-hover" />
              Phần Thưởng Kèm Theo
            </span>

            <div className="flex items-center gap-3 text-xs font-mono font-bold text-text">
              <span className="px-2 py-1 rounded bg-surface border border-reward/20">
                +{badge.reward.xp} XP
              </span>
              <span className="px-2 py-1 rounded bg-surface border border-reward/20 text-reward-hover">
                +{badge.reward.coins} Coins
              </span>
              {badge.reward.gems && (
                <span className="px-2 py-1 rounded bg-surface border border-reward/20 text-snapy">
                  +{badge.reward.gems} Gems
                </span>
              )}
            </div>

            {badge.reward.titleName && (
              <div className="pt-2 border-t border-reward/20 text-xs">
                <span className="text-text-muted text-[11px] block">Danh hiệu đính kèm:</span>
                <span className="font-extrabold text-reward-hover underline">
                  {badge.reward.titleName}
                </span>
              </div>
            )}
          </div>

          {/* Audit Notes & History */}
          <div className="p-3 bg-surface rounded-xl border border-border space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-text mb-1">
              <History size={13} className="text-text-muted" />
              <span>Nhật ký vận hành</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Ngày khởi tạo:</span>
              <span className="font-mono text-text">{badge.createdDate}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Cập nhật gần nhất:</span>
              <span className="font-mono text-text">{badge.lastUpdated}</span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Người phụ trách:</span>
              <span className="font-semibold text-text">{badge.updatedBy}</span>
            </div>
            {badge.auditNotes && (
              <div className="mt-2 pt-2 border-t border-border text-text-muted italic">
                "{badge.auditNotes}"
              </div>
            )}
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 border-t border-border bg-surface-subtle/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEdit(badge)}
              className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Edit size={14} />
              <span>Chỉnh Sửa</span>
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(badge)}
              className="px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy size={14} />
              <span>Nhân Bản</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStatus(badge)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-[11px] font-semibold text-text transition-colors text-center"
            >
              {badge.status === 'active' ? 'Tạm Dừng (Về Draft)' : 'Kích Hoạt (Publish)'}
            </button>
            {badge.status !== 'archived' && (
              <button
                type="button"
                onClick={() => onArchive(badge)}
                className="px-3 py-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger-light text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <Archive size={12} />
                <span>Lưu Trữ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
