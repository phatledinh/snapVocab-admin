import React, { useState } from 'react';
import {
  LearnerProfile,
  LearnerFilterState,
  CEFRLevel,
  LeagueTierId,
} from '../../../domains/learners/types';
import {
  Search,
  Flame,
  RotateCcw,
  Ban,
  KeyRound,
  Eye,
  ArrowUpDown,
  Download,
  Sparkles,
  CheckSquare,
  X,
  UserX,
} from 'lucide-react';

interface LearnerDirectoryTabProps {
  learners: LearnerProfile[];
  filterState: LearnerFilterState;
  onFilterChange: (newFilters: Partial<LearnerFilterState>) => void;
  onResetFilters: () => void;
  onSelectLearner: (learner: LearnerProfile) => void;
  selectedLearnerId?: string;
  onOpenStreakRecoveryModal: (learner: LearnerProfile) => void;
  onOpenBanModal: (learner: LearnerProfile) => void;
  onOpenResetPassModal: (learner: LearnerProfile) => void;
  onOpenGrantModal: (learner: LearnerProfile) => void;
  onBulkGrantQuota: (learnerIds: string[]) => void;
  onExportCsv: () => void;
}

export const LearnerDirectoryTab: React.FC<LearnerDirectoryTabProps> = ({
  learners,
  filterState,
  onFilterChange,
  onResetFilters,
  onSelectLearner,
  selectedLearnerId,
  onOpenStreakRecoveryModal,
  onOpenBanModal,
  onOpenResetPassModal,
  onOpenGrantModal,
  onBulkGrantQuota,
  onExportCsv,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === learners.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(learners.map((l) => l.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CEFR Badge class lookup
  const getCefrBadge = (cefr: CEFRLevel) => {
    switch (cefr) {
      case 'A1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'A2':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'B1':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B2':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'C1':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'C2':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // League badge config lookup
  const getLeagueBadge = (tier: LeagueTierId) => {
    switch (tier) {
      case 'diamond':
        return { label: 'Kim Cương', class: 'bg-purple-50 text-purple-700 border-purple-200', icon: '💎' };
      case 'ruby':
        return { label: 'Hồng Ngọc', class: 'bg-rose-50 text-rose-700 border-rose-200', icon: '🔴' };
      case 'platinum':
        return { label: 'Bạch Kim', class: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: '⚪' };
      case 'gold':
        return { label: 'Vàng', class: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🟡' };
      case 'silver':
        return { label: 'Bạc', class: 'bg-slate-100 text-slate-700 border-slate-300', icon: '🔘' };
      case 'bronze':
      default:
        return { label: 'Đồng', class: 'bg-stone-100 text-stone-700 border-stone-300', icon: '🟤' };
    }
  };

  const hasActiveFilters =
    filterState.searchQuery !== '' ||
    filterState.status !== 'ALL' ||
    filterState.cefr !== 'ALL' ||
    filterState.league !== 'ALL' ||
    filterState.streakTier !== 'ALL';

  return (
    <div className="space-y-3">
      {/* 1. Multi-Tier Filter Bar (Data-Dense Operator Interface) */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card space-y-2.5 select-none">
        {/* Row 1: Search & Status Pills & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Tìm kiếm theo Tên, Email hoặc Mã ID (USR-XXXX)..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-border bg-surface text-xs text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Status Pills */}
          <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-lg border border-border text-xs">
            {(
              [
                { id: 'ALL', label: 'Tất cả' },
                { id: 'active', label: 'Hoạt động' },
                { id: 'suspended', label: 'Đã khóa' },
                { id: 'unverified', label: 'Chưa kích hoạt' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onFilterChange({ status: st.id })}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all ${
                  filterState.status === st.id
                    ? 'bg-surface text-text shadow-xs font-bold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text shadow-xs transition-all cursor-pointer"
          >
            <Download size={13} className="text-text-muted" />
            <span>Xuất CSV</span>
          </button>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter CEFR */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted font-medium">CEFR:</span>
              <select
                value={filterState.cefr}
                onChange={(e) =>
                  onFilterChange({ cefr: e.target.value as 'ALL' | CEFRLevel })
                }
                className="px-2 py-1 rounded-md border border-border bg-surface text-[11px] font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="ALL">Tất cả Cấp độ</option>
                <option value="A1">A1 - Sơ cấp</option>
                <option value="A2">A2 - Tiền trung cấp</option>
                <option value="B1">B1 - Trung cấp</option>
                <option value="B2">B2 - Hậu trung cấp</option>
                <option value="C1">C1 - Cao cấp</option>
                <option value="C2">C2 - Thành thạo</option>
              </select>
            </div>

            {/* Filter Streak Tier */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted font-medium">Streak:</span>
              <select
                value={filterState.streakTier}
                onChange={(e) =>
                  onFilterChange({
                    streakTier: e.target.value as LearnerFilterState['streakTier'],
                  })
                }
                className="px-2 py-1 rounded-md border border-border bg-surface text-[11px] font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="ALL">Tất cả chuỗi</option>
                <option value="zero">Đứt chuỗi (0 ngày)</option>
                <option value="active_1_7">1 - 7 ngày</option>
                <option value="streak_8_30">8 - 30 ngày</option>
                <option value="streak_30_plus">&gt; 30 ngày (Kỳ cựu)</option>
                <option value="at_risk">⚠️ Nguy cơ đứt chuỗi</option>
              </select>
            </div>

            {/* Filter League */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted font-medium">League:</span>
              <select
                value={filterState.league}
                onChange={(e) =>
                  onFilterChange({
                    league: e.target.value as 'ALL' | LeagueTierId,
                  })
                }
                className="px-2 py-1 rounded-md border border-border bg-surface text-[11px] font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="ALL">Tất cả Giải đấu</option>
                <option value="diamond">💎 Kim Cương</option>
                <option value="ruby">🔴 Hồng Ngọc</option>
                <option value="platinum">⚪ Bạch Kim</option>
                <option value="gold">🟡 Vàng</option>
                <option value="silver">🔘 Bạc</option>
                <option value="bronze">🟤 Đồng</option>
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] text-danger hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X size={12} />
                <span>Đặt lại lọc</span>
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-text-muted font-medium">Sắp xếp:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as LearnerFilterState['sortBy'],
                })
              }
              className="px-2 py-1 rounded-md border border-border bg-surface text-[11px] font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="lastActive">Hoạt động gần nhất</option>
              <option value="streak">Chuỗi Streak cao nhất</option>
              <option value="xp">Tổng XP tích lũy</option>
              <option value="cards">Thẻ FSRS Mastered</option>
              <option value="name">Tên học viên (A-Z)</option>
              <option value="newest">Mới gia nhập</option>
            </select>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  sortDirection: filterState.sortDirection === 'asc' ? 'desc' : 'asc',
                })
              }
              className="p-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text cursor-pointer"
              title={`Đổi chiều sắp xếp: ${filterState.sortDirection.toUpperCase()}`}
            >
              <ArrowUpDown size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Bulk Action Bar (Hiển thị khi chọn >= 1 học viên) */}
      {selectedIds.length > 0 && (
        <div className="bg-primary-light border border-primary/30 rounded-xl px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs select-none animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-primary font-bold">
            <CheckSquare size={16} />
            <span>Đã chọn {selectedIds.length} học viên</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBulkGrantQuota(selectedIds)}
              className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Tặng +5 Lượt AI Scan hôm nay</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 rounded-lg border border-primary/20 bg-surface hover:bg-surface-subtle text-text-muted font-semibold text-xs transition-all cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 3. Data-Dense TanStack-Style Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      learners.length > 0 && selectedIds.length === learners.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                  />
                </th>
                <th className="p-3 min-w-[220px]">Học Viên & Định Danh</th>
                <th className="p-3 w-20 text-center">CEFR</th>
                <th className="p-3 min-w-[130px]">Chuỗi Streak</th>
                <th className="p-3 min-w-[130px]">Tiền Tệ & League</th>
                <th className="p-3 min-w-[150px]">Tiến Độ FSRS (SRS)</th>
                <th className="p-3 min-w-[120px]">AI Scan Quota</th>
                <th className="p-3 w-28 text-center">Trạng Thái</th>
                <th className="p-3 w-28 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {learners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-text-muted">
                    <UserX size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">Không tìm thấy học viên nào</p>
                    <p className="text-[11px] mt-0.5">
                      Hãy thử xóa hoặc điều chỉnh bộ lọc tìm kiếm
                    </p>
                  </td>
                </tr>
              ) : (
                learners.map((learner) => {
                  const isSelected = selectedIds.includes(learner.id);
                  const isCurrentRow = selectedLearnerId === learner.id;
                  const league = getLeagueBadge(learner.economy.league);

                  return (
                    <tr
                      key={learner.id}
                      onClick={() => onSelectLearner(learner)}
                      className={`cursor-pointer transition-all hover:bg-surface-subtle/60 ${
                        isCurrentRow
                          ? 'bg-primary-light/25 hover:bg-primary-light/35'
                          : isSelected
                          ? 'bg-primary-light/10'
                          : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="p-3 text-center"
                        onClick={(e) => handleToggleRow(learner.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>

                      {/* Learner Identity */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <img
                              src={learner.avatar}
                              alt={learner.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-border shadow-xs"
                            />
                            {learner.status === 'active' && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                            )}
                          </div>
                          <div className="truncate min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-text text-xs hover:text-primary transition-colors truncate">
                                {learner.fullName}
                              </span>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-surface-subtle border border-border text-text-muted shrink-0">
                                {learner.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-0.5">
                              <span className="truncate">{learner.email}</span>
                              <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600 font-mono uppercase">
                                {learner.devicePlatform}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CEFR Level */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] border shadow-2xs ${getCefrBadge(
                            learner.cefrLevel
                          )}`}
                        >
                          {learner.cefrLevel}
                        </span>
                      </td>

                      {/* Streak Flame */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center ${
                              learner.streak.currentStreak > 0
                                ? 'bg-snapy-light text-snapy'
                                : 'bg-surface-subtle text-text-muted'
                            }`}
                          >
                            <Flame size={14} />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-text flex items-center gap-1">
                              <span>{learner.streak.currentStreak} ngày</span>
                              {learner.streak.streakShields > 0 && (
                                <span
                                  className="text-[10px] text-info font-normal"
                                  title={`Đang có ${learner.streak.streakShields} khiên bảo vệ`}
                                >
                                  🛡️x{learner.streak.streakShields}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-text-muted">
                              Kỷ lục: {learner.streak.maxStreak} ngày
                            </div>
                          </div>
                        </div>
                        {learner.streak.isAtRisk && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-snapy font-bold bg-snapy-light px-1 py-0.2 rounded mt-1">
                            ⚠️ Nguy cơ đứt
                          </span>
                        )}
                      </td>

                      {/* Economy & League */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-text">
                          <span className="text-reward font-mono">
                            🪙 {learner.economy.coins.toLocaleString('vi-VN')}
                          </span>
                          <span className="text-text-muted font-normal">•</span>
                          <span className="text-cyan-600 font-mono">
                            💎 {learner.economy.gems}
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold border ${league.class}`}
                          >
                            <span>{league.icon}</span>
                            <span>{league.label}</span>
                          </span>
                        </div>
                      </td>

                      {/* FSRS Memory Progress */}
                      <td className="p-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-text">
                            {learner.fsrs.cardsMastered} / {learner.fsrs.totalCards}
                          </span>
                          <span className="text-[10px] text-info font-semibold">
                            {learner.fsrs.retentionRate}% nhớ
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/40">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                learner.fsrs.totalCards > 0
                                  ? (learner.fsrs.cardsMastered /
                                      learner.fsrs.totalCards) *
                                      100
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5 flex justify-between">
                          <span>Hôm nay cần ôn: <strong>{learner.fsrs.dueCardsToday}</strong></span>
                        </div>
                      </td>

                      {/* AI Scan Quota */}
                      <td className="p-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-text font-medium">
                            <strong>{learner.economy.scansUsedToday}</strong> /{' '}
                            {learner.economy.dailyScanQuota}
                          </span>
                          <span className="text-[10px] text-text-muted">lượt</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/40">
                          <div
                            className={`h-full rounded-full transition-all ${
                              learner.economy.scansUsedToday >=
                              learner.economy.dailyScanQuota
                                ? 'bg-danger'
                                : learner.economy.scansUsedToday >= 15
                                ? 'bg-snapy'
                                : 'bg-primary'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (learner.economy.scansUsedToday /
                                  learner.economy.dailyScanQuota) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="p-3 text-center">
                        {learner.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Hoạt động
                          </span>
                        )}
                        {learner.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger border border-danger/20 text-[10px] font-bold">
                            <Ban size={10} />
                            Đã khóa
                          </span>
                        )}
                        {learner.status === 'unverified' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info-light text-info border border-info/20 text-[10px] font-bold">
                            Chờ kích hoạt
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* 360 View */}
                          <button
                            type="button"
                            onClick={() => onSelectLearner(learner)}
                            className="p-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text shadow-2xs"
                            title="Xem chi tiết 360° Profile"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Streak Recovery Quick Action */}
                          <button
                            type="button"
                            onClick={() => onOpenStreakRecoveryModal(learner)}
                            className="p-1 rounded-md border border-snapy/30 bg-snapy-light hover:bg-snapy/20 text-snapy shadow-2xs"
                            title="Khôi phục chuỗi Streak (Ticket ID)"
                          >
                            <RotateCcw size={13} />
                          </button>

                          {/* Ban / Unban */}
                          <button
                            type="button"
                            onClick={() => onOpenBanModal(learner)}
                            className={`p-1 rounded-md border shadow-2xs ${
                              learner.status === 'suspended'
                                ? 'border-primary/30 bg-primary-light text-primary hover:bg-primary/20'
                                : 'border-danger/30 bg-danger-light text-danger hover:bg-danger/20'
                            }`}
                            title={
                              learner.status === 'suspended'
                                ? 'Mở khóa tài khoản'
                                : 'Khóa tài khoản'
                            }
                          >
                            <Ban size={13} />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => onOpenResetPassModal(learner)}
                            className="p-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text shadow-2xs"
                            title="Reset mật khẩu người học"
                          >
                            <KeyRound size={13} />
                          </button>

                          {/* LiveOps Grant */}
                          <button
                            type="button"
                            onClick={() => onOpenGrantModal(learner)}
                            className="p-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-snapy shadow-2xs"
                            title="Cấp thêm Quota AI Scan / Bồi thường"
                          >
                            <Sparkles size={13} />
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

        {/* Table Footer / Summary */}
        <div className="px-4 py-2.5 bg-surface-subtle/60 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>
            Hiển thị <strong>{learners.length}</strong> học viên
          </span>
          <span className="font-mono">
            Hệ thống: Spring Boot REST &bullet; TanStack Data-Dense Standard
          </span>
        </div>
      </div>
    </div>
  );
};
