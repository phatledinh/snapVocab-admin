import React, { useState } from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';

interface AuditReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, operatorName: string) => void;
  title: string;
  description: string;
  actionLabel?: string;
  isDangerous?: boolean;
}

export const AuditReasonModal: React.FC<AuditReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel = 'Xác Nhận Thay Đổi',
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('Admin Lead');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do can thiệp kinh tế/vận hành để lưu vào nhật ký Audit Trail.');
      return;
    }
    onConfirm(reason, operatorName);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-modal overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-5 py-4 border-b border-border flex items-center justify-between ${
          isDangerous ? 'bg-danger-light/50' : 'bg-surface-subtle'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDangerous ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'
            }`}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">{title}</h3>
              <p className="text-[11px] text-text-muted">Bắt buộc lưu vết kiểm toán (Audit Trail)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200 text-text-muted hover:text-text transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-text-muted leading-relaxed">{description}</p>

          <div>
            <label className="block text-xs font-bold text-text mb-1">
              Người Thao Tác (Operator Name)
            </label>
            <input
              type="text"
              required
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1">
              Lý Do Thay Đổi / Mã Ticket Hỗ Trợ <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Điều chỉnh giá theo chiến dịch cuối tuần / Kích hoạt bảo trì để vá lỗi duplication..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-text font-normal resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-semibold transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
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
