import React from 'react';
import { MissionsTabNavId } from '../../../domains/missions/types';
import { Target, Gift, ShieldAlert, Users } from 'lucide-react';

interface MissionsTabNavProps {
  activeTab: MissionsTabNavId;
  onTabChange: (tabId: MissionsTabNavId) => void;
  activePoolCount: number;
  violationsCount: number;
}

export const MissionsTabNav: React.FC<MissionsTabNavProps> = ({
  activeTab,
  onTabChange,
  activePoolCount,
  violationsCount,
}) => {
  const tabs = [
    {
      id: 'mission-pool' as MissionsTabNavId,
      label: 'Kho Nhiệm Vụ (Pool)',
      icon: <Target size={15} />,
      badge: activePoolCount,
      badgeColor: 'bg-primary-light text-primary font-bold',
    },
    {
      id: 'cycle-chests' as MissionsTabNavId,
      label: 'Chu Kỳ & Rương Thưởng',
      icon: <Gift size={15} />,
      badge: '00:00 GMT+7',
      badgeColor: 'bg-snapy-light text-snapy font-mono text-[10px]',
    },
    {
      id: 'guardrails' as MissionsTabNavId,
      label: 'Hàng Rào Guardrails & Anti-Cheat',
      icon: <ShieldAlert size={15} />,
      badge: violationsCount > 0 ? `${violationsCount} Cảnh báo` : 'An toàn',
      badgeColor:
        violationsCount > 0
          ? 'bg-amber-100 text-amber-800 font-semibold'
          : 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'learner-progress' as MissionsTabNavId,
      label: 'Tiến Độ Học Viên & Audit Claim',
      icon: <Users size={15} />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border select-none overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px whitespace-nowrap ${
              isActive
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface-subtle/50'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full border border-current/20 ${tab.badgeColor}`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
