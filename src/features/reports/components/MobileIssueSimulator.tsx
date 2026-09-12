import React from 'react';
import { IssueReportItem } from '../../../domains/issue-reports/types';
import {
  Wifi,
  Battery,
  Sparkles,
  Bell,
  Coins,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface MobileIssueSimulatorProps {
  issue: IssueReportItem | null;
}

export const MobileIssueSimulator: React.FC<MobileIssueSimulatorProps> = ({
  issue,
}) => {
  const targetWord = issue?.targetWord || 'thermos';
  const suggestedWord = issue?.suggestedWord || targetWord;
  const isResolved = issue?.status === 'RESOLVED';
  const compensationCoins = issue?.resolution?.compensationCoins || 20;

  return (
    <div className="w-[300px] shrink-0 select-none flex flex-col items-center">
      <div className="w-full bg-surface border border-border rounded-2xl p-2.5 shadow-card">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[10px] font-bold text-text uppercase tracking-wider flex items-center gap-1">
            <span>📱</span>
            <span>Mobile Preview Simulator</span>
          </span>
          <span className="text-[9px] font-mono text-text-muted">
            iPhone 15 Pro
          </span>
        </div>

        {/* iPhone Outer Frame */}
        <div className="relative w-full h-[540px] bg-black rounded-[36px] p-2.5 shadow-2xl border-4 border-neutral-800 flex flex-col overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* iOS Status Bar */}
          <div className="w-full pt-1 px-4 flex items-center justify-between text-white text-[10px] font-semibold z-10">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi size={10} />
              <Battery size={11} />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 bg-canvas rounded-[26px] overflow-hidden flex flex-col justify-between p-3 mt-2 text-text relative">
            {/* Top Push Notification Banner */}
            <div className="bg-surface/95 backdrop-blur-md rounded-xl p-2.5 border border-border shadow-md space-y-1 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🦊</span>
                  <span className="font-extrabold text-[10px] text-text">
                    SnapVocab
                  </span>
                  <span className="text-[8px] text-text-muted">• vừa xong</span>
                </div>
                <Bell size={11} className="text-snapy" />
              </div>

              <div className="text-[10px] font-bold text-text leading-snug">
                {isResolved
                  ? 'Báo cáo sự cố đã được duyệt thành công!'
                  : 'Đã tiếp nhận báo cáo của bạn!'}
              </div>
              <p className="text-[9px] text-text-muted leading-tight">
                {isResolved
                  ? `Từ vựng "${suggestedWord}" đã được cập nhật vào từ điển. Bạn nhận được +${compensationCoins} Coins!`
                  : `Đội ngũ Admin đang kiểm tra sự cố "${targetWord}". Cảm ơn đóng góp của bạn!`}
              </p>
            </div>

            {/* Middle: Flashcard Preview */}
            <div className="bg-surface rounded-xl p-3 border border-border shadow-xs space-y-2 my-auto">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-primary uppercase bg-primary-light px-1.5 py-0.2 rounded border border-primary/20">
                  {issue?.targetCefr || 'B1'} • Flashcard
                </span>
                <span className="text-[9px] font-bold text-reward flex items-center gap-0.5">
                  <Coins size={10} /> +{compensationCoins}
                </span>
              </div>

              {issue?.scanData?.cropUrl || issue?.scanData?.thumbnailUrl ? (
                <div className="w-full h-24 rounded-lg overflow-hidden border border-border bg-black/5">
                  <img
                    src={
                      issue.scanData.cropUrl ||
                      issue.scanData.thumbnailUrl
                    }
                    alt={suggestedWord}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div className="text-center">
                <h4 className="font-black text-sm text-text capitalize flex items-center justify-center gap-1">
                  <span>{suggestedWord}</span>
                  <Volume2 size={12} className="text-info cursor-pointer" />
                </h4>
                <div className="text-[10px] font-mono text-text-muted">
                  {issue?.vocabData?.suggestedIpa ||
                    issue?.vocabData?.currentIpa ||
                    '/ˈθɜː.məs/'}
                </div>
                <p className="text-[10px] text-text font-medium mt-1">
                  {issue?.vocabData?.suggestedMeaningVi ||
                    issue?.vocabData?.currentMeaningVi ||
                    'bình giữ nhiệt, bình chân không'}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary flex items-center gap-1">
                  <CheckCircle2 size={10} /> Đã đồng bộ với tài khoản
                </span>
              </div>
            </div>

            {/* Bottom App Mascot Tip */}
            <div className="bg-snapy-light/40 border border-snapy/20 rounded-xl p-2 flex items-center gap-2">
              <div className="text-base shrink-0">🦊</div>
              <div className="text-[9px] text-snapy font-semibold leading-tight">
                "Cảm ơn bạn đã đồng hành giúp SnapVocab chuẩn xác hơn mỗi ngày!"
              </div>
            </div>

            {/* Home Indicator bar */}
            <div className="w-24 h-1 bg-neutral-300 rounded-full mx-auto mt-2 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
