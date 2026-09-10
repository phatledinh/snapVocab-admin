import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Plus, CheckCircle2, Clock, FileText } from 'lucide-react';
const CEFR_BADGES = {
    A1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    A2: 'bg-teal-50 text-teal-700 border-teal-200',
    B1: 'bg-amber-50 text-amber-700 border-amber-200',
    B2: 'bg-orange-50 text-orange-700 border-orange-200',
    C1: 'bg-purple-50 text-purple-700 border-purple-200',
    C2: 'bg-rose-50 text-rose-700 border-rose-200',
};
const STATUS_ICONS = {
    published: {
        icon: _jsx(CheckCircle2, { size: 12 }),
        color: 'text-primary',
        tooltip: 'Đã xuất bản',
    },
    review: {
        icon: _jsx(Clock, { size: 12 }),
        color: 'text-info',
        tooltip: 'Chờ kiểm duyệt',
    },
    draft: {
        icon: _jsx(FileText, { size: 12 }),
        color: 'text-text-muted',
        tooltip: 'Bản nháp',
    },
    archived: {
        icon: _jsx("span", { className: "w-2 h-2 rounded-full bg-danger inline-block" }),
        color: 'text-danger',
        tooltip: 'Đã lưu trữ',
    },
};
export const WordList = ({ words, selectedId, onSelectWord, onAddNewWord, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cefrFilter, setCefrFilter] = useState('all');
    const filteredWords = words.filter((w) => {
        const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.meanings.some((m) => m.definitionVi.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
        const matchesCefr = cefrFilter === 'all' || w.cefr === cefrFilter;
        return matchesSearch && matchesStatus && matchesCefr;
    });
    return (_jsxs("div", { className: "h-full flex flex-col bg-surface border-r border-border select-none", children: [_jsxs("div", { className: "p-3.5 border-b border-border space-y-2.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-bold text-text uppercase tracking-wider", children: "Vocabulary Bank" }), _jsxs("div", { className: "text-[11px] text-text-muted", children: [words.length, " t\u1EEB v\u1EF1ng (", words.filter((w) => w.status === 'review').length, " ch\u1EDD duy\u1EC7t)"] })] }), _jsxs("button", { type: "button", onClick: onAddNewWord, className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all", children: [_jsx(Plus, { size: 14 }), _jsx("span", { children: "Th\u00EAm t\u1EEB" })] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-2.5 text-text-light" }), _jsx("input", { type: "text", placeholder: "T\u00ECm theo t\u1EEB, ngh\u0129a ti\u1EBFng Vi\u1EC7t...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-8 pr-3 py-1.5 rounded-md text-xs border border-border bg-surface-subtle/50 text-text placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface" })] }), _jsx("div", { className: "flex items-center gap-1 overflow-x-auto text-[11px] pb-0.5", children: ['all', 'review', 'published', 'draft'].map((st) => (_jsx("button", { type: "button", onClick: () => setStatusFilter(st), className: `px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${statusFilter === st
                                ? 'bg-text text-white shadow-xs'
                                : 'text-text-muted hover:bg-surface-subtle hover:text-text'}`, children: st === 'all'
                                ? 'Tất cả'
                                : st === 'review'
                                    ? 'Chờ duyệt'
                                    : st === 'published'
                                        ? 'Đã phát hành'
                                        : 'Bản nháp' }, st))) })] }), _jsxs("div", { className: "px-3.5 py-1.5 border-b border-border/60 bg-surface-subtle/40 flex items-center justify-between text-[11px] text-text-muted", children: [_jsx("span", { children: "Khung CEFR:" }), _jsx("div", { className: "flex items-center gap-1", children: ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (_jsx("button", { type: "button", onClick: () => setCefrFilter(lvl), className: `px-1 rounded text-[10px] font-mono font-medium ${cefrFilter === lvl
                                ? 'bg-primary-light text-primary font-bold border border-primary/20'
                                : 'text-text-muted hover:text-text'}`, children: lvl }, lvl))) })] }), _jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-border/60", children: filteredWords.length === 0 ? (_jsx("div", { className: "p-8 text-center text-xs text-text-muted", children: "Kh\u00F4ng t\u00ECm th\u1EA5y t\u1EEB v\u1EF1ng ph\u00F9 h\u1EE3p" })) : (filteredWords.map((item) => {
                    const isSelected = item.id === selectedId;
                    const primaryMeaning = item.meanings[0]?.definitionVi || 'Chưa có định nghĩa';
                    const cefrBadge = CEFR_BADGES[item.cefr];
                    const statusInfo = STATUS_ICONS[item.status];
                    return (_jsxs("div", { onClick: () => onSelectWord(item.id), className: `p-3 cursor-pointer transition-all ${isSelected
                            ? 'bg-primary-light/40 border-l-4 border-primary pl-2'
                            : 'hover:bg-surface-subtle/70'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-bold text-sm text-text tracking-tight", children: item.word }), _jsx("span", { className: `text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${cefrBadge}`, children: item.cefr })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [item.source === 'SCAN' && (_jsx("span", { className: "text-[9px] font-bold text-snapy bg-snapy-light px-1 rounded border border-snapy/20", children: "SCAN" })), item.source === 'AI' && (_jsx("span", { className: "text-[9px] font-bold text-info bg-info-light px-1 rounded border border-info/20", children: "AI" })), _jsx("span", { className: statusInfo.color, title: statusInfo.tooltip, children: statusInfo.icon })] })] }), _jsxs("div", { className: "text-[11px] font-mono text-text-muted mb-1", children: [item.phonetic, " \u00B7 ", _jsx("span", { className: "italic", children: item.partOfSpeech })] }), _jsx("div", { className: "text-xs text-text-muted line-clamp-1", children: primaryMeaning })] }, item.id));
                })) })] }));
};
