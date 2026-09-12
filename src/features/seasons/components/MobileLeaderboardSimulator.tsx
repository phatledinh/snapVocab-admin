import React, { useState } from 'react';
import {
  LeagueConfig,
  LeaderboardStandingEntry,
  Season,
  LeagueTierId,
} from '../../../domains/seasons/types';
import {
  Smartphone,
  Sparkles,
  Trophy,
  Crown,
  Flame,
  ArrowUp,
  ArrowDown,
  Clock,
  Coins,
  Gem,
  Gift,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';

interface MobileLeaderboardSimulatorProps {
  leagues: LeagueConfig[];
  standings: LeaderboardStandingEntry[];
  currentSeason?: Season;
  onClose?: () => void;
}

export const MobileLeaderboardSimulator: React.FC<
  MobileLeaderboardSimulatorProps
> = ({ leagues, standings, currentSeason, onClose }) => {
  // Screen mode: 'leaderboard' (MH-GAME-01) or 'celebration' (Season End Popup)
  const [screenMode, setScreenMode] = useState<'leaderboard' | 'celebration'>(
    'leaderboard'
  );
  const [simulatedLeagueId, setSimulatedLeagueId] =
    useState<LeagueTierId>('diamond');
  const [simulatedUserRank, setSimulatedUserRank] = useState<number>(7);

  const activeLeague =
    leagues.find((l) => l.id === simulatedLeagueId) || leagues[0];

  // Lọc danh sách standings theo cohort chuẩn
  const cohortStandings = standings.slice(0, 30);
  const top1 = cohortStandings.find((s) => s.rank === 1) || cohortStandings[0];
  const top2 = cohortStandings.find((s) => s.rank === 2) || cohortStandings[1];
  const top3 = cohortStandings.find((s) => s.rank === 3) || cohortStandings[2];

  // Học viên người dùng mô phỏng
  const myStanding =
    cohortStandings.find((s) => s.rank === simulatedUserRank) ||
    cohortStandings[6];

  const rank5Xp = cohortStandings.find((s) => s.rank === 5)?.weeklyXp || 1420;
  const xpDifferenceToPromotion = Math.max(
    0,
    rank5Xp - (myStanding?.weeklyXp || 0) + 10
  );

  return (
    <div className="w-[360px] shrink-0 flex flex-col bg-surface border border-border rounded-2xl shadow-card overflow-hidden select-none sticky top-20 max-h-[85vh]">
      {/* Simulator Control Header */}
      <div className="p-3 border-b border-border bg-canvas flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone size={15} className="text-snapy" />
          <span className="text-xs font-bold text-text">
            Mobile Simulator · MH-GAME-01
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              setScreenMode(
                screenMode === 'leaderboard' ? 'celebration' : 'leaderboard'
              )
            }
            className="px-2 py-0.5 rounded bg-primary-light text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors"
          >
            {screenMode === 'leaderboard' ? 'Xem Popup Mùa' : 'Xem Bảng Xếp Hạng'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-text-muted hover:text-text hover:bg-surface"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Simulator Quick Controls */}
      <div className="px-3 py-2 bg-canvas/60 border-b border-border text-[10px] space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-text-muted font-medium">Hạng Đấu:</span>
          <select
            value={simulatedLeagueId}
            onChange={(e) =>
              setSimulatedLeagueId(e.target.value as LeagueTierId)
            }
            className="px-1.5 py-0.5 rounded border border-border bg-surface text-text font-bold focus:outline-none"
          >
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.icon} {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-1">
          <span className="text-text-muted font-medium">Vị Trí User:</span>
          <div className="flex items-center gap-1">
            {[1, 4, 7, 28].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSimulatedUserRank(r)}
                className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                  simulatedUserRank === r
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-border text-text-muted hover:text-text'
                }`}
              >
                #{r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* iPhone 15 Pro Frame */}
      <div className="p-3 bg-neutral-900/5 flex items-center justify-center flex-1 overflow-y-auto">
        <div className="w-[300px] h-[550px] bg-slate-50 rounded-[38px] border-[6px] border-slate-800 shadow-2xl flex flex-col overflow-hidden relative font-sans">
          {/* Status Bar & Dynamic Island */}
          <div className="h-6 bg-slate-900 text-white flex items-center justify-between px-5 text-[9px] font-bold z-20 shrink-0">
            <span>09:41</span>
            <div className="w-16 h-3 bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <span className="w-2.5 h-1.5 bg-white rounded-xs inline-block" />
            </div>
          </div>

          {/* SCREEN CONTENT */}
          {screenMode === 'leaderboard' ? (
            <div className="flex-1 flex flex-col bg-[#FAFBF9] overflow-hidden relative">
              {/* App Bar / Header */}
              <div
                className="px-3.5 pt-2 pb-2 text-white shrink-0 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${activeLeague.accentColor}, #1F2937)`,
                }}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-base">{activeLeague.icon}</span>
                    <span>{activeLeague.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] bg-black/30 px-2 py-0.5 rounded-full font-mono">
                    <Clock size={9} />
                    <span>2d 14h</span>
                  </div>
                </div>
                <div className="text-[10px] opacity-90 truncate">
                  {currentSeason?.name || 'Mùa 37: Snapy Vươn Xa'}
                </div>
              </div>

              {/* Scrollable Leaderboard Body */}
              <div className="flex-1 overflow-y-auto pb-16 text-slate-800">
                {/* Podium Top 3 */}
                <div className="pt-3 pb-2 px-2 flex items-end justify-center gap-2 bg-gradient-to-b from-slate-100/80 to-transparent">
                  {/* Top 2 - Silver */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-1">
                      <img
                        src={top2.learner.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 text-slate-800 text-[9px] font-bold flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-[65px]">
                      {top2.learner.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {top2.weeklyXp} XP
                    </span>
                    <div className="w-16 h-12 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-lg mt-1 flex items-center justify-center font-extrabold text-slate-600 text-xs shadow-xs">
                      🥈
                    </div>
                  </div>

                  {/* Top 1 - Gold */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-1">
                      <Crown
                        size={16}
                        className="text-amber-500 absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow-xs"
                      />
                      <img
                        src={top1.learner.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[9px] font-bold flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-900 truncate max-w-[75px]">
                      {top1.learner.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-amber-700">
                      {top1.weeklyXp} XP
                    </span>
                    <div className="w-18 h-16 bg-gradient-to-t from-amber-300 via-amber-200 to-yellow-100 rounded-t-lg mt-1 flex items-center justify-center font-extrabold text-amber-800 text-sm shadow-sm border-t border-amber-300">
                      🥇
                    </div>
                  </div>

                  {/* Top 3 - Bronze */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-1">
                      <img
                        src={top3.learner.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-700/50 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-700 text-white text-[9px] font-bold flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-[65px]">
                      {top3.learner.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {top3.weeklyXp} XP
                    </span>
                    <div className="w-16 h-10 bg-gradient-to-t from-amber-700/40 to-amber-600/30 rounded-t-lg mt-1 flex items-center justify-center font-extrabold text-amber-900 text-xs shadow-xs">
                      🥉
                    </div>
                  </div>
                </div>

                {/* Promotion Line */}
                <div className="my-1.5 px-3 flex items-center gap-2">
                  <div className="flex-1 h-[1px] bg-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ▲ Vùng Thăng Hạng (Top 5)
                  </span>
                  <div className="flex-1 h-[1px] bg-emerald-400" />
                </div>

                {/* Standings List (Rank 4 -> 30) */}
                <div className="px-2 space-y-1">
                  {cohortStandings.slice(3).map((entry) => {
                    const isDemotion = entry.rank >= 26;
                    const isUser = entry.rank === simulatedUserRank;

                    return (
                      <React.Fragment key={entry.id}>
                        {entry.rank === 26 && (
                          <div className="my-1.5 flex items-center gap-2">
                            <div className="flex-1 h-[1px] bg-rose-400" />
                            <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              ▼ Vùng Rớt Hạng (Dưới Top 25)
                            </span>
                            <div className="flex-1 h-[1px] bg-rose-400" />
                          </div>
                        )}

                        <div
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors ${
                            isUser
                              ? 'bg-emerald-100 border border-emerald-300 font-bold'
                              : isDemotion
                              ? 'bg-rose-50/70'
                              : 'bg-white border border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 text-[10px] font-bold font-mono text-slate-500 text-center">
                              {entry.rank}
                            </span>
                            <img
                              src={entry.learner.avatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="leading-tight truncate max-w-[100px]">
                              <span className="text-[10px] text-slate-900 block truncate">
                                {isUser ? 'Bạn (Hoà Nguyễn)' : entry.learner.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="font-bold text-slate-800">
                              {entry.weeklyXp} XP
                            </span>
                            {entry.movement === 'up' && (
                              <ArrowUp size={9} className="text-emerald-600" />
                            )}
                            {entry.movement === 'down' && (
                              <ArrowDown size={9} className="text-rose-500" />
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Sticky My Rank Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs border-t border-slate-200 p-2.5 shadow-lg flex flex-col gap-1 z-10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      #{simulatedUserRank}
                    </span>
                    <span className="text-[11px] font-bold text-slate-900">
                      Hoà Nguyễn (Bạn)
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-700 text-xs">
                    {myStanding?.weeklyXp || 1250} XP
                  </span>
                </div>

                {simulatedUserRank > 5 ? (
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>Khoảng cách đến Top 5:</span>
                    <strong className="text-emerald-700 font-mono">
                      +{xpDifferenceToPromotion} XP
                    </strong>
                  </div>
                ) : (
                  <div className="text-[9px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={10} /> Đang ở trong Vùng Thăng Hạng!
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Celebration / Season End Popup Mode */
            <div className="flex-1 bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 text-white flex flex-col items-center justify-center p-5 text-center relative overflow-hidden">
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center mb-3 shadow-lg shadow-amber-400/30 animate-bounce">
                <Trophy size={36} />
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-purple-400/40">
                SEASON SETTLEMENT
              </span>

              <h4 className="text-base font-extrabold text-yellow-300 leading-tight mb-1">
                Chúc Mừng Thăng Hạng!
              </h4>
              <p className="text-[10px] text-slate-300 max-w-[200px] mb-3">
                Bạn đã xuất sắc lọt vào Top 5 {activeLeague.name} trong Mùa 37.
              </p>

              {/* Reward Chest Box */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 w-full mb-4 space-y-1.5 text-xs font-mono">
                <div className="text-[10px] text-amber-300 font-bold uppercase">
                  Phần Thưởng Mùa Giải
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-yellow-300">
                    <Coins size={14} /> +350 Coins
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Gem size={14} /> +30 Gems
                  </span>
                </div>
                <div className="text-[9px] text-purple-200">
                  + Danh hiệu &quot;Bá Chủ Kim Cương&quot;
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScreenMode('leaderboard')}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-extrabold text-xs shadow-md shadow-yellow-500/20 active:scale-95 transition-all"
              >
                Nhận Thưởng & Đua Mùa Mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
