import React, { useState } from 'react';
import { LearnerProfile } from '../../../domains/learners/types';
import {
  X,
  Ban,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AccountBanModalProps {
  learner: LearnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBan: (
    learnerId: string,
    duration: '24h' | '7d' | '30d' | 'permanent',
    reason: string,
    ticketId: string
  ) => void;
  onConfirmUnban: (learnerId: string, reason: string, ticketId: string) => void;
}

export const AccountBanModal: React.FC<AccountBanModalProps> = ({
  learner,
  isOpen,
  onClose,
  onConfirmBan,
  onConfirmUnban,
}) => {
  const [duration, setDuration] = useState<'24h' | '7d' | '30d' | 'permanent'>('7d');
  const [ticketId, setTicketId] = useState<string>('TK-2026-');
  const [reason, setReason] = useState<string>('');

  if (!isOpen || !learner) return null;

  const isBanned = learner.status === 'suspended';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do kiểm toán!');
      return;
    }

    if (isBanned) {
      onConfirmUnban(learner.id, reason.trim(), ticketId.trim());
    } else {
      onConfirmBan(learner.id, duration, reason.trim(), ticketId.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-5 shadow-modal space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isBanned
                  ? 'bg-primary-light text-primary border-primary/20'
                  : 'bg-danger-light text-danger border-danger/20'
              }`}
            >
              {isBanned ? <ShieldCheck size={18} /> : <Ban size={18} />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text">
                {isBanned ? 'Mở Khóa Tài Khoản Học Viên' : 'Khóa Tài Khoản Học Viên'}
              </h3>
              <p className="text-[11px] text-text-muted">
                Chuẩn quản lý người dùng FR-13.01 & SS-17
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

        {/* Learner Info */}
        <div className="p-3 bg-surface-subtle rounded-xl border border-border text-xs flex items-center gap-3">
          <img
            src={learner.avatar}
            alt={learner.fullName}
            className="w-10 h-10 rounded-full object-cover border border-border shadow-xs"
          />
          <div>
            <div className="font-bold text-text">{learner.fullName}</div>
            <div className="text-[11px] text-text-muted">{learner.email}</div>
            <div className="text-[10px] font-mono text-text-muted">
              ID: {learner.id} &bullet; Trạng thái hiện tại: {learner.status}
            </div>
          </div>
        </div>

        {/* Warning Alert if Banning */}
        {!isBanned && (
          <div className="p-2.5 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Khi bị khóa, học viên sẽ bị thu hồi toàn bộ token phiên đăng nhập (JWT revoke) và không thể tham gia thi đấu giải hoặc nhận diện từ vựng.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isBanned && (
            <div>
              <label className="block font-bold text-text mb-1">Thời hạn khóa:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: '24h', label: '24 giờ' },
                  { id: '7d', label: '7 ngày' },
                  { id: '30d', label: '30 ngày' },
                  { id: 'permanent', label: 'Vĩnh viễn' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDuration(t.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                      duration === t.id
                        ? 'bg-danger text-white border-danger shadow-xs'
                        : 'bg-surface border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-text mb-1">
              Mã Ticket Khiếu Nại / Báo Cáo (nếu có):
            </label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="TK-2026-XXXX"
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-mono text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1">
              Lý do thực hiện (Bắt buộc ghi vào Audit Log):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isBanned
                  ? 'Ví dụ: Đã hết thời hạn kỷ luật hoặc học viên khiếu nại thành công...'
                  : 'Ví dụ: Sử dụng macro tự động giải bài flashcard, vi phạm điều khoản...'
              }
              rows={3}
              className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-surface-subtle"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition-all ${
                isBanned
                  ? 'bg-primary hover:bg-primary-hover'
                  : 'bg-danger hover:bg-danger-hover'
              }`}
            >
              {isBanned ? 'Xác nhận mở khóa' : 'Xác nhận khóa tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
