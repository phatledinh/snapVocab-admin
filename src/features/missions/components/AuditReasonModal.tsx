import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, X, Check } from 'lucide-react';

interface AuditReasonModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  isDangerous?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const AuditReasonModal: React.FC<AuditReasonModalProps> = ({
  isOpen,
  title,
  description,
  actionLabel = 'Xác Nhận & Lưu Nhật Ký',
  isDangerous = false,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 8) {
      setError('Lý do kiểm toán bắt buộc nhập tối thiểu 8 ký tự.');
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className={`p-4 border-b border-border flex items-start justify-between ${
            isDangerous ? 'bg-danger-light/30' : 'bg-surface-subtle/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isDangerous
                  ? 'bg-danger-light text-danger border border-danger/20'
                  : 'bg-primary-light text-primary border border-primary/20'
              }`}
            >
              {isDangerous ? <AlertTriangle size={18} /> : <ShieldAlert size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-text leading-tight">{title}</h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Bắt buộc ghi nhận lý do vào LiveOps Audit Trail
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <p className="text-xs text-text-muted leading-relaxed">{description}</p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text">
              Lý do vận hành / Mã Ticket phê duyệt: <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="VD: Điều chỉnh theo yêu cầu chiến dịch Sprint 4 / Đã được Super Admin phê duyệt qua Ticket #OPS-8472..."
              className={`w-full text-xs p-2.5 rounded-lg border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all ${
                error
                  ? 'border-danger focus:ring-danger'
                  : 'border-border focus:ring-primary focus:border-primary'
              }`}
            />
            {error && <p className="text-[11px] text-danger font-medium">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-subtle transition-all"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all ${
                isDangerous
                  ? 'bg-danger hover:bg-danger-hover'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              <Check size={14} />
              <span>{actionLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
