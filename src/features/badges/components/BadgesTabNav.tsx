import React from 'react';
import { BadgesTabNavId } from '../../../domains/badges/types';
import { Award, Crown, Zap, ShieldCheck } from 'lucide-react';

interface BadgesTabNavProps {
  activeTab: BadgesTabNavId;
  onTabChange: (tab: BadgesTabNavId) => void;
  badgeCount: number;
  titlesCount: number;
  recordsCount: number;
}

export const BadgesTabNav: React.FC<BadgesTabNavProps> = ({
  activeTab,
  onTabChange,
  badgeCount,
  titlesCount,
  recordsCount,
}) => {
  const tabs: {
    id: BadgesTabNavId;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: 'badge-catalog',
      label: 'Danh Mục Huy Hiệu (Catalog)',
      icon: <Award size={15} />,
      count: badgeCount,
    },
    {
      id: 'titles-flair',
      label: 'Danh Hiệu & Flair Profile',
      icon: <Crown size={15} />,
      count: titlesCount,
    },
    {
      id: 'trigger-rules',
      label: 'Bộ Luật & Ma Trận Bậc Thang',
      icon: <Zap size={15} />,
    },
    {
      id: 'learner-grants',
      label: 'Cấp Phát & Audit Trail',
      icon: <ShieldCheck size={15} />,
      count: recordsCount,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border select-none overflow-x-auto pb-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-primary text-primary bg-primary-light/30'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface-subtle'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-surface-subtle text-text-muted border border-border'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
