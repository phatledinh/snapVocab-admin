import React from 'react';
import { AuditTabNavId, AuditLogEntry } from '../../../domains/audit/types';
import {
  Layers,
  Sparkles,
  ShieldAlert,
  Lock,
  FileCheck2,
} from 'lucide-react';

interface AuditTabNavProps {
  activeTab: AuditTabNavId;
  onTabChange: (tabId: AuditTabNavId) => void;
  logs: AuditLogEntry[];
}

export const AuditTabNav: React.FC<AuditTabNavProps> = ({
  activeTab,
  onTabChange,
  logs,
}) => {
  // Counts per tab
  const contentAiCount = logs.filter(
    (l) => l.domain === 'CONTENT_STUDIO' || l.domain === 'AI_SCAN'
  ).length;

  const liveopsCount = logs.filter(
    (l) => l.domain === 'LIVEOPS_ECONOMY' || l.domain === 'ISSUE_REPORTS'
  ).length;

  const securityCount = logs.filter(
    (l) => l.domain === 'SYSTEM_SECURITY' || l.domain === 'LEARNERS_PEOPLE'
  ).length;

  const tabs: {
    id: AuditTabNavId;
    label: string;
    subLabel: string;
    icon: React.ReactNode;
    badgeCount?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'master-stream',
      label: 'Sổ Cái Toàn Hệ Thống',
      subLabel: 'Tất cả phân hệ · Master Ledger',
      icon: <Layers size={16} />,
      badgeCount: logs.length,
      badgeColor: 'bg-primary-light text-primary font-bold',
    },
    {
      id: 'content-ai',
      label: 'Content & AI Studio',
      subLabel: 'Vòng đời từ vựng & Feedback loop',
      icon: <Sparkles size={16} />,
      badgeCount: contentAiCount,
      badgeColor: 'bg-snapy-light text-snapy font-bold',
    },
    {
      id: 'liveops-guardrails',
      label: 'LiveOps & Guardrails',
      subLabel: 'Streak, Cấp bù tiền & Trần thưởng',
      icon: <ShieldAlert size={16} />,
      badgeCount: liveopsCount,
      badgeColor: 'bg-reward-light text-reward-hover font-bold',
    },
    {
      id: 'security-access',
      label: 'Bảo Mật & Tài Khoản',
      subLabel: 'Khóa tài khoản, Admin session & IP',
      icon: <Lock size={16} />,
      badgeCount: securityCount,
      badgeColor: 'bg-danger-light text-danger font-bold',
    },
    {
      id: 'compliance-export',
      label: 'Toàn Vẹn Bất Biến & Xuất File',
      subLabel: 'Chuỗi khối Hash & CSV/JSON Export',
      icon: <FileCheck2 size={16} />,
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-1.5 shadow-card select-none">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[200px] flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-surface-subtle border border-border shadow-xs text-text'
                  : 'hover:bg-surface-subtle/50 text-text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-subtle text-text-muted'
                  }`}
                >
                  {tab.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-text truncate">
                    {tab.label}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {tab.subLabel}
                  </div>
                </div>
              </div>

              {tab.badgeCount !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] shrink-0 border border-border/50 ${
                    tab.badgeColor || 'bg-surface-subtle text-text-muted'
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
