import React, { useState } from 'react';
import { LearnerProfile } from '../../../domains/learners/types';
import {
  X,
  KeyRound,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

interface ResetPasswordModalProps {
  learner: LearnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    learnerId: string,
    resetType: 'email_link' | 'temp_password',
    tempPassword: string,
    reason: string,
    ticketId: string
  ) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  learner,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [resetType, setResetType] = useState<'email_link' | 'temp_password'>('email_link');
  const [tempPassword, setTempPassword] = useState<string>('Snap2026@Temp#');
  const [ticketId, setTicketId] = useState<string>('TK-2026-');
  const [reason, setReason] = useState<string>('Học viên yêu cầu hỗ trợ quên mật khẩu qua ticket');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen || !learner) return null;

  const handleGenerateNewPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = 'Snap!';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(result);
    setIsCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do kiểm toán!');
      return;
    }

    onConfirm(learner.id, resetType, tempPassword, reason.trim(), ticketId.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-5 shadow-modal space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text">
                Đặt Lại Mật Khẩu (Reset Password)
              </h3>
              <p className="text-[11px] text-text-muted">
                Quy chuẩn bảo mật Identity SS-03 & Admin FR-13.01
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
            <div className="text-[11px] text-text-muted font-mono">{learner.email}</div>
            <div className="text-[10px] font-mono text-text-muted mt-0.5">
              ID: {learner.id}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Reset Method */}
          <div>
            <label className="block font-bold text-text mb-1.5">Hình thức đặt lại:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResetType('email_link')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  resetType === 'email_link'
                    ? 'border-primary bg-primary-light/40 text-primary font-bold shadow-xs'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Mail size={14} />
                  <span>Gửi link qua Email</span>
                </div>
                <div className="text-[10px] font-normal text-text-muted">
                  Gửi liên kết OTP bảo mật vào email đã đăng ký
                </div>
              </button>

              <button
                type="button"
                onClick={() => setResetType('temp_password')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  resetType === 'temp_password'
                    ? 'border-primary bg-primary-light/40 text-primary font-bold shadow-xs'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <KeyRound size={14} />
                  <span>Cấp mật khẩu tạm</span>
                </div>
                <div className="text-[10px] font-normal text-text-muted">
                  Tạo mật khẩu dùng 1 lần, đổi ở lần đăng nhập tới
                </div>
              </button>
            </div>
          </div>

          {/* Temp Password Generator box */}
          {resetType === 'temp_password' && (
            <div className="p-3 bg-surface-subtle rounded-xl border border-border space-y-2">
              <label className="block font-bold text-text">Mật khẩu tạm thời:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={tempPassword}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface font-mono font-bold text-text text-xs tracking-wider"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text flex items-center gap-1 font-semibold"
                >
                  {isCopied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                  <span>{isCopied ? 'Đã chép' : 'Chép'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateNewPassword}
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-subtle text-text font-semibold"
                >
                  Đổi mã
                </button>
              </div>
              <span className="text-[10px] text-info block">
                * Học viên sẽ bị bắt buộc đổi mật khẩu mới ngay khi đăng nhập.
              </span>
            </div>
          )}

          {/* Ticket ID */}
          <div>
            <label className="block font-bold text-text mb-1">Mã Ticket Hỗ Trợ (nếu có):</label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="TK-2026-XXXX"
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-mono text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-text mb-1">
              Lý do thực hiện (Lưu Audit Log):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Footer */}
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
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {resetType === 'email_link' ? 'Gửi Email Khôi Phục' : 'Xác Nhận Cấp Mật Khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
