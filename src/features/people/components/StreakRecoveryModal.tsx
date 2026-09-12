import React, { useState } from 'react';
import {
  LearnerProfile,
  StreakLossReason,
} from '../../../domains/learners/types';
import {
  X,
  Flame,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface StreakRecoveryModalProps {
  learner: LearnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    learnerId: string,
    targetStreak: number,
    ticketId: string,
    reason: string,
    category: StreakLossReason
  ) => void;
}

export const StreakRecoveryModal: React.FC<StreakRecoveryModalProps> = ({
  learner,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [targetStreak, setTargetStreak] = useState<number>(
    learner ? Math.max(learner.streak.maxStreak, learner.streak.currentStreak + 1) : 1
  );
  const [ticketId, setTicketId] = useState<string>('TK-2026-');
  const [category, setCategory] = useState<StreakLossReason>('app_crash');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !learner) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!ticketId.trim() || ticketId.trim() === 'TK-2026-') {
      setErrorMsg('Bắt buộc phải nhập Mã Ticket Hỗ Trợ (TK-XXXXX) theo quy chuẩn LiveOps Guardrail §7.3!');
      return;
    }

    if (targetStreak <= learner.streak.currentStreak) {
      setErrorMsg('Chuỗi phục hồi mục tiêu phải lớn hơn chuỗi hiện tại!');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Vui lòng nhập lý do kiểm toán (Audit Reason)!');
      return;
    }

    onConfirm(learner.id, targetStreak, ticketId.trim(), reason.trim(), category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-5 shadow-modal space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
              <RotateCcw size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text">
                Khôi Phục Chuỗi Streak (LiveOps Guardrail)
              </h3>
              <p className="text-[11px] text-text-muted">
                Chuẩn an toàn LiveOps quy định tại docs/design.md §7.3
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-subtle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Learner & Streak Comparison Preview */}
        <div className="bg-surface-subtle p-3 rounded-xl border border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={learner.avatar}
              alt={learner.fullName}
              className="w-10 h-10 rounded-full object-cover border border-border shadow-xs"
            />
            <div>
              <div className="font-bold text-text">{learner.fullName}</div>
              <div className="text-[11px] text-text-muted">{learner.email}</div>
              <div className="text-[10px] font-mono text-text-muted">ID: {learner.id}</div>
            </div>
          </div>

          {/* Before -> After Preview */}
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-border">
            <div className="text-center">
              <span className="text-[10px] text-text-muted block">Hiện tại</span>
              <span className="text-sm font-extrabold text-text flex items-center gap-0.5 justify-center">
                <Flame size={13} className="text-snapy" />
                {learner.streak.currentStreak}
              </span>
            </div>
            <ArrowRight size={14} className="text-text-muted" />
            <div className="text-center">
              <span className="text-[10px] text-primary font-bold block">Sau phục hồi</span>
              <span className="text-sm font-extrabold text-primary flex items-center gap-0.5 justify-center">
                <Flame size={13} />
                {targetStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-danger-light border border-danger/30 text-danger text-xs flex items-center gap-1.5">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Row 1: Target Streak & Ticket ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-text mb-1">
                Chuỗi mục tiêu cần phục hồi (ngày):
              </label>
              <input
                type="number"
                min={learner.streak.currentStreak + 1}
                max={999}
                value={targetStreak}
                onChange={(e) => setTargetStreak(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-bold font-mono focus:outline-none focus:border-primary"
                required
              />
              <span className="text-[10px] text-text-muted mt-0.5 block">
                Kỷ lục trước đây: {learner.streak.maxStreak} ngày
              </span>
            </div>

            <div>
              <label className="block font-bold text-text mb-1">
                Mã Ticket Hỗ Trợ (Bắt buộc):
              </label>
              <input
                type="text"
                placeholder="TK-2026-XXXX"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:outline-none focus:border-primary uppercase"
                required
              />
              <span className="text-[10px] text-snapy font-medium mt-0.5 block">
                * Bắt buộc có mã Ticket để lưu Audit Trail
              </span>
            </div>
          </div>

          {/* Row 2: Category */}
          <div>
            <label className="block font-bold text-text mb-1">
              Phân loại nguyên nhân đứt chuỗi:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StreakLossReason)}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-medium focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="app_crash">Lỗi ứng dụng văng / đóng băng đột ngột</option>
              <option value="server_downtime">Sự cố kết nối máy chủ / Mất điện trung tâm dữ liệu</option>
              <option value="timezone_bug">Lệch múi giờ quốc tế khi di chuyển máy bay</option>
              <option value="hospitalized_goodwill">Lý do sức khỏe / Ngoại lệ đặc biệt (Goodwill)</option>
              <option value="other">Nguyên nhân kỹ thuật khác</option>
            </select>
          </div>

          {/* Row 3: Justification Reason */}
          <div>
            <label className="block font-bold text-text mb-1">
              Căn cứ xác thực & Lý do phê duyệt (Lưu Audit Ledger):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ghi rõ chi tiết xác minh log, ticket đính kèm hoặc kết luận kỹ thuật..."
              rows={3}
              className="w-full p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:border-primary text-xs"
              required
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <ShieldCheck size={12} className="text-primary" />
              Được bảo vệ bởi LiveOps Guardrails
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-surface-subtle cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-snapy hover:bg-snapy-hover text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Flame size={13} />
                <span>Xác nhận phục hồi {targetStreak} ngày</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
