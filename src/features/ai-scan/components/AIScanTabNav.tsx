import React from 'react';
import { AIScanTab } from '../../../domains/ai-scan/types';
import { Cpu, Sparkles, History, Database } from 'lucide-react';

interface AIScanTabNavProps {
  activeTab: AIScanTab;
  onTabChange: (tab: AIScanTab) => void;
  pendingQueueCount: number;
  urgentReportCount: number;
}

export const AIScanTabNav: React.FC<AIScanTabNavProps> = ({
  activeTab,
  onTabChange,
  pendingQueueCount,
  urgentReportCount,
}) => {
  const tabs = [
    {
      id: 'live-monitor' as AIScanTab,
      label: 'Live Engine & Cluster',
      icon: <Cpu size={14} />,
      badge: '2 Nodes OK',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'review-queue' as AIScanTab,
      label: 'Review Queue',
      icon: <Sparkles size={14} />,
      badge: pendingQueueCount,
      badgeColor:
        urgentReportCount > 0
          ? 'bg-danger text-white font-bold animate-pulse'
          : 'bg-snapy-light text-snapy font-bold border-snapy/20',
      highlightBadge: urgentReportCount > 0 ? `${urgentReportCount} P1` : undefined,
    },
    {
      id: 'requests-history' as AIScanTab,
      label: 'Scan Requests Explorer',
      icon: <History size={14} />,
      badge: 'Lịch sử & Logs',
      badgeColor: 'bg-surface-subtle text-text-muted border-border',
    },
    {
      id: 'dataset-tuning' as AIScanTab,
      label: 'Fine-Tuning Dataset',
      icon: <Database size={14} />,
      badge: 'Active Loop',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 pt-2 rounded-t-xl select-none overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px shrink-0 ${
              isActive
                ? 'border-primary text-primary bg-background shadow-xs font-bold'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface-subtle'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>

            {tab.highlightBadge && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-danger text-white shadow-2xs">
                {tab.highlightBadge}
              </span>
            )}

            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${tab.badgeColor}`}
            >
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
};
