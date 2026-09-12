import React, { useState } from 'react';
import {
  LearnerProfile,
  CEFRLevel,
} from '../../../domains/learners/types';
import {
  X,
  Flame,
  Brain,
  ShieldCheck,
  Ban,
  KeyRound,
  RotateCcw,
  Sparkles,
  Camera,
  AlertTriangle,
  History,
} from 'lucide-react';

interface Learner360DrawerProps {
  learner: LearnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStreakRecovery: (learner: LearnerProfile) => void;
  onOpenBanModal: (learner: LearnerProfile) => void;
  onOpenResetPass: (learner: LearnerProfile) => void;
  onOpenGrantModal: (learner: LearnerProfile) => void;
}

export const Learner360Drawer: React.FC<Learner360DrawerProps> = ({
  learner,
  isOpen,
  onClose,
  onOpenStreakRecovery,
  onOpenBanModal,
  onOpenResetPass,
  onOpenGrantModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'learning' | 'gamification' | 'scans' | 'audit'>('learning');

  if (!isOpen || !learner) return null;

  const getCefrBadge = (cefr: CEFRLevel) => {
    switch (cefr) {
      case 'A1': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'A2': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'B1': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B2': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'C1': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'C2': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-surface h-full shadow-2xl border-l border-border flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* 1. Header with Learner Avatar & Identity */}
        <div>
          <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={learner.avatar}
                  alt={learner.fullName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-surface shadow-md"
                />
                {learner.status === 'active' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-text tracking-tight">
                    {learner.fullName}
                  </h2>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getCefrBadge(learner.cefrLevel)}`}>
                    {learner.cefrLevel}
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">{learner.email}</div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted mt-1">
                  <span className="bg-surface px-1.5 py-0.2 rounded border border-border">
                    {learner.id}
                  </span>
                  <span>•</span>
                  <span>{learner.deviceModel} ({learner.devicePlatform.toUpperCase()})</span>
                  <span>•</span>
                  <span>App {learner.appVersion}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex border-b border-border bg-surface px-4 text-xs font-semibold">
            {[
              { id: 'learning', label: 'Tiến Độ FSRS', icon: <Brain size={14} /> },
              { id: 'gamification', label: 'Streak & LiveOps', icon: <Flame size={14} /> },
              { id: 'scans', label: 'Lịch Sử AI Scan', icon: <Camera size={14} /> },
              { id: 'audit', label: 'Bảo Mật & Audit', icon: <ShieldCheck size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'border-primary text-primary font-bold bg-primary-light/20'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* TAB 1: FSRS LEARNING PROGRESS */}
          {activeSubTab === 'learning' && (
            <div className="space-y-4">
              {/* Card Totals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-surface-subtle p-2.5 rounded-lg border border-border">
                  <span className="text-[10px] text-text-muted font-bold block">BỘ TỪ (DECKS)</span>
                  <span className="text-base font-extrabold text-text font-mono">
                    {learner.fsrs.totalDecks}
                  </span>
                </div>
                <div className="bg-surface-subtle p-2.5 rounded-lg border border-border">
                  <span className="text-[10px] text-text-muted font-bold block">TỪ ĐÃ LƯU</span>
                  <span className="text-base font-extrabold text-text font-mono">
                    {learner.fsrs.totalNotes}
                  </span>
                </div>
                <div className="bg-surface-subtle p-2.5 rounded-lg border border-border">
                  <span className="text-[10px] text-text-muted font-bold block">THUỘC (MASTERED)</span>
                  <span className="text-base font-extrabold text-primary font-mono">
                    {learner.fsrs.cardsMastered}
                  </span>
                </div>
                <div className="bg-surface-subtle p-2.5 rounded-lg border border-border">
                  <span className="text-[10px] text-text-muted font-bold block">ÔN HÔM NAY</span>
                  <span className="text-base font-extrabold text-snapy font-mono">
                    {learner.fsrs.dueCardsToday}
                  </span>
                </div>
              </div>

              {/* FSRS Metrics */}
              <div className="bg-surface-subtle/50 p-3 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">Tỷ Lệ Giữ Nhớ Recall Rate:</span>
                  <span className="font-mono font-bold text-info text-sm">
                    {learner.fsrs.retentionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">Độ Bền Trí Nhớ (Stability):</span>
                  <span className="font-mono font-bold text-text">
                    ~{learner.fsrs.avgStabilityDays} ngày
                  </span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${learner.fsrs.retentionRate}%` }}
                  />
                </div>
              </div>

              {/* Recent Review Logs */}
              <div>
                <h4 className="font-bold text-text text-xs mb-2 flex items-center gap-1.5">
                  <History size={13} className="text-primary" />
                  <span>Nhật Ký Ôn Tập Flashcard Gần Nhất:</span>
                </h4>
                {learner.recentReviews.length === 0 ? (
                  <div className="p-4 bg-surface-subtle rounded-lg text-center text-text-muted text-xs">
                    Chưa có lượt ôn tập nào gần đây.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {learner.recentReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-2.5 rounded-lg border border-border bg-surface flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-text">{rev.word}</span>
                            <span className="text-[10px] px-1 rounded bg-slate-100 font-mono text-slate-700">
                              {rev.cefr}
                            </span>
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5">
                            Chu kỳ tiếp theo: {rev.intervalDays} ngày (Stability: {rev.stabilityScore})
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-light text-primary border border-primary/20">
                          {rev.ratingLabel} ({rev.rating})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GAMIFICATION & LIVEOPS */}
          {activeSubTab === 'gamification' && (
            <div className="space-y-4">
              {/* Streak Card */}
              <div className="p-3.5 rounded-xl border border-snapy/30 bg-snapy-light/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-snapy-light text-snapy flex items-center justify-center border border-snapy/30">
                    <Flame size={20} />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-text">
                      {learner.streak.currentStreak} Ngày Liên Tiếp
                    </div>
                    <div className="text-[11px] text-text-muted">
                      Kỷ lục cao nhất: <strong>{learner.streak.maxStreak} ngày</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[11px] font-semibold text-info flex items-center gap-1 justify-end">
                    <span>Khiên bảo vệ:</span>
                    <strong className="font-mono">🛡️ x{learner.streak.streakShields}</strong>
                  </span>
                  {learner.streak.isAtRisk && (
                    <span className="text-[10px] font-bold text-danger block mt-0.5">
                      ⚠️ Chưa học hôm nay (Nguy cơ đứt)
                    </span>
                  )}
                </div>
              </div>

              {/* Economy Balances */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-reward/40 bg-reward-light/30">
                  <span className="text-[10px] font-bold text-reward-hover uppercase block">
                    Số Dư Coin Vàng
                  </span>
                  <div className="text-lg font-extrabold text-text font-mono mt-0.5">
                    🪙 {learner.economy.coins.toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/40">
                  <span className="text-[10px] font-bold text-cyan-800 uppercase block">
                    Số Dư Kim Cương
                  </span>
                  <div className="text-lg font-extrabold text-cyan-700 font-mono mt-0.5">
                    💎 {learner.economy.gems}
                  </div>
                </div>
              </div>

              {/* League & Season */}
              <div className="p-3 rounded-xl border border-border bg-surface-subtle/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-text font-bold">Giải Đấu Hiện Tại:</span>
                  <span className="font-bold text-purple-700 capitalize">
                    {learner.economy.league} League (Top #{learner.economy.leagueRank})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>Phòng thi đấu (Cohort):</span>
                  <span className="font-mono text-text">{learner.economy.cohortId}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>XP Tích Lũy Tuần:</span>
                  <span className="font-mono text-primary font-bold">
                    +{learner.economy.weeklyXp} XP (Tổng: {learner.economy.totalXp.toLocaleString('vi-VN')})
                  </span>
                </div>
              </div>

              {/* AI Scan Quota Progress */}
              <div className="p-3 rounded-xl border border-border bg-surface space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-text">
                  <span className="flex items-center gap-1.5">
                    <Camera size={14} className="text-snapy" />
                    <span>Lượt AI Camera Scan Hôm Nay</span>
                  </span>
                  <span>
                    {learner.economy.scansUsedToday} / {learner.economy.dailyScanQuota} lượt
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-subtle rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-snapy rounded-full"
                    style={{
                      width: `${(learner.economy.scansUsedToday / learner.economy.dailyScanQuota) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI SCAN CAMERA HISTORY */}
          {activeSubTab === 'scans' && (
            <div className="space-y-3">
              <div className="text-xs text-text-muted">
                Danh sách đồ vật được người học chụp qua Camera và ánh xạ thành Flashcard:
              </div>
              {learner.recentScans.length === 0 ? (
                <div className="p-6 bg-surface-subtle rounded-xl text-center text-text-muted">
                  <Camera size={24} className="mx-auto mb-1.5 opacity-40" />
                  <p className="font-bold">Chưa có ảnh scan nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {learner.recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-2.5 rounded-xl border border-border bg-surface flex items-center gap-2.5 shadow-2xs"
                    >
                      <img
                        src={scan.imageUrl}
                        alt={scan.detectedObject}
                        className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="truncate min-w-0">
                        <div className="font-extrabold text-text truncate">
                          {scan.mappedWord}
                        </div>
                        <div className="text-[10px] text-text-muted truncate">
                          Nhận diện: {scan.detectedObject}
                        </div>
                        <div className="text-[10px] font-bold text-primary mt-1">
                          Độ tin cậy: {Math.round(scan.confidenceScore * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECURITY & AUDIT TRAIL */}
          {activeSubTab === 'audit' && (
            <div className="space-y-3">
              {learner.banInfo && (
                <div className="p-3 rounded-xl border border-danger/30 bg-danger-light/30 space-y-1">
                  <div className="font-bold text-danger flex items-center gap-1.5 text-xs">
                    <AlertTriangle size={14} />
                    <span>Tài Khoản Đang Bị Khóa ({learner.banInfo.banDuration})</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Lý do: "{learner.banInfo.reason}"
                  </p>
                  <div className="text-[10px] font-mono text-text-muted">
                    Bởi: {learner.banInfo.bannedBy} • {new Date(learner.banInfo.bannedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              )}

              <h4 className="font-bold text-text text-xs">Lịch Sử Can Thiệp Của Operator:</h4>
              {learner.auditHistory.length === 0 ? (
                <div className="p-4 bg-surface-subtle rounded-lg text-center text-text-muted text-xs">
                  Chưa có can thiệp nào được ghi nhận cho học viên này.
                </div>
              ) : (
                <div className="space-y-2">
                  {learner.auditHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-border bg-surface space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-text">
                        <span>{item.action}</span>
                        <span className="font-mono text-[10px] text-text-muted">
                          {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted leading-relaxed">
                        {item.details}
                      </div>
                      <div className="text-[10px] text-primary font-mono">
                        Ticket: {item.ticketId} • Operator: {item.operatorName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Bottom Action Bar */}
        <div className="p-3 bg-surface-subtle border-t border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Streak Recovery */}
            <button
              type="button"
              onClick={() => onOpenStreakRecovery(learner)}
              className="px-3 py-1.5 rounded-lg bg-snapy hover:bg-snapy-hover text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Khôi phục Streak</span>
            </button>

            {/* Grant / Adjust Quota */}
            <button
              type="button"
              onClick={() => onOpenGrantModal(learner)}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text font-semibold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={13} className="text-snapy" />
              <span>Cấp Quota / Quà</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Reset Password */}
            <button
              type="button"
              onClick={() => onOpenResetPass(learner)}
              className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text shadow-xs"
              title="Reset Mật Khẩu"
            >
              <KeyRound size={14} />
            </button>

            {/* Ban / Unban */}
            <button
              type="button"
              onClick={() => onOpenBanModal(learner)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                learner.status === 'suspended'
                  ? 'bg-primary hover:bg-primary-hover text-white'
                  : 'bg-danger hover:bg-danger-hover text-white'
              }`}
            >
              <Ban size={13} />
              <span>{learner.status === 'suspended' ? 'Mở khóa' : 'Khóa tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
