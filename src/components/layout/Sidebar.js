import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LayoutDashboard, BarChart3, BookOpen, FolderTree, Layers, Sparkles, Camera, ShoppingBag, Target, Award, Calendar, Users, AlertTriangle, History, Settings, } from 'lucide-react';
export const Sidebar = ({ activeNav, onNavigate }) => {
    const sections = [
        {
            title: 'OVERVIEW',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: _jsx(LayoutDashboard, { size: 16 }) },
                { id: 'analytics', label: 'Analytics', icon: _jsx(BarChart3, { size: 16 }) },
            ],
        },
        {
            title: 'LEARNING',
            items: [
                {
                    id: 'content-studio',
                    label: 'Content Studio',
                    icon: _jsx(BookOpen, { size: 16 }),
                    badge: 'Active',
                    badgeColor: 'bg-primary-light text-primary',
                },
                { id: 'topics', label: 'Topics & Decks', icon: _jsx(FolderTree, { size: 16 }) },
                { id: 'templates', label: 'Templates', icon: _jsx(Layers, { size: 16 }) },
            ],
        },
        {
            title: 'AI STUDIO',
            items: [
                { id: 'ai-monitor', label: 'AI Scan Monitor', icon: _jsx(Camera, { size: 16 }) },
                {
                    id: 'ai-queue',
                    label: 'Review Queue',
                    icon: _jsx(Sparkles, { size: 16 }),
                    badge: 18,
                    badgeColor: 'bg-snapy-light text-snapy font-bold',
                },
            ],
        },
        {
            title: 'LIVEOPS',
            items: [
                { id: 'shop', label: 'Shop & Economy', icon: _jsx(ShoppingBag, { size: 16 }) },
                { id: 'missions', label: 'Missions', icon: _jsx(Target, { size: 16 }) },
                { id: 'badges', label: 'Badges & Titles', icon: _jsx(Award, { size: 16 }) },
                { id: 'seasons', label: 'Leaderboard Seasons', icon: _jsx(Calendar, { size: 16 }) },
            ],
        },
        {
            title: 'PEOPLE',
            items: [
                { id: 'learners', label: 'Learners', icon: _jsx(Users, { size: 16 }) },
                {
                    id: 'reports',
                    label: 'Issue Reports',
                    icon: _jsx(AlertTriangle, { size: 16 }),
                    badge: 3,
                    badgeColor: 'bg-danger-light text-danger',
                },
            ],
        },
        {
            title: 'SYSTEM',
            items: [
                { id: 'activity-log', label: 'Audit Activity Log', icon: _jsx(History, { size: 16 }) },
                { id: 'settings', label: 'Settings', icon: _jsx(Settings, { size: 16 }) },
            ],
        },
    ];
    return (_jsxs("aside", { className: "w-60 h-screen bg-surface border-r border-border flex flex-col justify-between select-none shrink-0", children: [_jsxs("div", { children: [_jsx("div", { className: "p-4 border-b border-border flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-snapy-light border border-snapy/20 flex items-center justify-center text-lg shadow-xs", children: "\uD83E\uDD8A" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-extrabold text-sm text-text tracking-tight", children: "SnapVocab" }), _jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary-light text-primary border border-primary/20", children: "ADMIN" })] }), _jsx("div", { className: "text-[11px] text-text-muted", children: "Studio & LiveOps Console" })] })] }) }), _jsx("div", { className: "p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]", children: sections.map((sec) => (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "px-2 text-[10px] font-bold tracking-wider text-text-light uppercase", children: sec.title }), _jsx("div", { className: "space-y-0.5", children: sec.items.map((item) => {
                                        const isActive = activeNav === item.id;
                                        return (_jsxs("button", { type: "button", onClick: () => onNavigate(item.id), className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                                ? 'bg-primary-light text-primary font-bold shadow-xs'
                                                : 'text-text-muted hover:bg-surface-subtle hover:text-text'}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: isActive ? 'text-primary' : 'text-text-muted', children: item.icon }), _jsx("span", { children: item.label })] }), item.badge && (_jsx("span", { className: `text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${item.badgeColor}`, children: item.badge }))] }, item.id));
                                    }) })] }, sec.title))) })] }), _jsx("div", { className: "p-3 border-t border-border bg-surface-subtle/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs", children: "AD" }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-text leading-none", children: "Admin Lead" }), _jsx("div", { className: "text-[10px] text-text-muted mt-0.5", children: "Super Admin Role" })] })] }), _jsx("span", { className: "w-2 h-2 rounded-full bg-primary", title: "Online" })] }) })] }));
};
