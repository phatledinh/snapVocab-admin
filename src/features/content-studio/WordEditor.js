import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Send, CheckCircle, Archive, History, Plus, Trash2, ExternalLink, ShieldCheck, Tag, BookOpen, } from 'lucide-react';
import { AudioPreviewTester } from './AudioPreviewTester';
import { AuditModal } from './AuditModal';
const PARTS_OF_SPEECH = [
    'noun',
    'verb',
    'adjective',
    'adverb',
    'preposition',
    'idiom',
    'phrase',
];
const CEFR_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SOURCE_OPTIONS = ['DICT', 'SCAN', 'TOPIC', 'AI'];
export const WordEditor = ({ card, onUpdateCard, onStatusTransition, }) => {
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState(card.status);
    const [showAuditHistory, setShowAuditHistory] = useState(false);
    // Field change helpers
    const handleFieldChange = (field, value) => {
        onUpdateCard({
            ...card,
            [field]: value,
            lastUpdated: new Date().toISOString(),
        });
    };
    const handleMeaningChange = (index, updatedMeaning) => {
        const updatedMeanings = [...card.meanings];
        updatedMeanings[index] = updatedMeaning;
        handleFieldChange('meanings', updatedMeanings);
    };
    const handleAddExample = (meaningIndex) => {
        const meaning = card.meanings[meaningIndex];
        if (!meaning)
            return;
        const newEx = {
            id: `ex-${Date.now()}`,
            en: '',
            vi: '',
        };
        handleMeaningChange(meaningIndex, {
            ...meaning,
            examples: [...meaning.examples, newEx],
        });
    };
    const handleRemoveExample = (meaningIndex, exIndex) => {
        const meaning = card.meanings[meaningIndex];
        if (!meaning)
            return;
        const updatedExamples = meaning.examples.filter((_, idx) => idx !== exIndex);
        handleMeaningChange(meaningIndex, {
            ...meaning,
            examples: updatedExamples,
        });
    };
    const handleInitiateStatusChange = (next) => {
        setTargetStatus(next);
        setShowAuditModal(true);
    };
    const handleConfirmAudit = (reason) => {
        setShowAuditModal(false);
        onStatusTransition(targetStatus, reason);
    };
    const primaryMeaning = card.meanings[0] || {
        id: 'm-default',
        partOfSpeech: card.partOfSpeech || 'noun',
        definitionVi: '',
        definitionEn: '',
        examples: [],
    };
    return (_jsxs("div", { className: "h-full flex flex-col bg-surface select-none", children: [_jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "text-xl font-extrabold text-text font-mono tracking-tight", children: card.word || 'Từ mới' }), _jsx("span", { className: `px-2 py-0.5 rounded text-[11px] font-bold uppercase ${card.status === 'published'
                                                ? 'bg-primary-light text-primary'
                                                : card.status === 'review'
                                                    ? 'bg-info-light text-info'
                                                    : 'bg-slate-100 text-slate-700'}`, children: card.status })] }), _jsxs("div", { className: "text-[11px] text-text-muted mt-0.5", children: ["ID: ", _jsx("span", { className: "font-mono", children: card.id }), " \u00B7 C\u1EADp nh\u1EADt:", ' ', new Date(card.lastUpdated).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })] })] }) }), _jsxs("button", { type: "button", onClick: () => setShowAuditHistory(!showAuditHistory), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showAuditHistory
                            ? 'bg-primary-light text-primary border-primary/30 font-bold'
                            : 'border-border text-text-muted hover:bg-surface-subtle hover:text-text'}`, children: [_jsx(History, { size: 14 }), _jsxs("span", { children: ["Audit Log (", card.auditHistory?.length || 0, ")"] })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [showAuditHistory && (_jsxs("div", { className: "p-3.5 bg-surface-subtle rounded-xl border border-border space-y-2.5 mb-2", children: [_jsxs("div", { className: "text-xs font-bold text-text flex items-center gap-1.5", children: [_jsx(ShieldCheck, { size: 14, className: "text-primary" }), _jsx("span", { children: "Nh\u1EADt k\u00FD ki\u1EC3m to\u00E1n (Audit Trail)" })] }), card.auditHistory && card.auditHistory.length > 0 ? (_jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: card.auditHistory.map((rec) => (_jsxs("div", { className: "p-2 bg-surface rounded-lg border border-border/80 text-[11px] space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-text-muted", children: [_jsx("span", { className: "font-semibold text-text", children: rec.changedBy }), _jsx("span", { className: "font-mono", children: new Date(rec.timestamp).toLocaleString('vi-VN') })] }), _jsxs("p", { className: "text-text font-medium italic", children: ["\"", rec.reason, "\""] }), _jsxs("div", { className: "text-[10px] text-text-muted", children: ["H\u00E0nh \u0111\u1ED9ng: ", _jsx("span", { className: "font-mono font-bold text-primary", children: rec.action }), rec.previousStatus && rec.nextStatus && (_jsxs("span", { children: [" (", rec.previousStatus, " \u2794 ", rec.nextStatus, ")"] }))] })] }, rec.id))) })) : (_jsx("p", { className: "text-xs text-text-muted italic", children: "Ch\u01B0a c\u00F3 b\u1EA3n ghi ki\u1EC3m to\u00E1n n\u00E0o." }))] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [_jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "T\u1EEB v\u1EF1ng (Word Name) *" }), _jsx("input", { type: "text", value: card.word, onChange: (e) => handleFieldChange('word', e.target.value), placeholder: "e.g. resilient", className: "w-full text-sm font-semibold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "T\u1EEB lo\u1EA1i (Part of Speech)" }), _jsx("select", { value: card.partOfSpeech, onChange: (e) => handleFieldChange('partOfSpeech', e.target.value), className: "w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-medium focus:outline-none focus:ring-1 focus:ring-primary", children: PARTS_OF_SPEECH.map((pos) => (_jsx("option", { value: pos, children: pos }, pos))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "Tr\u00ECnh \u0111\u1ED9 (CEFR)" }), _jsx("select", { value: card.cefr, onChange: (e) => handleFieldChange('cefr', e.target.value), className: "w-full text-xs font-mono font-bold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary", children: CEFR_OPTIONS.map((lvl) => (_jsx("option", { value: lvl, children: lvl }, lvl))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "Phi\u00EAn \u00E2m IPA (Phonetic)" }), _jsx("input", { type: "text", value: card.phonetic, onChange: (e) => handleFieldChange('phonetic', e.target.value), placeholder: "/r\u026A\u02C8z\u026Al.j\u0259nt/", className: "w-full text-xs font-mono p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "Ngu\u1ED3n d\u1EEF li\u1EC7u (Source)" }), _jsx("select", { value: card.source, onChange: (e) => handleFieldChange('source', e.target.value), className: "w-full text-xs font-semibold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary", children: SOURCE_OPTIONS.map((src) => (_jsx("option", { value: src, children: src }, src))) })] })] }), _jsx(AudioPreviewTester, { word: card.word, config: card.audio, onChange: (newAudio) => handleFieldChange('audio', newAudio) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "text-xs font-semibold text-text flex items-center justify-between", children: [_jsx("span", { children: "\u1EA2nh minh h\u1ECDa (Illustration / Object Image URL)" }), _jsx("span", { className: "text-[11px] text-text-muted", children: "Unsplash ho\u1EB7c CDN SnapVocab" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: card.media?.imageUrl || '', onChange: (e) => handleFieldChange('media', {
                                            ...card.media,
                                            imageUrl: e.target.value,
                                        }), placeholder: "https://images.unsplash.com/...", className: "flex-1 text-xs p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" }), card.media?.imageUrl && (_jsx("a", { href: card.media.imageUrl, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-subtle", title: "M\u1EDF \u1EA3nh g\u1ED1c", children: _jsx(ExternalLink, { size: 14 }) }))] })] }), _jsxs("div", { className: "space-y-3 pt-2 border-t border-border", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(BookOpen, { size: 14, className: "text-primary" }), _jsx("span", { children: "\u0110\u1ECBnh ngh\u0129a & Di\u1EC5n gi\u1EA3i" })] }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "Ngh\u0129a ti\u1EBFng Vi\u1EC7t *" }), _jsx("textarea", { rows: 2, value: primaryMeaning.definitionVi, onChange: (e) => handleMeaningChange(0, {
                                            ...primaryMeaning,
                                            definitionVi: e.target.value,
                                        }), placeholder: "\u0110\u1ECBnh ngh\u0129a ti\u1EBFng Vi\u1EC7t d\u1EC5 hi\u1EC3u cho ng\u01B0\u1EDDi h\u1ECDc...", className: "w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-text", children: "\u0110\u1ECBnh ngh\u0129a ti\u1EBFng Anh (English Definition)" }), _jsx("textarea", { rows: 2, value: primaryMeaning.definitionEn || '', onChange: (e) => handleMeaningChange(0, {
                                            ...primaryMeaning,
                                            definitionEn: e.target.value,
                                        }), placeholder: "English dictionary definition...", className: "w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "text-xs font-semibold text-text", children: ["C\u00E2u v\u00ED d\u1EE5 ng\u1EEF c\u1EA3nh (", primaryMeaning.examples.length, ")"] }), _jsxs("button", { type: "button", onClick: () => handleAddExample(0), className: "flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover", children: [_jsx(Plus, { size: 12 }), _jsx("span", { children: "Th\u00EAm c\u00E2u v\u00ED d\u1EE5" })] })] }), primaryMeaning.examples.map((ex, exIdx) => (_jsxs("div", { className: "p-2.5 bg-surface-subtle/70 rounded-lg border border-border space-y-1.5 relative group", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-[10px] font-mono font-bold text-text-muted", children: ["#", exIdx + 1, " EN:"] }), _jsx("input", { type: "text", value: ex.en, onChange: (e) => {
                                                            const updated = [...primaryMeaning.examples];
                                                            updated[exIdx] = { ...ex, en: e.target.value };
                                                            handleMeaningChange(0, { ...primaryMeaning, examples: updated });
                                                        }, placeholder: "Sentence in English...", className: "flex-1 text-xs p-1.5 rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary" }), _jsx("button", { type: "button", onClick: () => handleRemoveExample(0, exIdx), className: "text-text-muted hover:text-danger p-1 rounded hover:bg-surface", title: "X\u00F3a c\u00E2u v\u00ED d\u1EE5", children: _jsx(Trash2, { size: 13 }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-[10px] font-mono font-bold text-text-muted", children: ["#", exIdx + 1, " VI:"] }), _jsx("input", { type: "text", value: ex.vi, onChange: (e) => {
                                                            const updated = [...primaryMeaning.examples];
                                                            updated[exIdx] = { ...ex, vi: e.target.value };
                                                            handleMeaningChange(0, { ...primaryMeaning, examples: updated });
                                                        }, placeholder: "D\u1ECBch ngh\u0129a ti\u1EBFng Vi\u1EC7t...", className: "flex-1 text-xs p-1.5 rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary" })] })] }, ex.id || exIdx)))] })] }), _jsxs("div", { className: "space-y-1 pt-2 border-t border-border", children: [_jsxs("label", { className: "text-xs font-semibold text-text flex items-center gap-1.5", children: [_jsx(Tag, { size: 13, className: "text-text-muted" }), _jsx("span", { children: "Th\u1EBB t\u1EEB kh\u00F3a (Tags - ph\u00E2n t\u00E1ch b\u1EB1ng d\u1EA5u ph\u1EA9y)" })] }), _jsx("input", { type: "text", value: card.tags.join(', '), onChange: (e) => handleFieldChange('tags', e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean)), placeholder: "toeic, business, daily, fruit...", className: "w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary" })] })] }), _jsxs("div", { className: "p-3.5 border-t border-border bg-surface-subtle/50 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-text-muted flex items-center gap-2", children: [_jsx("span", { children: "Quy tr\u00ECnh v\u1EADn h\u00E0nh:" }), _jsxs("span", { className: "font-mono text-[11px] font-bold text-text", children: [card.status === 'draft' && 'Draft ➔ In Review', card.status === 'review' && 'Review ➔ Published', card.status === 'published' && 'Published (Live)', card.status === 'archived' && 'Archived'] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [card.status !== 'draft' && (_jsx("button", { type: "button", onClick: () => handleInitiateStatusChange('draft'), className: "px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-surface border border-border transition-all", children: "V\u1EC1 B\u1EA3n nh\u00E1p" })), card.status === 'draft' && (_jsxs("button", { type: "button", onClick: () => handleInitiateStatusChange('review'), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-info text-white hover:bg-info-hover shadow-sm transition-all", children: [_jsx(Send, { size: 13 }), _jsx("span", { children: "G\u1EEDi Ki\u1EC3m duy\u1EC7t (Review)" })] })), card.status === 'review' && (_jsxs("button", { type: "button", onClick: () => handleInitiateStatusChange('published'), className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all", children: [_jsx(CheckCircle, { size: 14 }), _jsx("span", { children: "Duy\u1EC7t & Xu\u1EA5t b\u1EA3n (Publish)" })] })), card.status === 'published' && (_jsxs("button", { type: "button", onClick: () => handleInitiateStatusChange('archived'), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger-light border border-danger/30 transition-all", children: [_jsx(Archive, { size: 13 }), _jsx("span", { children: "L\u01B0u tr\u1EEF (Archive)" })] }))] })] }), _jsx(AuditModal, { isOpen: showAuditModal, word: card.word, currentStatus: card.status, targetStatus: targetStatus, onConfirm: handleConfirmAudit, onCancel: () => setShowAuditModal(false) })] }));
};
