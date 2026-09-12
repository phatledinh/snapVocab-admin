import React from 'react';
import { LeagueConfig, LeagueTierId } from '../../../domains/seasons/types';
import {
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Award,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface LeaguesTiersTabProps {
  leagues: LeagueConfig[];
  onOpenEditLeagueModal: (league: LeagueConfig) => void;
}

export const LeaguesTiersTab: React.FC<LeaguesTiersTabProps> = ({
  leagues,
  onOpenEditLeagueModal,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Kim Tự Tháp Phân Bổ Người Học (Pyramid Distribution Banner) */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-text tracking-tight flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span>Kim Tự Tháp Phân Hạng 6 Cấp Độ (League Hierarchy)</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Hệ thống phân bổ học viên vào các phòng đấu (Cohorts) quy mô chuẩn{' '}
              <strong className="text-text">30 người</strong> nhằm duy trì động lực
              cạnh tranh cục bộ.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-canvas border border-border font-semibold text-text-muted">
              Chuẩn hóa 30 users / cohort
            </span>
            <span className="px-2 py-1 rounded bg-primary-light text-primary font-bold">
              Top 5 Thăng Hạng
            </span>
          </div>
        </div>

        {/* Visual Progress Bars for Pyramid */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          {leagues
            .slice()
            .reverse()
            .map((league) => (
              <div key={league.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text flex items-center gap-1.5">
                    <span className="text-base">{league.icon}</span>
                    <span>{league.name}</span>
                    <span className="text-[10px] font-mono text-text-muted">
                      ({league.activeLearnersCount.toLocaleString('vi-VN')} học viên ·{' '}
                      {league.totalCohortsCount} cohorts)
                    </span>
                  </span>
                  <span className="font-mono font-bold text-text-muted text-[11px]">
                    {league.learnerPercentage}% người học
                  </span>
                </div>
                <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${league.learnerPercentage * 2}%`,
                      backgroundColor: league.accentColor,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 2. Grid of 6 League Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {leagues.map((league) => {
          return (
            <div
              key={league.id}
              className="bg-surface border border-border rounded-xl p-4 shadow-card hover:border-border-strong transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs border"
                      style={{
                        borderColor: `${league.accentColor}40`,
                        backgroundColor: `${league.accentColor}15`,
                      }}
                    >
                      {league.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-text tracking-tight group-hover:text-primary transition-colors">
                        {league.name}
                      </h4>
                      <div className="text-[11px] font-mono text-text-muted">
                        Bậc {league.tierOrder} / 6
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenEditLeagueModal(league)}
                    className="p-1.5 rounded-lg hover:bg-canvas text-text-muted hover:text-text border border-transparent hover:border-border transition-all"
                    title="Cấu hình hạn ngạch thăng/hạ hạng"
                  >
                    <Sliders size={14} />
                  </button>
                </div>

                {/* Cohort Stats */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-canvas border border-border/60 text-xs mb-3 font-mono">
                  <div>
                    <span className="text-[10px] text-text-muted block uppercase">
                      Học Viên
                    </span>
                    <strong className="text-text font-bold text-sm">
                      {league.activeLearnersCount.toLocaleString('vi-VN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block uppercase">
                      Số Phòng Đấu
                    </span>
                    <strong className="text-text font-bold text-sm">
                      {league.totalCohortsCount} cohorts
                    </strong>
                  </div>
                </div>

                {/* Rules Breakdown */}
                <div className="space-y-1.5 text-xs">
                  {/* Promotion */}
                  <div className="flex items-center justify-between p-1.5 rounded bg-primary-light/40 border border-primary/20 text-[11px]">
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <ArrowUpRight size={13} />
                      Vùng Thăng Hạng:
                    </span>
                    <span className="font-bold text-text font-mono">
                      Top 1 – {league.promotionRule.promotionRankMax}
                    </span>
                  </div>

                  {/* Min XP Requirement */}
                  <div className="flex items-center justify-between text-[11px] px-1 text-text-muted">
                    <span>Ngưỡng XP tối thiểu:</span>
                    <span className="font-bold text-text font-mono">
                      ≥ {league.promotionRule.minXpToPromote} XP
                    </span>
                  </div>

                  {/* Safe */}
                  <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border text-[11px]">
                    <span className="font-medium text-text-muted flex items-center gap-1">
                      <Minus size={13} />
                      Vùng An Toàn:
                    </span>
                    <span className="font-bold text-text font-mono">
                      Hạng {league.promotionRule.promotionRankMax + 1} –{' '}
                      {league.promotionRule.safeRankMax}
                    </span>
                  </div>

                  {/* Demotion */}
                  {league.canDemote ? (
                    <div className="flex items-center justify-between p-1.5 rounded bg-danger-light/40 border border-danger/20 text-[11px]">
                      <span className="font-semibold text-danger flex items-center gap-1">
                        <ArrowDownRight size={13} />
                        Vùng Rớt Hạng:
                      </span>
                      <span className="font-bold text-text font-mono">
                        Hạng {league.promotionRule.demotionRankMin} –{' '}
                        {league.cohortSize}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                      <span className="font-medium text-slate-600 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        Rớt Hạng:
                      </span>
                      <span className="font-semibold text-slate-700">
                        Không rớt hạng (Bậc sàn)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-text-muted">
                  Quy mô: 30 người / nhóm
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEditLeagueModal(league)}
                  className="text-primary hover:text-primary-hover font-bold text-[11px] hover:underline"
                >
                  Điều chỉnh hạn ngạch →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
