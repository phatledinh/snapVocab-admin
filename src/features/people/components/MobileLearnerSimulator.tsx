import React from 'react';
import { LearnerProfile } from '../../../domains/learners/types';
import {
  Smartphone,
  Signal,
  Wifi,
  Battery,
  BookOpen,
  Camera,
} from 'lucide-react';

interface MobileLearnerSimulatorProps {
  learner: LearnerProfile | null;
  onClose?: () => void;
}

export const MobileLearnerSimulator: React.FC<MobileLearnerSimulatorProps> = ({
  learner,
  onClose: _onClose,
}) => {

  if (!learner) {
    return (
      <div className="w-[340px] shrink-0 border-l border-border bg-surface-subtle/40 p-4 flex flex-col items-center justify-center text-center text-text-muted select-none">
        <Smartphone size={36} className="mb-2 opacity-40" />
        <p className="font-bold text-xs">Chưa chọn học viên</p>
        <p className="text-[10px] mt-0.5">
          Nhấp vào bất kỳ dòng nào trong bảng để xem giao diện Mobile tương ứng
        </p>
      </div>
    );
  }

  return (
    <div className="w-[340px] shrink-0 border-l border-border bg-surface-subtle/50 flex flex-col justify-between p-3 select-none">
      {/* Top Simulator Control */}
      <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
        <div className="flex items-center gap-1.5 font-bold text-text">
          <Smartphone size={14} className="text-primary" />
          <span>Mobile App Preview</span>
        </div>
        <span className="text-[10px] font-mono text-primary font-semibold bg-primary-light px-1.5 py-0.2 rounded border border-primary/20">
          Sync Live
        </span>
      </div>

      {/* Phone Chassis */}
      <div className="my-auto py-2 flex justify-center">
        <div className="w-[305px] h-[590px] bg-slate-950 rounded-[40px] p-2.5 shadow-2xl border-4 border-slate-800 relative flex flex-col">
          {/* Inner Mobile Screen */}
          <div className="w-full h-full bg-[#F8F9F7] rounded-[32px] overflow-hidden flex flex-col relative border border-slate-900">
            {/* Phone Status Bar */}
            <div className="w-full h-7 pt-1.5 px-4 flex items-center justify-between text-slate-800 text-[10px] font-bold select-none z-20">
              <span>09:41</span>
              {/* Dynamic Island Notch */}
              <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1 text-slate-800">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={11} />
              </div>
            </div>

            {/* In-App Header */}
            <div className="px-3 py-1.5 flex items-center justify-between border-b border-border/40 bg-surface/90 backdrop-blur-xs">
              <div className="flex items-center gap-1">
                <span className="text-sm">🦊</span>
                <span className="font-extrabold text-[11px] text-text tracking-tight">SnapVocab</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
                <span className="text-reward flex items-center gap-0.5">
                  🪙 {learner.economy.coins}
                </span>
                <span className="text-cyan-600 flex items-center gap-0.5">
                  💎 {learner.economy.gems}
                </span>
              </div>
            </div>

            {/* Main Screen Body */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 text-xs">
              {/* Profile Card */}
              <div className="bg-surface rounded-2xl p-3 border border-border/60 shadow-xs flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <img
                    src={learner.avatar}
                    alt={learner.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-border shadow-2xs"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-primary text-white text-[8px] font-extrabold font-mono">
                    {learner.cefrLevel}
                  </span>
                </div>
                <div className="truncate min-w-0">
                  <div className="font-extrabold text-text text-xs truncate">
                    {learner.fullName}
                  </div>
                  {learner.economy.equippedTitle && (
                    <div className="text-[10px] font-bold text-purple-700 truncate mt-0.5">
                      {learner.economy.equippedTitle}
                    </div>
                  )}
                  <div className="text-[9px] text-text-muted mt-0.5">
                    Hạng #{learner.economy.leagueRank} • {learner.economy.league.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Streak Banner */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 text-white shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg backdrop-blur-xs">
                    🔥
                  </div>
                  <div>
                    <div className="text-[10px] font-bold opacity-90 leading-tight">CHUỖI HỌC LIÊN TỤC</div>
                    <div className="text-base font-extrabold leading-tight">
                      {learner.streak.currentStreak} Ngày
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px]">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    🛡️ x{learner.streak.streakShields} Khiên
                  </span>
                </div>
              </div>

              {/* Today Study Task Card */}
              <div className="bg-surface rounded-2xl p-3 border border-border/60 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-text flex items-center gap-1">
                    <BookOpen size={12} className="text-primary" />
                    <span>Bài Ôn Tập Hôm Nay</span>
                  </span>
                  <span className="text-[10px] font-bold text-primary">
                    {learner.fsrs.dueCardsToday} thẻ đến hạn
                  </span>
                </div>
                <div className="w-full py-1.5 rounded-xl bg-primary text-white font-bold text-center text-[11px] shadow-xs cursor-pointer hover:bg-primary-hover transition-colors">
                  Bắt đầu học ngay 🚀
                </div>
              </div>

              {/* AI Camera Scan Quota */}
              <div className="bg-surface rounded-2xl p-2.5 border border-border/60 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-text">
                  <span className="flex items-center gap-1">
                    <Camera size={11} className="text-snapy" />
                    <span>Lượt AI Camera Scan</span>
                  </span>
                  <span>
                    {learner.economy.scansUsedToday} / {learner.economy.dailyScanQuota}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-snapy rounded-full"
                    style={{
                      width: `${(learner.economy.scansUsedToday / learner.economy.dailyScanQuota) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Badges Showcase */}
              <div className="bg-surface rounded-2xl p-2.5 border border-border/60 shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-text-muted mb-1.5">
                  <span>HUY HIỆU NỔI BẬT ({learner.economy.unlockedBadgesCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  {learner.economy.equippedBadgeIcons.map((icon, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-sm shadow-2xs"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-full h-4 flex items-center justify-center pb-1 bg-surface/80">
              <div className="w-24 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Footer Footnote */}
      <div className="text-center text-[10px] text-text-muted pt-1 border-t border-border">
        Mô phỏng màn hình học viên theo <span className="font-mono text-primary font-bold">LearnerProfile</span>
      </div>
    </div>
  );
};
