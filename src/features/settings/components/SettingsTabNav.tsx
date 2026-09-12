import React from 'react';
import {
  Eye,
  Brain,
  ShieldAlert,
  Lock,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { SettingsTabNavId } from '../../../domains/settings/types';

interface SettingsTabNavProps {
  activeTab: SettingsTabNavId;
  onTabChange: (tab: SettingsTabNavId) => void;
  diffCounts: Record<SettingsTabNavId, number>;
  guardrailTabWarnings: Record<SettingsTabNavId, number>;
}

export const SettingsTabNav: React.FC<SettingsTabNavProps> = ({
  activeTab,
  onTabChange,
  diffCounts,
  guardrailTabWarnings,
}) => {
  const tabs: {
    id: SettingsTabNavId;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'ai-pipeline',
      label: 'AI Vision Pipeline',
      sublabel: 'Florence-2, SAM, Quota & Workers',
      icon: <Eye size={15} />,
    },
    {
      id: 'srs-learning',
      label: 'SRS Engine & TTS',
      sublabel: 'FSRS-4.5, Mature Days & Giọng Đọc',
      icon: <Brain size={15} />,
    },
    {
      id: 'economy-guardrails',
      label: 'LiveOps Guardrails',
      sublabel: 'Trần Thưởng Coins/Gems & Streak',
      icon: <ShieldAlert size={15} />,
    },
    {
      id: 'security-access',
      label: 'Bảo Mật & RBAC',
      sublabel: 'Ma Trận Vai Trò & Operators',
      icon: <Lock size={15} />,
    },
    {
      id: 'system-maintenance',
      label: 'Hạ Tầng & Cache',
      sublabel: 'Phiên Bản App, R2 Storage & Purge',
      icon: <Wrench size={15} />,
    },
  ];

  return (
    <div className="bg-surface border-b border-border px-6">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const dirtyCount = diffCounts[tab.id] || 0;
          const warningCount = guardrailTabWarnings[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all relative shrink-0 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-medium'
              }`}
            >
              <span
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {tab.icon}
              </span>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs tracking-tight">{tab.label}</span>

                  {dirtyCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-snapy text-white'
                          : 'bg-snapy-light text-snapy border border-snapy/20'
                      }`}
                      title={`${dirtyCount} trường thay đổi chưa lưu`}
                    >
                      {dirtyCount}
                    </span>
                  )}

                  {warningCount > 0 && (
                    <span
                      className="text-amber-400 animate-pulse"
                      title={`${warningCount} cảnh báo guardrail`}
                    >
                      <AlertCircle size={12} />
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] truncate max-w-[140px] ${
                    isActive ? 'text-white/70' : 'text-neutral-400'
                  }`}
                >
                  {tab.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
