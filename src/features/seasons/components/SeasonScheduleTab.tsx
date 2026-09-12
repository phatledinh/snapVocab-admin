import React, { useState } from 'react';
import { Season, SeasonStatus } from '../../../domains/seasons/types';
import { filterAndSortSeasons } from '../../../domains/seasons/selectors';
import {
  Calendar,
  Search,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Flame,
  Users,
  Award,
  AlertCircle,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface SeasonScheduleTabProps {
  seasons: Season[];
  onOpenCreateModal: () => void;
  onSelectSeasonForSimulator?: (season: Season) => void;
  onTriggerAuditAction: (config: {
    title: string;
    description: string;
    isDangerous: boolean;
    actionLabel: string;
    onConfirm: (reason: string) => void;
  }) => void;
  onUpdateSeasonStatus: (seasonId: string, status: SeasonStatus, reason?: string) => void;
  onToast: (msg: string) => void;
}

export const SeasonScheduleTab: React.FC<SeasonScheduleTabProps> = ({
  seasons,
  onOpenCreateModal,
  onSelectSeasonForSimulator,
  onTriggerAuditAction,
  onUpdateSeasonStatus,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSeasons = filterAndSortSeasons(seasons, searchQuery, statusFilter);
  const activeSeason = seasons.find((s) => s.status === 'active') || seasons[0];

  const handleFreezeSeason = (season: Season) => {
    const isCurrentlyFrozen = season.status === 'frozen';
    onTriggerAuditAction({
      title: isCurrentlyFrozen
        ? `Mở Lại Bảng Xếp Hạng: ${season.name}`
        : `Đóng Băng Khẩn Cấp Bảng Xếp Hạng: ${season.name}`,
      description: isCurrentlyFrozen
        ? 'Bảng xếp hạng sẽ tiếp tục tích lũy và cập nhật XP cho người học thời gian thực.'
        : 'Toàn bộ điểm XP mới sẽ tạm ngừng cập nhật trên bảng xếp hạng để bảo trì hoặc điều tra bug. Bắt buộc nhập lý do kiểm toán.',
      isDangerous: !isCurrentlyFrozen,
      actionLabel: isCurrentlyFrozen ? 'Mở Lại Xếp Hạng' : 'Đóng Băng Ngay',
      onConfirm: (reason) => {
        onUpdateSeasonStatus(season.id, isCurrentlyFrozen ? 'active' : 'frozen', reason);
        onToast(
          isCurrentlyFrozen
            ? `Đã mở lại bảng xếp hạng mùa ${season.code}`
            : `Đã đóng băng khẩn cấp mùa ${season.code}`
        );
      },
    });
  };

  const handleSettleSeason = (season: Season) => {
    onTriggerAuditAction({
      title: `Chốt Sổ & Phân Phối Phần Thưởng: ${season.name}`,
      description:
        'Hệ thống sẽ khóa bảng xếp hạng, chốt thứ hạng chung cuộc của toàn bộ học viên trong 494 cohorts, tự động gửi Rương phần thưởng (Coins, Gems, Titles) vào Hộp thư và thực hiện thăng/rớt hạng. Thao tác này không thể hoàn tác.',
      isDangerous: true,
      actionLabel: 'Chốt Sổ & Trả Thưởng',
      onConfirm: (reason) => {
        onUpdateSeasonStatus(season.id, 'completed', reason);
        onToast(`Đã hoàn tất chốt sổ và kết toán phần thưởng mùa ${season.code}`);
      },
    });
  };

  const handleStartUpcomingSeason = (season: Season) => {
    onTriggerAuditAction({
      title: `Kích Hoạt Mùa Giải: ${season.name}`,
      description:
        'Chuyển mùa giải sang trạng thái ACTIVE ngay lập tức. Các bảng đấu Cohort sẽ được khởi tạo và nhận dữ liệu XP từ học viên.',
      isDangerous: false,
      actionLabel: 'Kích Hoạt Mùa Giải',
      onConfirm: (reason) => {
        onUpdateSeasonStatus(season.id, 'active', reason);
        onToast(`Đã kích hoạt thành công mùa ${season.code}`);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Active Season Spotlight Card */}
      {activeSeason && (
        <div className="bg-gradient-to-r from-surface to-snapy-light/20 border border-snapy/30 rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-snapy-light text-snapy font-bold text-[11px] font-mono border border-snapy/20">
                ACTIVE SEASON
              </span>
              <span className="text-xs text-text-muted font-medium">
                Chu kỳ: <strong className="text-text">Tuần (00:00 Thứ 2 - 23:59 CN)</strong>
              </span>
              <span className="text-border-strong">·</span>
              <span className="text-xs text-snapy font-semibold flex items-center gap-1">
                <Sparkles size={12} /> {activeSeason.theme}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-text tracking-tight flex items-center gap-2">
              {activeSeason.name}
              <span className="text-xs font-mono font-bold text-text-muted">
                ({activeSeason.code})
              </span>
            </h3>
            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              {activeSeason.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-info" />
                <strong className="text-text font-mono">
                  {activeSeason.totalParticipants.toLocaleString('vi-VN')}
                </strong>{' '}
                học viên
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={13} className="text-reward" />
                <strong className="text-text font-mono">
                  {activeSeason.totalCohorts}
                </strong>{' '}
                phòng đấu (Cohorts)
              </span>
              <span className="flex items-center gap-1.5">
                <Flame size={13} className="text-snapy" />
                <strong className="text-text font-mono">
                  {(activeSeason.totalXpAccumulated / 1000000).toFixed(2)}M
                </strong>{' '}
                Weekly XP
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {activeSeason.status === 'frozen' ? (
              <button
                type="button"
                onClick={() => handleFreezeSeason(activeSeason)}
                className="px-3 py-2 rounded-lg bg-info-light hover:bg-info/20 text-info font-bold text-xs flex items-center gap-1.5 transition-all border border-info/30"
              >
                <Play size={13} />
                <span>Mở Lại Bảng Xếp Hạng</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFreezeSeason(activeSeason)}
                className="px-3 py-2 rounded-lg bg-surface hover:bg-danger-light text-text-muted hover:text-danger font-semibold text-xs flex items-center gap-1.5 transition-all border border-border hover:border-danger/30"
                title="Tạm dừng ghi nhận XP mới trong mùa giải"
              >
                <Pause size={13} />
                <span>Đóng Băng Xếp Hạng</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSettleSeason(activeSeason)}
              className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 size={13} />
              <span>Chốt Sổ & Trả Thưởng</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Search, Filter & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mùa giải theo tên, mã code hoặc chủ đề..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-text focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang diễn ra (Active)</option>
            <option value="upcoming">Sắp mở (Upcoming)</option>
            <option value="completed">Đã kết thúc (Completed)</option>
            <option value="frozen">Đang đóng băng (Frozen)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Plus size={14} />
          <span>Tạo Mùa Giải Mới</span>
        </button>
      </div>

      {/* 3. Data-Dense Seasons Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
                <th className="py-2.5 px-3.5">Mã & Tên Mùa Giải</th>
                <th className="py-2.5 px-3">Chu Kỳ</th>
                <th className="py-2.5 px-3">Thời Gian Vận Hành</th>
                <th className="py-2.5 px-3">Trạng Thái</th>
                <th className="py-2.5 px-3">Quy Mô Người Học</th>
                <th className="py-2.5 px-3">Tổng XP Tích Lũy</th>
                <th className="py-2.5 px-3">Audit / Người Tạo</th>
                <th className="py-2.5 px-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredSeasons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    Không tìm thấy mùa giải nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredSeasons.map((season) => {
                  const isActive = season.status === 'active';
                  const isUpcoming = season.status === 'upcoming';
                  const isCompleted = season.status === 'completed';
                  const isFrozen = season.status === 'frozen';

                  return (
                    <tr
                      key={season.id}
                      className="hover:bg-surface-subtle/80 transition-colors group"
                    >
                      {/* Name & Code */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-snapy-light text-snapy border border-snapy/20'
                                : isUpcoming
                                ? 'bg-info-light text-info border border-info/20'
                                : 'bg-canvas text-text-muted border border-border'
                            }`}
                          >
                            <Calendar size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-text group-hover:text-primary transition-colors flex items-center gap-1.5">
                              <span>{season.name}</span>
                              {season.theme && (
                                <span className="text-[10px] text-snapy font-medium">
                                  · {season.theme}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-text-muted">
                              {season.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cycle Type */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-canvas border border-border text-text">
                          {season.cycleType === 'weekly'
                            ? 'Tuần (Weekly)'
                            : season.cycleType === 'monthly'
                            ? 'Tháng (Monthly)'
                            : 'Sự Kiện Đặc Biệt'}
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="py-3 px-3 text-[11px] text-text-muted font-mono leading-tight">
                        <div>
                          Từ:{' '}
                          <span className="text-text font-medium">
                            {new Date(season.startDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div>
                          Đến:{' '}
                          <span className="text-text font-medium">
                            {new Date(season.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-light text-primary font-bold text-[11px] border border-primary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Đang Diễn Ra
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info-light text-info font-bold text-[11px] border border-info/20">
                            <Clock size={11} /> Sắp Mở
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                            <CheckCircle2 size={11} /> Đã Kết Thúc
                          </span>
                        )}
                        {isFrozen && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger font-bold text-[11px] border border-danger/20">
                            <ShieldAlert size={11} /> Đóng Băng
                          </span>
                        )}
                      </td>

                      {/* Learners & Cohorts */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div>
                          <strong className="text-text">
                            {season.totalParticipants.toLocaleString('vi-VN')}
                          </strong>{' '}
                          học viên
                        </div>
                        <div className="text-text-muted">
                          {season.totalCohorts} cohorts
                        </div>
                      </td>

                      {/* Total XP */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="font-bold text-text">
                          {(season.totalXpAccumulated / 1000000).toFixed(2)}M
                        </span>{' '}
                        <span className="text-text-muted">XP</span>
                      </td>

                      {/* Created By & Audit */}
                      <td className="py-3 px-3 text-[11px] text-text-muted max-w-[180px] truncate">
                        <div className="font-medium text-text truncate">
                          {season.createdBy}
                        </div>
                        <div className="truncate text-[10px]" title={season.auditNotes}>
                          {season.auditNotes || '—'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {isUpcoming && (
                            <button
                              type="button"
                              onClick={() => handleStartUpcomingSeason(season)}
                              className="px-2.5 py-1 rounded bg-primary-light hover:bg-primary text-primary hover:text-white font-bold text-[11px] transition-all"
                            >
                              Kích Hoạt
                            </button>
                          )}

                          {isActive && (
                            <button
                              type="button"
                              onClick={() => handleFreezeSeason(season)}
                              className="p-1.5 rounded hover:bg-canvas text-text-muted hover:text-danger transition-colors"
                              title="Đóng băng bảng xếp hạng"
                            >
                              <Pause size={14} />
                            </button>
                          )}

                          {isFrozen && (
                            <button
                              type="button"
                              onClick={() => handleFreezeSeason(season)}
                              className="p-1.5 rounded hover:bg-canvas text-info transition-colors"
                              title="Mở lại bảng xếp hạng"
                            >
                              <Play size={14} />
                            </button>
                          )}

                          {onSelectSeasonForSimulator && (
                            <button
                              type="button"
                              onClick={() => onSelectSeasonForSimulator(season)}
                              className="p-1.5 rounded hover:bg-canvas text-text-muted hover:text-primary transition-colors"
                              title="Xem thử trên Mobile Simulator"
                            >
                              <ExternalLink size={14} />
                            </button>
                          )}
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
    </div>
  );
};
