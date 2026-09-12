import React, { useState } from 'react';
import {
  X,
  History,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  Tag,
} from 'lucide-react';
import { ConfigFieldDiff } from '../../../domains/settings/types';

interface SettingsAuditDiffModalProps {
  isOpen: boolean;
  diffs: ConfigFieldDiff[];
  onClose: () => void;
  onConfirm: (reason: string, ticketId: string) => void;
}

export const SettingsAuditDiffModal: React.FC<SettingsAuditDiffModalProps> = ({
  isOpen,
  diffs,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [superAdminAcknowledged, setSuperAdminAcknowledged] = useState(false);

  if (!isOpen) return null;

  const hasViolations = diffs.some((d) => d.isGuardrailViolation);
  const isReasonValid = reason.trim().length >= 8;
  const canSubmit = isReasonValid && (!hasViolations || superAdminAcknowledged);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirm(reason.trim(), ticketId.trim());
    setReason('');
    setTicketId('');
    setSuperAdminAcknowledged(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <History size={17} />
            </div>
            <div>
              <h2 className="text-sm font-black text-text tracking-tight flex items-center gap-2">
                Xác Nhận Thay Đổi Cấu Hình & Ghi Sổ Cái
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary-light text-primary border border-primary/20">
                  SYSTEM_CONFIG_UPDATED
                </span>
              </h2>
              <p className="text-[11px] text-text-muted">
                Kiểm tra danh sách tham số trước khi áp dụng vào toàn hệ thống.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Diff Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-text uppercase text-[10px] tracking-wider text-neutral-500">
                Bảng so sánh tham số thay đổi ({diffs.length})
              </span>
              <span className="text-[11px] text-neutral-400">
                Toàn bộ thay đổi sẽ được lưu phiên bản mới
              </span>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 text-neutral-600 border-b border-border text-[11px] font-semibold">
                    <th className="py-2.5 px-3">Tham số / Nhãn</th>
                    <th className="py-2.5 px-3">Giá trị hiện tại</th>
                    <th className="py-2.5 px-3">Giá trị mới</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {diffs.map((diff) => (
                    <tr
                      key={diff.fieldKey}
                      className={diff.isGuardrailViolation ? 'bg-amber-50/50' : 'hover:bg-neutral-50/50'}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-text">{diff.labelVi}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{diff.fieldKey}</div>
                        {diff.isGuardrailViolation && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                            <AlertTriangle size={11} className="shrink-0" />
                            {diff.violationMessage}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono text-[11px] border border-border">
                          {String(diff.oldValue)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <ArrowRight size={12} className="text-neutral-400 shrink-0" />
                          <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                            diff.isGuardrailViolation
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-primary-light text-primary border-primary/30'
                          }`}>
                            {String(diff.newValue)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guardrail Violation Warning Box */}
          {hasViolations && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="p-1 rounded-md bg-amber-500 text-white shrink-0 mt-0.5">
                <AlertTriangle size={14} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 text-xs">Cảnh Báo Hàng Rào An Toàn (LiveOps Guardrails)</h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Có ít nhất 1 tham số vượt quá ngưỡng an toàn kinh tế ảo. Thao tác này đòi hỏi sự đồng thuận và xác nhận trách nhiệm của Super Admin.
                </p>
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={superAdminAcknowledged}
                    onChange={(e) => setSuperAdminAcknowledged(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] font-bold text-amber-900">
                    Tôi xác nhận việc điều chỉnh này đã được ban quản trị phê duyệt.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Audit Inputs Form */}
          <form id="auditForm" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-text mb-1">
                Lý do thay đổi cấu hình (Audit Reason) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-neutral-400" />
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ví dụ: Tăng quota scan hằng ngày cho chiến dịch mùa hè 2026; Điều chỉnh ngưỡng mature theo kết quả A/B test..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border focus:outline-hidden focus:border-primary text-xs bg-surface"
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[10px] text-neutral-400">
                <span>Bắt buộc tối thiểu 8 ký tự để lưu vào Sổ cái Kiểm toán</span>
                <span>{reason.length}/8 ký tự</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-text mb-1">
                Mã Ticket / Task liên quan (Tùy chọn)
              </label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Ví dụ: JIRA-2418 hoặc TICKET-994"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border focus:outline-hidden focus:border-primary text-xs bg-surface"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
            <ShieldCheck size={14} className="text-primary" />
            <span>Thao tác sẽ được gắn định danh Operator và ghi lại địa chỉ IP</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-neutral-600 hover:bg-neutral-100 font-semibold text-xs transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              form="auditForm"
              disabled={!canSubmit}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <Check size={14} className="stroke-[3]" />
              Xác Nhận Áp Dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
