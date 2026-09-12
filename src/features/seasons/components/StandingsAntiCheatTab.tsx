import React, { useState } from 'react';
import {
  LeaderboardStandingEntry,
  CohortGroup,
  LeagueTierId,
  AnomalyViolation,
} from '../../../domains/seasons/types';
import { filterAndSortStandings } from '../../../domains/seasons/selectors';
import {
  Trophy,
  Search,
  Filter,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame,
  Camera,
  Layers,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  UserX,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface StandingsAntiCheatTabProps {
  standings: LeaderboardStandingEntry[];
  cohorts: CohortGroup[];
  anomalies: AnomalyViolation[];
  selectedCohortId: string;
  onSelectCohortId: (cohortId: string) => void;
  onDeductXp: (entry: LeaderboardStandingEntry) => void;
  onDisqualifyLearner: (entry: LeaderboardStandingEntry) => void;
  onDismissAnomaly: (anomalyId: string) => void;
  onInspectLearner?: (entry: LeaderboardStandingEntry) => void;
}

export const StandingsAntiCheatTab: React.FC<StandingsAntiCheatTabProps> = ({
  standings,
  cohorts,
  anomalies,
  selectedCohortId,
  onSelectCohortId,
  onDeductXp,
  onDisqualifyLearner,
  onDismissAnomaly,
  onInspectLearner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('all');

  const activeCohort =
    cohorts.find((c) => c.id === selectedCohortId) || cohorts[0];

  // Lọc dữ liệu hiển thị
  const filteredStandings = filterAndSortStandings(
    standings.filter((s) => {
      const matchesCohort =
        selectedCohortId === 'all' || s.cohortId === selectedCohortId;
      const matchesLeague =
        selectedLeagueFilter === 'all' || s.leagueId === selectedLeagueFilter;
      return matchesCohort && matchesLeague;
    }),
    searchQuery,
    statusFilter
  );

  const pendingAnomalies = anomalies.filter(
    (a) => a.status === 'pending_review'
  );

  return (
    <div className="space-y-4">
      {/* 1. Anomaly Banner (Cảnh báo gian lận & tăng tốc bất thường) */}
      {pendingAnomalies.length > 0 && (
        <div className="bg-danger-light/60 border border-danger/30 rounded-xl p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-danger text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <AlertTriangle size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-extrabold text-danger uppercase tracking-wider">
                    Phát Hiện {pendingAnomalies.length} Trường Hợp Tăng XP Bất Thường
                    (Velocity Spike)
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-danger text-white font-bold text-[10px]">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Động cơ Anti-Cheat tự động gắn cờ tài khoản tăng trên 2,000 XP
                  trong thời gian ngắn qua API submission không hợp lệ. Quản trị viên
                  cần xác minh và đưa ra biện pháp kỷ luật.
                </p>

                {/* Danh sách các vụ vi phạm chờ duyệt */}
                <div className="mt-3 space-y-2">
                  {pendingAnomalies.map((anm) => {
                    const matchedStanding = standings.find(
                      (s) => s.learner.id === anm.learnerId
                    );
                    return (
                      <div
                        key={anm.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-surface border border-danger/20 text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={anm.learnerAvatar}
                            alt={anm.learnerName}
                            className="w-7 h-7 rounded-full object-cover border border-danger/40"
                          />
                          <div>
                            <div className="font-bold text-text flex items-center gap-1.5">
                              <span>{anm.learnerName}</span>
                              <span className="text-[10px] font-mono font-semibold text-danger">
                                +{anm.xpDelta} XP / {Math.round(anm.timeWindowSeconds / 60)} phút
                              </span>
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">
                              Phòng: {anm.cohortId} · Phát hiện lúc:{' '}
                              {new Date(anm.detectedAt).toLocaleTimeString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          {matchedStanding && (
                            <button
                              type="button"
                              onClick={() => onDeductXp(matchedStanding)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <RotateCcw size={12} />
                              <span>Trừ 2,000 XP</span>
                            </button>
                          )}

                          {matchedStanding && (
                            <button
                              type="button"
                              onClick={() => onDisqualifyLearner(matchedStanding)}
                              className="px-2.5 py-1 rounded bg-danger hover:bg-danger-hover text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <UserX size={12} />
                              <span>Truất Quyền</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDismissAnomaly(anm.id)}
                            className="px-2 py-1 rounded bg-canvas hover:bg-surface-subtle text-text-muted hover:text-text text-[11px] border border-border"
                          >
                            Bỏ qua
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cohort Selector & Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm học viên theo tên, email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* League Filter */}
          <select
            value={selectedLeagueFilter}
            onChange={(e) => setSelectedLeagueFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-text focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả Hạng Đấu</option>
            <option value="diamond">👑 Kim Cương (Diamond)</option>
            <option value="ruby">💎 Hồng Ngọc (Ruby)</option>
            <option value="platinum">💠 Bạch Kim (Platinum)</option>
            <option value="gold">🥇 Hạng Vàng (Gold)</option>
            <option value="silver">🥈 Hạng Bạc (Silver)</option>
            <option value="bronze">🥉 Hạng Đồng (Bronze)</option>
          </select>

          {/* Cohort Selector */}
          <select
            value={selectedCohortId}
            onChange={(e) => onSelectCohortId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-text focus:outline-none focus:border-primary max-w-[220px]"
          >
            <option value="all">Tất cả phòng đấu</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name} ({cohort.totalMembers} học viên)
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-text focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="promotion">🟢 Vùng Thăng Hạng (Top 5)</option>
            <option value="safe">⚪ Vùng An Toàn (Rank 6-20)</option>
            <option value="demotion">🔴 Vùng Rớt Hạng (Rank 21-30)</option>
            <option value="flagged">⚠️ Nghi Vấn Gian Lận</option>
          </select>
        </div>

        {activeCohort && (
          <div className="flex items-center gap-2 text-xs text-text-muted font-mono shrink-0">
            <span className="px-2 py-1 rounded bg-canvas border border-border">
              Top 1: <strong className="text-text">{activeCohort.top1Xp} XP</strong>
            </span>
            <span className="px-2 py-1 rounded bg-primary-light text-primary font-bold">
              Mốc Top 5: ≥{activeCohort.cutoffPromotionXp} XP
            </span>
          </div>
        )}
      </div>

      {/* 3. Data-Dense Live Standings Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
                <th className="py-2.5 px-3.5">Thứ Hạng</th>
                <th className="py-2.5 px-3">Học Viên</th>
                <th className="py-2.5 px-3">Weekly XP</th>
                <th className="py-2.5 px-3">Chuỗi Streak</th>
                <th className="py-2.5 px-3">Hoạt Động Tuần</th>
                <th className="py-2.5 px-3">Phòng Đấu</th>
                <th className="py-2.5 px-3">Trạng Thái Mùa</th>
                <th className="py-2.5 px-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredStandings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    Không tìm thấy học viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredStandings.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;
                  const isPromotionZone = entry.status === 'promotion';
                  const isDemotionZone = entry.status === 'demotion';
                  const isFlagged = entry.status === 'flagged' || !!entry.anomalyFlag;

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isFlagged
                          ? 'bg-danger-light/30 hover:bg-danger-light/50'
                          : entry.learner.isCurrentUser
                          ? 'bg-primary-light/30 hover:bg-primary-light/50 font-medium'
                          : 'hover:bg-surface-subtle/80'
                      }`}
                    >
                      {/* Rank & Movement */}
                      <td className="py-2.5 px-3.5 select-none">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold font-mono text-xs shadow-xs ${
                              isTop1
                                ? 'bg-amber-400 text-amber-950 border border-amber-300'
                                : isTop2
                                ? 'bg-slate-300 text-slate-900 border border-slate-400'
                                : isTop3
                                ? 'bg-amber-700 text-white border border-amber-800'
                                : isPromotionZone
                                ? 'bg-primary-light text-primary border border-primary/20'
                                : isDemotionZone
                                ? 'bg-danger-light text-danger border border-danger/20'
                                : 'bg-canvas text-text-muted border border-border'
                            }`}
                          >
                            {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${entry.rank}`}
                          </span>

                          {/* Movement Indicator */}
                          {entry.movement === 'up' && (
                            <span className="inline-flex items-center text-primary font-mono text-[10px] font-bold">
                              <ArrowUp size={11} />
                              {entry.movementDiff}
                            </span>
                          )}
                          {entry.movement === 'down' && (
                            <span className="inline-flex items-center text-danger font-mono text-[10px] font-bold">
                              <ArrowDown size={11} />
                              {entry.movementDiff}
                            </span>
                          )}
                          {entry.movement === 'same' && (
                            <span className="text-text-light">
                              <Minus size={11} />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Learner Info */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={entry.learner.avatar}
                            alt={entry.learner.name}
                            className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                          />
                          <div>
                            <div className="font-bold text-text flex items-center gap-1.5">
                              <span>{entry.learner.name}</span>
                              <span className="px-1.5 py-0.2 rounded bg-canvas border border-border text-[9px] font-mono text-text-muted font-normal">
                                {entry.learner.levelCefr}
                              </span>
                              {entry.learner.equippedTitle && (
                                <span className="text-[10px] font-semibold text-snapy">
                                  ★ {entry.learner.equippedTitle}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">
                              {entry.learner.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Weekly XP */}
                      <td className="py-2.5 px-3 font-mono">
                        <span className="text-sm font-extrabold text-text">
                          {entry.weeklyXp.toLocaleString('vi-VN')}
                        </span>{' '}
                        <span className="text-[10px] text-text-muted">XP</span>
                      </td>

                      {/* Streak */}
                      <td className="py-2.5 px-3 font-mono text-xs">
                        <span className="inline-flex items-center gap-1 font-bold text-snapy">
                          <Flame size={13} />
                          {entry.learner.currentStreak}d
                        </span>
                      </td>

                      {/* Activity Stats */}
                      <td className="py-2.5 px-3 text-[11px] text-text-muted font-mono">
                        <div className="flex items-center gap-2.5">
                          <span title="Số bài quét AI">
                            <Camera size={11} className="inline mr-1 text-snapy" />
                            {entry.activityStats.scansCount}
                          </span>
                          <span title="Số lượt ôn thẻ SRS">
                            <Layers size={11} className="inline mr-1 text-primary" />
                            {entry.activityStats.srsReviewsCount}
                          </span>
                          <span title="Quiz hoàn hảo 100%">
                            <CheckCircle2 size={11} className="inline mr-1 text-info" />
                            {entry.activityStats.quizPerfectCount}
                          </span>
                        </div>
                      </td>

                      {/* Cohort ID */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {entry.cohortId}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        {isFlagged && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger text-white font-bold text-[10px] animate-pulse">
                            <AlertTriangle size={10} />
                            Nghi Vấn Spike
                          </span>
                        )}
                        {!isFlagged && isPromotionZone && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-light text-primary font-bold text-[10px] border border-primary/20">
                            Thăng Hạng
                          </span>
                        )}
                        {!isFlagged && entry.status === 'safe' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                            An Toàn
                          </span>
                        )}
                        {!isFlagged && isDemotionZone && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger font-bold text-[10px] border border-danger/20">
                            Rớt Hạng
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {isFlagged ? (
                            <button
                              type="button"
                              onClick={() => onDeductXp(entry)}
                              className="px-2 py-0.5 rounded bg-danger text-white font-bold text-[10px] hover:bg-danger-hover transition-all"
                            >
                              Xử Phạt
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onInspectLearner && onInspectLearner(entry)}
                              className="p-1 rounded hover:bg-canvas text-text-muted hover:text-text transition-colors"
                              title="Kiểm tra chi tiết học viên"
                            >
                              <ExternalLink size={13} />
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
