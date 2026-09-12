import React from 'react';
import { IssueTabNavId } from '../../../domains/issue-reports/types';
import {
  ListFilter,
  Camera,
  BookOpen,
  ShieldCheck,
  Smartphone,
  RotateCw,
} from 'lucide-react';

interface IssueReportsTabNavProps {
  activeTab: IssueTabNavId;
  onTabChange: (tab: IssueTabNavId) => void;
  urgentP1Count?: number;
  vocabIssuesCount?: number;
  isSimulatorVisible?: boolean;
  onToggleSimulator?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const IssueReportsTabNav: React.FC<IssueReportsTabNavProps> = ({
  activeTab,
  onTabChange,
  urgentP1Count = 0,
  vocabIssuesCount = 0,
  isSimulatorVisible = false,
  onToggleSimulator,
  onRefresh,
  isRefreshing = false,
}) => {
  const tabs = [
    {
      id: 'master-queue' as IssueTabNavId,
      label: 'Toàn Bộ Báo Cáo',
      sublabel: 'Master Incident Queue & Multi-filter',
      icon: <ListFilter size={15} />,
    },
    {
      id: 'ai-scan' as IssueTabNavId,
      label: 'Sự Cố AI Camera Scan',
      sublabel: 'Active Learning Feedback Loop (P1)',
      icon: <Camera size={15} />,
      badge: urgentP1Count > 0 ? urgentP1Count : undefined,
      badgeColor: 'bg-danger text-white animate-pulse',
    },
    {
      id: 'dictionary' as IssueTabNavId,
      label: 'Duyệt Báo Lỗi Từ Vựng',
      sublabel: 'MH-ADM-06 Feedback Queue & Side-by-Side',
      icon: <BookOpen size={15} />,
      badge: vocabIssuesCount > 0 ? vocabIssuesCount : undefined,
      badgeColor: 'bg-info text-white',
    },
    {
      id: 'resolution-ledger' as IssueTabNavId,
      label: 'Sổ Cái Giải Quyết & SLA',
      sublabel: 'Resolution Audit Trail & Compliance',
      icon: <ShieldCheck size={15} />,
    },
  ];

  return (
    <div className="flex items-center justify-between border-b border-border bg-surface px-4 select-none overflow-x-auto">
      {/* Left Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary-light/30'
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
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        tab.badgeColor || 'bg-primary text-white'
                      }`}
                    >
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

      {/* Right Toolbar Controls */}
      <div className="flex items-center gap-2 py-2">
        {onToggleSimulator && (
          <button
            type="button"
            onClick={onToggleSimulator}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs ${
              isSimulatorVisible
                ? 'bg-primary-light border-primary/40 text-primary'
                : 'bg-surface border-border text-text-muted hover:text-text hover:bg-surface-subtle'
            }`}
            title="Bật/Tắt Giả lập Mobile iPhone Simulator"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile Simulator</span>
          </button>
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className={`p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all shadow-xs ${
              isRefreshing ? 'animate-spin text-primary' : ''
            }`}
            title="Làm mới dữ liệu (Realtime)"
          >
            <RotateCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
