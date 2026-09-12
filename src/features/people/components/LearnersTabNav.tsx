import React from 'react';
import { LearnersTabNavId } from '../../../domains/learners/types';
import {
  Users,
  Flame,
  BookOpen,
  ShieldCheck,
  Smartphone,
  RotateCw,
} from 'lucide-react';

interface LearnersTabNavProps {
  activeTab: LearnersTabNavId;
  onTabChange: (tab: LearnersTabNavId) => void;
  pendingStreakCount?: number;
  isSimulatorVisible?: boolean;
  onToggleSimulator?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const LearnersTabNav: React.FC<LearnersTabNavProps> = ({
  activeTab,
  onTabChange,
  pendingStreakCount = 0,
  isSimulatorVisible = false,
  onToggleSimulator,
  onRefresh,
  isRefreshing = false,
}) => {
  const tabs = [
    {
      id: 'roster' as LearnersTabNavId,
      label: 'Danh Bạ Học Viên',
      sublabel: '360 Roster & Data-Dense Table',
      icon: <Users size={15} />,
    },
    {
      id: 'streak-desk' as LearnersTabNavId,
      label: 'Hàng Đợi Khôi Phục Streak',
      sublabel: 'LiveOps Support Desk & Ticket ID',
      icon: <Flame size={15} />,
      badge: pendingStreakCount > 0 ? pendingStreakCount : undefined,
    },
    {
      id: 'retention-fsrs' as LearnersTabNavId,
      label: 'Phân Tích Trí Nhớ FSRS',
      sublabel: 'Tỷ Lệ Giữ Nhớ & Độ Bền Thẻ',
      icon: <BookOpen size={15} />,
    },
    {
      id: 'audit-log' as LearnersTabNavId,
      label: 'Nhật Ký Kiểm Toán',
      sublabel: 'Lưu Vết Can Thiệp Operator',
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
                    <span className="px-1.5 py-0.2 rounded-full bg-danger text-white text-[10px] font-bold animate-pulse">
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
