import React, { useState, useMemo } from 'react';
import { HonoraryTitle, BadgeTier, Badge } from '../../../domains/badges/types';
import { filterAndSortTitles } from '../../../domains/badges/selectors';
import { TitleFormModal } from './TitleFormModal';
import {
  Crown,
  Sparkles,
  Plus,
  Search,
  Users,
  Award,
  Edit,
  Archive,
  CheckCircle2,
} from 'lucide-react';

interface TitlesFlairTabProps {
  titles: HonoraryTitle[];
  badges: Badge[];
  onAddTitle: () => void;
  onEditTitle: (t: HonoraryTitle) => void;
  onArchiveTitle: (t: HonoraryTitle) => void;
}

const FLAIR_THEME_CLASSES: Record<string, string> = {
  fire: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 text-white shadow-xs',
  emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs',
  gold: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-amber-950 font-extrabold shadow-xs',
  royal: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xs',
  neon: 'bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 text-slate-950 font-extrabold shadow-xs',
};

export const TitlesFlairTab: React.FC<TitlesFlairTabProps> = ({
  titles,
  badges,
  onAddTitle,
  onEditTitle,
  onArchiveTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<'ALL' | BadgeTier>('ALL');

  const filteredTitles = useMemo(() => {
    return filterAndSortTitles(titles, searchQuery, rarityFilter);
  }, [titles, searchQuery, rarityFilter]);

  return (
    <div className="space-y-4 select-none">
      {/* Header Info & Filter Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-reward-light text-reward-hover flex items-center justify-center border border-reward/20">
            <Crown size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">
              Quản Lý Danh Hiệu & Hiệu Ứng Hồ Sơ (Player Flair)
            </h3>
            <p className="text-xs text-text-muted">
              Cấu hình danh xưng danh giá hiển thị dưới avatar học viên và bảng xếp hạng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm danh hiệu..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-surface-subtle text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Rarity */}
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as any)}
            className="text-xs p-1.5 rounded-lg border border-border bg-surface text-text font-semibold uppercase font-mono"
          >
            <option value="ALL">Tất cả bậc</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
          </select>

          {/* Add Title Button */}
          <button
            type="button"
            onClick={onAddTitle}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Plus size={14} />
            <span>Thêm Danh Hiệu</span>
          </button>
        </div>
      </div>

      {/* Titles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredTitles.map((title) => {
          const flairClass = FLAIR_THEME_CLASSES[title.flairTheme] || FLAIR_THEME_CLASSES.gold;
          return (
            <div
              key={title.id}
              className="bg-surface rounded-xl border border-border p-4 shadow-card hover:border-border-strong hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-text-muted">
                    {title.code}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase font-mono bg-surface-subtle border border-border text-text-muted">
                    {title.rarity}
                  </span>
                </div>

                {/* Styled Flair Badge */}
                <div className="my-2.5 flex items-center justify-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs ${flairClass}`}
                  >
                    <Sparkles size={12} />
                    <span>{title.name}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
                  {title.description}
                </p>

                {/* Badge Requirement */}
                {title.requiredBadgeName && (
                  <div className="mt-2 p-2 bg-surface-subtle rounded-lg border border-border text-[11px] flex items-center gap-1.5 text-text">
                    <Award size={13} className="text-reward-hover shrink-0" />
                    <span className="truncate">
                      Yêu cầu:{' '}
                      <span className="font-bold">{title.requiredBadgeName}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Stats & Actions Footer */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="text-[11px]">
                  <span className="font-bold text-text font-mono">
                    {title.totalEquipped.toLocaleString('vi-VN')}
                  </span>{' '}
                  <span className="text-text-muted">đang đeo ({title.equipRate}%)</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditTitle(title)}
                    className="p-1 rounded-md text-text-muted hover:text-primary hover:bg-surface-subtle transition-colors"
                    title="Chỉnh sửa danh hiệu"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onArchiveTitle(title)}
                    className="p-1 rounded-md text-text-muted hover:text-danger hover:bg-surface-subtle transition-colors"
                    title="Lưu trữ danh hiệu"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
