import React, { useState } from 'react';
import { Badge, HonoraryTitle } from '../../../domains/badges/types';
import {
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
  CheckCircle2,
  Award,
  Crown,
  Lock,
} from 'lucide-react';

interface TriggerRulesTabProps {
  badges: Badge[];
  titles: HonoraryTitle[];
}

export const TriggerRulesTab: React.FC<TriggerRulesTabProps> = ({
  badges,
  titles,
}) => {
  // Simulator inputs
  const [simStreak, setSimStreak] = useState<number>(30);
  const [simScans, setSimScans] = useState<number>(100);
  const [simVocab, setSimVocab] = useState<number>(250);
  const [simQuiz, setSimQuiz] = useState<number>(15);
  const [simResults, setSimResults] = useState<{
    triggeredBadges: Badge[];
    triggeredTitles: string[];
    totalCoins: number;
    totalXp: number;
    totalGems: number;
    idempotencyKey: string;
  } | null>(null);

  // Group progressive chains
  const chains = [
    {
      id: 'streak-series',
      title: 'Chuỗi Ngày Kỷ Luật (Streak Milestones)',
      category: 'streak',
      icon: '🔥',
      badges: badges
        .filter((b) => b.seriesId === 'streak-series')
        .sort((a, b) => (a.seriesLevel || 0) - (b.seriesLevel || 0)),
    },
    {
      id: 'scan-series',
      title: 'Chuỗi Quét AI Camera (Camera Vision)',
      category: 'scan',
      icon: '📷',
      badges: badges
        .filter((b) => b.seriesId === 'scan-series')
        .sort((a, b) => (a.seriesLevel || 0) - (b.seriesLevel || 0)),
    },
    {
      id: 'vocab-series',
      title: 'Chuỗi Vốn Từ Vựng SRS (Lexicon Mastery)',
      category: 'vocabulary',
      icon: '📚',
      badges: badges
        .filter((b) => b.seriesId === 'vocab-series')
        .sort((a, b) => (a.seriesLevel || 0) - (b.seriesLevel || 0)),
    },
  ];

  const handleRunSimulation = () => {
    const triggered: Badge[] = [];
    const triggeredTitlesList: string[] = [];
    let coins = 0;
    let xp = 0;
    let gems = 0;

    badges.forEach((b) => {
      if (b.status === 'archived' || b.status === 'draft') return;
      let matched = false;

      if (b.unlockMetric === 'STREAK_DAYS' && simStreak >= b.targetValue) matched = true;
      if (b.unlockMetric === 'AI_SCAN_SAVED' && simScans >= b.targetValue) matched = true;
      if (b.unlockMetric === 'SRS_MASTERED' && simVocab >= b.targetValue) matched = true;
      if (b.unlockMetric === 'PERFECT_QUIZ' && simQuiz >= b.targetValue) matched = true;

      if (matched) {
        triggered.push(b);
        coins += b.reward.coins;
        xp += b.reward.xp;
        gems += b.reward.gems || 0;
        if (b.reward.titleName) triggeredTitlesList.push(b.reward.titleName);
      }
    });

    setSimResults({
      triggeredBadges: triggered,
      triggeredTitles: triggeredTitlesList,
      totalCoins: coins,
      totalXp: xp,
      totalGems: gems,
      idempotencyKey: `SIM-TRIGGER-${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Intro Header */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">
              Bộ Luật Kích Hoạt Tự Động & Chuỗi Bậc Thang (Progressive Chains)
            </h3>
            <p className="text-xs text-text-muted">
              Đảm bảo tính liên tục của động lực học tập qua các cột mốc bậc thang và cơ chế Idempotent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary-light/40 px-3 py-1.5 rounded-lg border border-primary/20">
          <ShieldCheck size={15} />
          <span>Idempotent Key Enforced</span>
        </div>
      </div>

      {/* Progressive Chains Visualizer */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-text uppercase tracking-wider block">
          Trực Quan Hóa Chuỗi Cột Mốc Bậc Thang
        </span>

        {chains.map((chain) => (
          <div
            key={chain.id}
            className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{chain.icon}</span>
                <h4 className="text-xs font-bold text-text">{chain.title}</h4>
              </div>
              <span className="text-[11px] text-text-muted">
                {chain.badges.length} bậc thang thành tựu
              </span>
            </div>

            {/* Stepper Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {chain.badges.map((b, idx) => (
                <div
                  key={b.id}
                  className="bg-surface-subtle p-3 rounded-xl border border-border flex flex-col justify-between relative group hover:border-primary/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase font-mono">
                        Cấp {b.seriesLevel}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase font-mono bg-surface border border-border text-text">
                        {b.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-1">
                      <span className="text-xl">{b.icon}</span>
                      <span className="text-xs font-bold text-text truncate">
                        {b.name}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-primary font-mono mt-1">
                      {b.targetValue} {b.targetUnit}
                    </div>

                    <div className="text-[10px] text-text-muted mt-0.5 font-mono">
                      +{b.reward.coins}c · +{b.reward.xp}xp
                    </div>

                    {b.reward.titleName && (
                      <span className="inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-reward-light text-reward-hover border border-reward/20">
                        {b.reward.titleName}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/60 text-[10px] text-text-muted flex items-center justify-between">
                    <span>Đã đạt:</span>
                    <span className="font-bold text-text font-mono">
                      {b.unlockRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trigger Rule Simulator Sandbox */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-primary" />
            <h4 className="text-xs font-bold text-text">
              Trình Giả Lập Đánh Giá Trigger Kích Hoạt (Simulator Sandbox)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleRunSimulation}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Zap size={14} />
            <span>Chạy Kiểm Tra Trigger</span>
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-surface-subtle rounded-lg border border-border">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
              Số ngày Streak liên tục
            </label>
            <input
              type="number"
              min={0}
              value={simStreak}
              onChange={(e) => setSimStreak(parseInt(e.target.value) || 0)}
              className="w-full text-xs p-1.5 rounded border border-border bg-surface text-text font-mono font-bold"
            />
          </div>

          <div className="p-2.5 bg-surface-subtle rounded-lg border border-border">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
              Số đồ vật scan AI đã lưu
            </label>
            <input
              type="number"
              min={0}
              value={simScans}
              onChange={(e) => setSimScans(parseInt(e.target.value) || 0)}
              className="w-full text-xs p-1.5 rounded border border-border bg-surface text-text font-mono font-bold"
            />
          </div>

          <div className="p-2.5 bg-surface-subtle rounded-lg border border-border">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
              Số thẻ SRS thành thạo
            </label>
            <input
              type="number"
              min={0}
              value={simVocab}
              onChange={(e) => setSimVocab(parseInt(e.target.value) || 0)}
              className="w-full text-xs p-1.5 rounded border border-border bg-surface text-text font-mono font-bold"
            />
          </div>

          <div className="p-2.5 bg-surface-subtle rounded-lg border border-border">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
              Số bài Quiz đạt 100%
            </label>
            <input
              type="number"
              min={0}
              value={simQuiz}
              onChange={(e) => setSimQuiz(parseInt(e.target.value) || 0)}
              className="w-full text-xs p-1.5 rounded border border-border bg-surface text-text font-mono font-bold"
            />
          </div>
        </div>

        {/* Results Banner */}
        {simResults && (
          <div className="p-4 rounded-xl bg-primary-light/20 border border-primary/30 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                Kết Quả Kích Hoạt ({simResults.triggeredBadges.length} Huy hiệu đạt điều kiện)
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Key: <span className="font-bold text-text">{simResults.idempotencyKey}</span>
              </span>
            </div>

            {/* Badges unlocked */}
            <div className="flex items-center gap-2 flex-wrap">
              {simResults.triggeredBadges.map((b) => (
                <div
                  key={b.id}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-text flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{b.icon}</span>
                  <span>{b.name}</span>
                  <span className="text-[9px] uppercase font-mono font-bold text-primary">
                    ({b.tier})
                  </span>
                </div>
              ))}
            </div>

            {/* Rewards generated */}
            <div className="flex items-center gap-4 text-xs font-mono font-bold text-text pt-2 border-t border-primary/20">
              <span>Tổng Coins: +{simResults.totalCoins.toLocaleString('vi-VN')}</span>
              <span>Tổng XP: +{simResults.totalXp.toLocaleString('vi-VN')}</span>
              {simResults.totalGems > 0 && (
                <span className="text-snapy">Tổng Gems: +{simResults.totalGems}</span>
              )}
              {simResults.triggeredTitles.length > 0 && (
                <span className="text-reward-hover ml-auto">
                  Danh hiệu mở khóa: {simResults.triggeredTitles.join(', ')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
