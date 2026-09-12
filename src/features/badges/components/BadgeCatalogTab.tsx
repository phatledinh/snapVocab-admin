import React, { useState, useMemo } from 'react';
import {
  Badge,
  HonoraryTitle,
  BadgeFilterState,
  BadgeCategory,
  BadgeTier,
  BadgeStatus,
} from '../../../domains/badges/types';
import { filterAndSortBadges } from '../../../domains/badges/selectors';
import { MobileBadgeSimulator } from './MobileBadgeSimulator';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Edit,
  Copy,
  Archive,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  Coins,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface BadgeCatalogTabProps {
  badges: Badge[];
  titles: HonoraryTitle[];
  onAddBadge: () => void;
  onEditBadge: (b: Badge) => void;
  onInspectBadge: (b: Badge) => void;
  onDuplicateBadge: (b: Badge) => void;
  onToggleStatus: (b: Badge) => void;
  onArchiveBadge: (b: Badge) => void;
}

const TIER_METALLIC_CLASSES: Record<BadgeTier, { border: string; bg: string; text: string; badge: string }> = {
  bronze: {
    border: 'border-amber-700/50',
    bg: 'bg-gradient-to-b from-amber-50 to-amber-100',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  silver: {
    border: 'border-slate-400',
    bg: 'bg-gradient-to-b from-slate-50 to-slate-100',
    text: 'text-slate-800',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  gold: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-900 border-amber-400',
  },
  platinum: {
    border: 'border-sky-400',
    bg: 'bg-gradient-to-b from-sky-50 to-cyan-100',
    text: 'text-sky-800',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  diamond: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-b from-purple-50 via-fuchsia-50 to-purple-100',
    text: 'text-purple-900',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
  },
};

export const BadgeCatalogTab: React.FC<BadgeCatalogTabProps> = ({
  badges,
  titles,
  onAddBadge,
  onEditBadge,
  onInspectBadge,
  onDuplicateBadge,
  onToggleStatus,
  onArchiveBadge,
}) => {
  // View mode: 'table' vs 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showSimulator, setShowSimulator] = useState(true);

  // Filter state
  const [filterState, setFilterState] = useState<BadgeFilterState>({
    searchQuery: '',
    category: 'ALL',
    tier: 'ALL',
    status: 'ALL',
    sortBy: 'tier',
  });

  const [selectedBadgeForMobile, setSelectedBadgeForMobile] = useState<Badge | null>(null);

  // Filtered and sorted badges
  const displayedBadges = useMemo(() => {
    return filterAndSortBadges(badges, filterState);
  }, [badges, filterState]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start select-none">
      {/* Left / Center Work Area: Filters, Table, Grid */}
      <div className="flex-1 w-full space-y-3">
        {/* Filter Toolbar */}
        <div className="bg-surface border border-border rounded-xl p-3 shadow-card space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Tìm theo tên, mã (BDG-...), mô tả..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface-subtle text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* View Switcher & Simulator Toggle */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'table'
                      ? 'bg-surface text-text font-bold shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                  title="Bảng dữ liệu Data-Dense"
                >
                  <TableIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'grid'
                      ? 'bg-surface text-text font-bold shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                  title="Tủ trưng bày Cúp (Showcase Grid)"
                >
                  <LayoutGrid size={14} />
                </button>
              </div>

              {/* Toggle Simulator */}
              <button
                type="button"
                onClick={() => setShowSimulator(!showSimulator)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showSimulator
                    ? 'bg-snapy-light text-snapy border-snapy/30 shadow-xs'
                    : 'bg-surface text-text-muted border-border hover:text-text'
                }`}
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">
                  {showSimulator ? 'Ẩn Simulator' : 'Hiện Simulator'}
                </span>
              </button>

              {/* Add Button */}
              <button
                type="button"
                onClick={onAddBadge}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>Thêm Mới</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/60 text-xs">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted font-medium">Nhóm:</span>
              <select
                value={filterState.category}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    category: e.target.value as 'ALL' | BadgeCategory,
                  }))
                }
                className="text-xs p-1 rounded-md border border-border bg-surface text-text font-medium"
              >
                <option value="ALL">Tất cả nhóm</option>
                <option value="streak">Chuỗi ngày (Streak)</option>
                <option value="scan">Quét AI Camera</option>
                <option value="vocabulary">Vốn từ vựng (SRS)</option>
                <option value="quiz">Trắc nghiệm (Quiz)</option>
                <option value="league">Giải đấu & Xếp hạng</option>
                <option value="special_event">Sự kiện đặc biệt</option>
              </select>
            </div>

            {/* Tier Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted font-medium">Độ hiếm:</span>
              <select
                value={filterState.tier}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    tier: e.target.value as 'ALL' | BadgeTier,
                  }))
                }
                className="text-xs p-1 rounded-md border border-border bg-surface text-text font-medium uppercase font-mono"
              >
                <option value="ALL">Tất cả bậc</option>
                <option value="bronze">Bronze (Đồng)</option>
                <option value="silver">Silver (Bạc)</option>
                <option value="gold">Gold (Vàng)</option>
                <option value="platinum">Platinum (Bạch Kim)</option>
                <option value="diamond">Diamond (Kim Cương)</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted font-medium">Trạng thái:</span>
              <select
                value={filterState.status}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    status: e.target.value as 'ALL' | BadgeStatus,
                  }))
                }
                className="text-xs p-1 rounded-md border border-border bg-surface text-text font-medium"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="active">Active (Hoạt động)</option>
                <option value="secret">Secret (Bí mật ???)</option>
                <option value="draft">Draft (Bản nháp)</option>
                <option value="archived">Archived (Lưu trữ)</option>
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-[11px] text-text-muted font-medium">Sắp xếp:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="text-xs p-1 rounded-md border border-border bg-surface text-text font-medium"
              >
                <option value="tier">Độ hiếm (Cao ➔ Thấp)</option>
                <option value="earners">Số người đạt</option>
                <option value="unlockRate">Tỷ lệ mở khóa (Hiếm nhất)</option>
                <option value="newest">Mới cập nhật</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1. DATA-DENSE TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="p-3 w-14 text-center">Huy Hiệu</th>
                    <th className="p-3">Mã & Tên Thành Tựu</th>
                    <th className="p-3">Nhóm / Bậc</th>
                    <th className="p-3">Tiêu Chuẩn Mở Khóa</th>
                    <th className="p-3">Phần Thưởng</th>
                    <th className="p-3">Tỷ Lệ Mở Khóa</th>
                    <th className="p-3">Trạng Thái</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {displayedBadges.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-text-muted text-xs">
                        Không tìm thấy huy hiệu phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    displayedBadges.map((b) => {
                      const tierStyle = TIER_METALLIC_CLASSES[b.tier];
                      return (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBadgeForMobile(b)}
                          className="hover:bg-surface-subtle/70 transition-colors group cursor-pointer"
                        >
                          {/* Icon */}
                          <td className="p-3 text-center">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl mx-auto border ${tierStyle.border} ${tierStyle.bg} shadow-2xs`}
                            >
                              <span>{b.isSecret && b.status === 'secret' ? '❓' : b.icon}</span>
                            </div>
                          </td>

                          {/* Code & Name */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono text-[10px] font-bold text-text-muted">
                                {b.code}
                              </span>
                              {b.isSecret && (
                                <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-700 border border-purple-200">
                                  Bí Mật
                                </span>
                              )}
                              {b.seriesId && (
                                <span className="text-[9px] font-bold px-1 rounded bg-surface-subtle text-text-muted border border-border">
                                  Lv.{b.seriesLevel}
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-text hover:text-primary transition-colors text-xs">
                              {b.name}
                            </div>
                            <p className="text-[11px] text-text-muted line-clamp-1 max-w-xs mt-0.5">
                              {b.description}
                            </p>
                          </td>

                          {/* Category & Tier */}
                          <td className="p-3">
                            <div className="space-y-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono uppercase inline-block ${tierStyle.badge}`}
                              >
                                {b.tier}
                              </span>
                              <div className="text-[11px] text-text-muted capitalize">
                                {b.category}
                              </div>
                            </div>
                          </td>

                          {/* Trigger Criteria */}
                          <td className="p-3">
                            <div className="font-bold text-text text-xs">
                              {b.targetValue} {b.targetUnit}
                            </div>
                            <span className="text-[10px] font-mono text-text-muted block">
                              {b.unlockMetric}
                            </span>
                          </td>

                          {/* Reward */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-text">
                              <span>+{b.reward.coins}c</span>
                              <span className="text-text-muted">+{b.reward.xp}xp</span>
                              {b.reward.gems && (
                                <span className="text-snapy">+{b.reward.gems}g</span>
                              )}
                            </div>
                            {b.reward.titleName && (
                              <span className="text-[10px] font-semibold text-reward-hover line-clamp-1 mt-0.5 block">
                                {b.reward.titleName}
                              </span>
                            )}
                          </td>

                          {/* Unlock Rate & Earners */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-text font-mono text-xs">
                                {b.unlockRate}%
                              </span>
                              <span className="text-[10px] text-text-muted">
                                ({b.totalEarners.toLocaleString('vi-VN')})
                              </span>
                            </div>
                            <div className="w-20 bg-surface-subtle border border-border rounded-full h-1.5 mt-1 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(3, b.unlockRate))}%`,
                                }}
                              />
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                                b.status === 'active'
                                  ? 'bg-primary-light text-primary border border-primary/20'
                                  : b.status === 'secret'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : b.status === 'draft'
                                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => onInspectBadge(b)}
                                className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-subtle"
                                title="Xem chi tiết thanh tra"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditBadge(b)}
                                className="p-1 rounded-md text-text-muted hover:text-primary hover:bg-surface-subtle"
                                title="Chỉnh sửa huy hiệu"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDuplicateBadge(b)}
                                className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-subtle"
                                title="Nhân bản bản sao"
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onArchiveBadge(b)}
                                className="p-1 rounded-md text-text-muted hover:text-danger hover:bg-surface-subtle"
                                title="Lưu trữ"
                              >
                                <Archive size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. VISUAL TROPHY CASE (SHOWCASE GRID) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {displayedBadges.map((b) => {
              const tierStyle = TIER_METALLIC_CLASSES[b.tier];
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBadgeForMobile(b);
                    onInspectBadge(b);
                  }}
                  className={`bg-surface rounded-xl border p-4 shadow-card hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group ${tierStyle.border}`}
                >
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-text-muted">
                      {b.code}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase font-mono ${tierStyle.badge}`}
                    >
                      {b.tier}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 my-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${tierStyle.border} ${tierStyle.bg} shrink-0`}
                    >
                      <span>{b.isSecret && b.status === 'secret' ? '❓' : b.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text group-hover:text-primary transition-colors leading-tight">
                        {b.name}
                      </h4>
                      <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                        {b.description}
                      </p>
                    </div>
                  </div>

                  {/* Criteria & Rate */}
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-text-muted">
                      {b.targetValue} {b.targetUnit}
                    </span>
                    <span className="font-bold text-primary font-mono">
                      {b.unlockRate}% đạt
                    </span>
                  </div>

                  {/* Rewards Footer */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
                    <span className="font-mono font-semibold text-text">
                      +{b.reward.coins} Coins · +{b.reward.xp} XP
                    </span>
                    <ChevronRight size={14} className="text-text-muted group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Side: Persistent Mobile Simulator */}
      {showSimulator && (
        <MobileBadgeSimulator
          badges={badges}
          titles={titles}
          selectedBadgeForDetail={selectedBadgeForMobile}
          onSelectBadge={setSelectedBadgeForMobile}
          onClose={() => setShowSimulator(false)}
        />
      )}
    </div>
  );
};
