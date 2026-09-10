import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  FolderTree,
  Layers,
  Sparkles,
  Camera,
  ShoppingBag,
  Target,
  Award,
  Calendar,
  Users,
  AlertTriangle,
  History,
  Settings,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  onNavigate: (nav: string) => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavigate }) => {
  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
      ],
    },
    {
      title: 'LEARNING',
      items: [
        {
          id: 'content-studio',
          label: 'Content Studio',
          icon: <BookOpen size={16} />,
          badge: 'Active',
          badgeColor: 'bg-primary-light text-primary',
        },
        { id: 'topics', label: 'Topics & Decks', icon: <FolderTree size={16} /> },
        { id: 'templates', label: 'Templates', icon: <Layers size={16} /> },
      ],
    },
    {
      title: 'AI STUDIO',
      items: [
        { id: 'ai-monitor', label: 'AI Scan Monitor', icon: <Camera size={16} /> },
        {
          id: 'ai-queue',
          label: 'Review Queue',
          icon: <Sparkles size={16} />,
          badge: 18,
          badgeColor: 'bg-snapy-light text-snapy font-bold',
        },
      ],
    },
    {
      title: 'LIVEOPS',
      items: [
        { id: 'shop', label: 'Shop & Economy', icon: <ShoppingBag size={16} /> },
        { id: 'missions', label: 'Missions', icon: <Target size={16} /> },
        { id: 'badges', label: 'Badges & Titles', icon: <Award size={16} /> },
        { id: 'seasons', label: 'Leaderboard Seasons', icon: <Calendar size={16} /> },
      ],
    },
    {
      title: 'PEOPLE',
      items: [
        { id: 'learners', label: 'Learners', icon: <Users size={16} /> },
        {
          id: 'reports',
          label: 'Issue Reports',
          icon: <AlertTriangle size={16} />,
          badge: 3,
          badgeColor: 'bg-danger-light text-danger',
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'activity-log', label: 'Audit Activity Log', icon: <History size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
      ],
    },
  ];

  return (
    <aside className="w-60 h-screen bg-surface border-r border-border flex flex-col justify-between select-none shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-snapy-light border border-snapy/20 flex items-center justify-center text-lg shadow-xs">
              🦊
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-text tracking-tight">SnapVocab</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary-light text-primary border border-primary/20">
                  ADMIN
                </span>
              </div>
              <div className="text-[11px] text-text-muted">Studio & LiveOps Console</div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-2 text-[10px] font-bold tracking-wider text-text-light uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-primary-light text-primary font-bold shadow-xs'
                          : 'text-text-muted hover:bg-surface-subtle hover:text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-primary' : 'text-text-muted'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operator Status Footer */}
      <div className="p-3 border-t border-border bg-surface-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <div className="text-xs font-semibold text-text leading-none">Admin Lead</div>
              <div className="text-[10px] text-text-muted mt-0.5">Super Admin Role</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-primary" title="Online" />
        </div>
      </div>
    </aside>
  );
};
