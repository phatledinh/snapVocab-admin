import React from 'react';
import { SeasonsTabNavId } from '../../../domains/seasons/types';
import { Calendar, Shield, Gift, Trophy } from 'lucide-react';

interface SeasonsTabNavProps {
  activeTab: SeasonsTabNavId;
  onTabChange: (tab: SeasonsTabNavId) => void;
  pendingAnomaliesCount?: number;
}

export const SeasonsTabNav: React.FC<SeasonsTabNavProps> = ({
  activeTab,
  onTabChange,
  pendingAnomaliesCount = 0,
}) => {
  const tabs = [
    {
      id: 'seasons-schedule' as SeasonsTabNavId,
      label: 'Quản Lý Mùa Giải',
      sublabel: 'Vòng đời & Lịch trình',
      icon: <Calendar size={15} />,
    },
    {
      id: 'leagues-tiers' as SeasonsTabNavId,
      label: 'Hệ Thống Hạng Đấu',
      sublabel: '6 Leagues & Thăng hạng',
      icon: <Shield size={15} />,
    },
    {
      id: 'season-rewards' as SeasonsTabNavId,
      label: 'Ma Trận Phần Thưởng',
      sublabel: 'Quy chuẩn Guardrails & Faucet',
      icon: <Gift size={15} />,
    },
    {
      id: 'standings-anticheat' as SeasonsTabNavId,
      label: 'Bảng Xếp Hạng & Chống Gian Lận',
      sublabel: 'Realtime Standings & Velocity Check',
      icon: <Trophy size={15} />,
      badge: pendingAnomaliesCount > 0 ? pendingAnomaliesCount : undefined,
    },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border bg-surface px-4 select-none overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-3 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'border-primary text-primary bg-primary-light/40'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface-subtle'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-danger text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-normal text-text-muted mt-0.5 leading-none">
                {tab.sublabel}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
