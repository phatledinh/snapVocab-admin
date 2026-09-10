import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, Check, X } from 'lucide-react';
import { VocabStatus } from '../../domains/flashcard/types';

interface AuditModalProps {
  isOpen: boolean;
  word: string;
  currentStatus: VocabStatus;
  targetStatus: VocabStatus;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<VocabStatus, { label: string; color: string }> = {
  draft: { label: 'Bản nháp (Draft)', color: 'bg-slate-100 text-slate-700' },
  review: { label: 'Chờ duyệt (In Review)', color: 'bg-info-light text-info' },
  published: { label: 'Đã xuất bản (Published)', color: 'bg-primary-light text-primary' },
  archived: { label: 'Lưu trữ / Đã ẩn (Archived)', color: 'bg-danger-light text-danger' },
};

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  word,
  currentStatus,
  targetStatus,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-surface rounded-xl border border-border shadow-modal p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2 text-text font-bold text-sm">
            <ShieldAlert size={18} className="text-primary" />
            <span>Audit Trail — Xác nhận thay đổi trạng thái</span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-text-muted hover:text-text p-1 rounded hover:bg-surface-subtle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Transition Preview */}
        <div className="bg-surface-subtle p-3 rounded-lg border border-border space-y-2">
          <div className="text-xs text-text-muted">
            Từ vựng: <span className="font-bold text-text font-mono text-sm">{word}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${curr.color}`}>
              {curr.label}
            </span>
            <span className="text-text-muted">➔</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${target.color}`}>
              {target.label}
            </span>
          </div>
        </div>

        {/* Reason Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text flex items-center justify-between">
            <span>Lý do thay đổi (Bắt buộc cho nhật ký kiểm toán) *</span>
            <span className="text-[11px] text-text-muted">Operator: Lead Admin</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ví dụ: Đã duyệt xong phiên âm IPA và bổ sung 2 câu ví dụ chuẩn ngữ cảnh..."
            className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-light"
          />
          {error && (
            <p className="text-[11px] text-danger font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-surface-subtle border border-border transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Xác nhận & Lưu vết</span>
          </button>
        </div>
      </div>
    </div>
  );
};
