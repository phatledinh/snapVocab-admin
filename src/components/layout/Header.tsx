import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  currentWordTitle?: string;
  activeNav?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentWordTitle,
  activeNav = 'dashboard',
}) => {
  const renderBreadcrumb = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            <span className="text-text-muted">Overview</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Dashboard</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text">Operational Pulse & Triage</span>
          </>
        );
      case 'analytics':
        return (
          <>
            <span className="text-text-muted">Overview</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Analytics</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text">Deep-Dive Intelligence & Cohorts</span>
          </>
        );
      case 'content-studio':
        return (
          <>
            <span className="text-text-muted">Learning</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Content Studio</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text">
              {currentWordTitle ? `Editing: ${currentWordTitle}` : 'Split-Screen Editor'}
            </span>
          </>
        );
      case 'topics':
        return (
          <>
            <span className="text-text-muted">Learning</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Topics & Decks</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text">Taxonomy & System Decks</span>
          </>
        );
      case 'templates':
        return (
          <>
            <span className="text-text-muted">Learning</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Templates</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text">Card Templates Studio & Management</span>
          </>
        );
      case 'ai-queue':
        return (
          <>
            <span className="text-text-muted">AI Studio</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Review Queue</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-snapy">Pending Inspection [18]</span>
          </>
        );
      case 'shop':
        return (
          <>
            <span className="text-text-muted">LiveOps</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Shop & Economy</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-[#9A7000]">Currency Circulation</span>
          </>
        );
      case 'learners':
        return (
          <>
            <span className="text-text-muted">People</span>
            <span className="text-text-light">/</span>
            <span className="text-text-muted">Learners</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-primary">Learner 360 & Streak Support</span>
          </>
        );
      default:
        return (
          <>
            <span className="text-text-muted">SnapVocab Admin</span>
            <span className="text-text-light">/</span>
            <span className="font-semibold text-text capitalize">{activeNav.replace('-', ' ')}</span>
          </>
        );
    }
  };

  return (
    <header className="h-12 border-b border-border bg-surface px-4 flex items-center justify-between select-none shrink-0">
      {/* Left: Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        {renderBreadcrumb()}
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-sm mx-6">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-text-light" />
          <input
            type="text"
            readOnly
            placeholder="Tìm kiếm nhanh từ vựng, deck hoặc lệnh... (Nhấn ⌘K)"
            className="w-full pl-8 pr-12 py-1 rounded-md text-xs border border-border bg-surface-subtle/60 text-text-muted cursor-pointer hover:bg-surface focus:outline-none"
            onClick={() => alert('Command Palette (Cmd+K) sẽ mở hộp thoại tìm kiếm toàn cục.')}
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-surface border border-border rounded text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Operational Health & Alerts */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LiveOps Sync: Connected</span>
        </div>

        <button
          type="button"
          className="p-1.5 text-text-muted hover:text-text rounded-md hover:bg-surface-subtle relative"
          title="Thông báo hệ thống"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-snapy" />
        </button>
      </div>
    </header>
  );
};
