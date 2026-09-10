import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AlertCircle, ShieldAlert, Check, X } from 'lucide-react';
const STATUS_LABELS = {
    draft: { label: 'Bản nháp (Draft)', color: 'bg-slate-100 text-slate-700' },
    review: { label: 'Chờ duyệt (In Review)', color: 'bg-info-light text-info' },
    published: { label: 'Đã xuất bản (Published)', color: 'bg-primary-light text-primary' },
    archived: { label: 'Lưu trữ / Đã ẩn (Archived)', color: 'bg-danger-light text-danger' },
};
export const AuditModal = ({ isOpen, word, currentStatus, targetStatus, onConfirm, onCancel, }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    if (!isOpen)
        return null;
    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do chuyển trạng thái để lưu vết Audit Trail.');
            return;
        }
        onConfirm(reason.trim());
        setReason('');
        setError('');
    };
    const curr = STATUS_LABELS[currentStatus] || STATUS_LABELS.draft;
    const target = STATUS_LABELS[targetStatus] || STATUS_LABELS.published;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4", children: _jsxs("div", { className: "w-full max-w-md bg-surface rounded-xl border border-border shadow-modal p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-2 text-text font-bold text-sm", children: [_jsx(ShieldAlert, { size: 18, className: "text-primary" }), _jsx("span", { children: "Audit Trail \u2014 X\u00E1c nh\u1EADn thay \u0111\u1ED5i tr\u1EA1ng th\u00E1i" })] }), _jsx("button", { type: "button", onClick: onCancel, className: "text-text-muted hover:text-text p-1 rounded hover:bg-surface-subtle", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "bg-surface-subtle p-3 rounded-lg border border-border space-y-2", children: [_jsxs("div", { className: "text-xs text-text-muted", children: ["T\u1EEB v\u1EF1ng: ", _jsx("span", { className: "font-bold text-text font-mono text-sm", children: word })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx("span", { className: `px-2 py-0.5 rounded text-[11px] font-medium ${curr.color}`, children: curr.label }), _jsx("span", { className: "text-text-muted", children: "\u2794" }), _jsx("span", { className: `px-2 py-0.5 rounded text-[11px] font-bold ${target.color}`, children: target.label })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("label", { className: "text-xs font-semibold text-text flex items-center justify-between", children: [_jsx("span", { children: "L\u00FD do thay \u0111\u1ED5i (B\u1EAFt bu\u1ED9c cho nh\u1EADt k\u00FD ki\u1EC3m to\u00E1n) *" }), _jsx("span", { className: "text-[11px] text-text-muted", children: "Operator: Lead Admin" })] }), _jsx("textarea", { rows: 3, value: reason, onChange: (e) => {
                                setReason(e.target.value);
                                if (error)
                                    setError('');
                            }, placeholder: "V\u00ED d\u1EE5: \u0110\u00E3 duy\u1EC7t xong phi\u00EAn \u00E2m IPA v\u00E0 b\u1ED5 sung 2 c\u00E2u v\u00ED d\u1EE5 chu\u1EA9n ng\u1EEF c\u1EA3nh...", className: "w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-light" }), error && (_jsxs("p", { className: "text-[11px] text-danger font-medium flex items-center gap-1", children: [_jsx(AlertCircle, { size: 12 }), _jsx("span", { children: error })] }))] }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-border", children: [_jsx("button", { type: "button", onClick: onCancel, className: "px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-surface-subtle border border-border transition-all", children: "H\u1EE7y b\u1ECF" }), _jsxs("button", { type: "button", onClick: handleConfirm, className: "px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), _jsx("span", { children: "X\u00E1c nh\u1EADn & L\u01B0u v\u1EBFt" })] })] })] }) }));
};
