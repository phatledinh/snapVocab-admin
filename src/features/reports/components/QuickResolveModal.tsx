import React, { useState } from 'react';
import {
  IssueReportItem,
  IssueResolutionAction,
} from '../../../domains/issue-reports/types';
import {
  CheckCircle2,
  X,
  Coins,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface QuickResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueReportItem | null;
  onConfirmResolve: (
    issueId: string,
    action: IssueResolutionAction,
    reason: string,
    coins: number,
    sendPush: boolean
  ) => void;
}

export const QuickResolveModal: React.FC<QuickResolveModalProps> = ({
  isOpen,
  onClose,
  issue,
  onConfirmResolve,
}) => {
  const [action, setAction] = useState<IssueResolutionAction>(
    'VOCABULARY_UPDATED_INLINE'
  );
  const [auditReason, setAuditReason] = useState<string>(
    'Đã tiếp nhận phản hồi, kiểm tra đối chiếu dữ liệu và hoàn tất xử lý theo quy chuẩn.'
  );
  const [coins, setCoins] = useState<number>(20);
  const [sendPush, setSendPush] = useState<boolean>(true);

  if (!isOpen || !issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmResolve(issue.id, action, auditReason, coins, sendPush);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border bg-canvas flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">
                Giải Quyết Sự Cố & Lưu Kiểm Toán
              </h3>
              <span className="font-mono text-[10px] text-text-muted">
                Ticket: {issue.ticketId} • Người học: {issue.learner.fullName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Action Select */}
          <div>
            <label className="block text-[11px] font-semibold text-text mb-1">
              Hành Động Giải Quyết *
            </label>
            <select
              value={action}
              onChange={(e) =>
                setAction(e.target.value as IssueResolutionAction)
              }
              className="w-full px-3 py-1.5 bg-canvas border border-border rounded-lg text-xs font-semibold text-text focus:outline-none focus:border-primary"
            >
              <option value="VOCABULARY_UPDATED_INLINE">
                📚 Cập nhật nghĩa / phiên âm từ vựng
              </option>
              <option value="LABEL_CORRECTED_AND_DATASET_SAVED">
                📸 Sửa nhãn camera AI & Xuất dataset Gemini
              </option>
              <option value="STREAK_RESTORED">
                🔥 Khôi phục chuỗi học Streak
              </option>
              <option value="COMPENSATION_GRANTED">
                🪙 Cấp bù tiền tệ Coins / Gems
              </option>
              <option value="OPENED_IN_CONTENT_STUDIO">
                ✍️ Chuyển biên tập thẻ trong Content Studio
              </option>
              <option value="DISMISSED_INVALID">
                ✖️ Bác bỏ báo cáo (Dữ liệu đã chuẩn)
              </option>
            </select>
          </div>

          {/* Audit Reason (Mandatory) */}
          <div>
            <label className="block text-[11px] font-semibold text-text mb-1 flex items-center justify-between">
              <span>Lý Do Kiểm Toán (Audit Reason) *</span>
              <span className="text-[10px] text-text-muted font-normal">Bắt buộc</span>
            </label>
            <textarea
              required
              rows={2}
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border rounded-lg text-xs text-text focus:outline-none focus:border-primary resize-none leading-relaxed"
              placeholder="Nhập chi tiết lý do và biện pháp xử lý..."
            />
          </div>

          {/* Reward Coins */}
          <div>
            <label className="block text-[11px] font-semibold text-text mb-1">
              Phần Thưởng Tri Ân Đóng Góp (Coins)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 50].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCoins(amount)}
                  className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    coins === amount
                      ? 'bg-reward-light border-reward text-reward shadow-xs'
                      : 'bg-canvas border-border text-text-muted hover:text-text'
                  }`}
                >
                  {amount === 0 ? 'Không tặng' : `+${amount} Coins`}
                </button>
              ))}
            </div>
          </div>

          {/* Send Push Notification Checkbox */}
          <div className="pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendPush}
                onChange={(e) => setSendPush(e.target.checked)}
                className="rounded border-border text-primary focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-medium text-text flex items-center gap-1">
                <Send size={12} className="text-primary" />
                Gửi thông báo phản hồi (In-App Push) tới điện thoại học viên
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-medium transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 size={14} />
              <span>Xác Nhận & Hoàn Tất</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
