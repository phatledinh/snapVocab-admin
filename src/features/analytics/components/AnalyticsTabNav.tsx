import React from 'react';
import { AnalyticsTab } from '../../../domains/analytics/types';
import { Activity, Users, BookOpen, Camera, ShoppingBag } from 'lucide-react';

interface AnalyticsTabNavProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

interface TabItem {
  id: AnalyticsTab;
  label: string;
  icon: React.ReactNode;
  badge: string;
  badgeClass: string;
}

export const AnalyticsTabNav: React.FC<AnalyticsTabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Tổng Quan Điều Hành',
      icon: <Activity size={14} />,
      badge: 'Macro KPIs',
      badgeClass: 'bg-primary-light text-primary border-primary/20',
    },
    {
      id: 'retention',
      label: 'Giữ Chân & Cohort 8 Tuần',
      icon: <Users size={14} />,
      badge: '40% Data',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'efficacy',
      label: 'Hiệu Quả Học & Thang SRS',
      icon: <BookOpen size={14} />,
      badge: '35% Content',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'ai-scan',
      label: 'Thị Giác AI & Scan Funnel',
      icon: <Camera size={14} />,
      badge: '35% AI Studio',
      badgeClass: 'bg-snapy-light text-snapy border-snapy/20',
    },
    {
      id: 'economy',
      label: 'Kinh Tế Ảo & Doanh Thu Shop',
      icon: <ShoppingBag size={14} />,
      badge: '25% LiveOps',
      badgeClass: 'bg-reward-light text-[#9A7000] border-reward/20',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border pb-1 select-none scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-bold transition-all shrink-0 border-b-2 ${
              isActive
                ? 'border-primary text-text bg-surface shadow-2xs font-extrabold'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface/50 font-medium'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono border font-semibold ${tab.badgeClass}`}
            >
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
};
