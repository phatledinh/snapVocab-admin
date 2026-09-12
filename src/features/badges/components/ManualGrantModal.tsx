import React, { useState } from 'react';
import { Badge, LearnerBadgeRecord } from '../../../domains/badges/types';
import { X, Check, ShieldCheck, Award } from 'lucide-react';

interface ManualGrantModalProps {
  isOpen: boolean;
  badges: Badge[];
  onClose: () => void;
  onGrant: (record: LearnerBadgeRecord, reason: string) => void;
}

export const ManualGrantModal: React.FC<ManualGrantModalProps> = ({
  isOpen,
  badges,
  onClose,
  onGrant,
}) => {
  const [learnerName, setLearnerName] = useState('Nguyễn Văn Hoà');
  const [learnerEmail, setLearnerEmail] = useState('hoa.nguyen@example.com');
  const [selectedBadgeId, setSelectedBadgeId] = useState(badges[0]?.id || '');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerName.trim()) {
      setError('Tên học viên không được để trống.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 8) {
      setError('Lý do cấp phát bắt buộc nhập tối thiểu 8 ký tự.');
      return;
    }

    const badge = badges.find((b) => b.id === selectedBadgeId) || badges[0];
    const newRecord: LearnerBadgeRecord = {
      id: `rec-${Date.now()}`,
      learnerId: `lrn-${Math.floor(10000 + Math.random() * 90000)}`,
      learnerName: learnerName.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
      email: learnerEmail.trim(),
      badgeId: badge.id,
      badgeCode: badge.code,
      badgeName: badge.name,
      badgeTier: badge.tier,
      badgeIcon: badge.icon,
      earnedAt: 'Vừa xong (Thủ công)',
      idempotencyKey: `MANUAL-GRANT-${badge.code}-${Date.now()}`,
      isEquippedFeatured: false,
      status: 'valid',
    };

    onGrant(newRecord, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">Cấp Phát Huy Hiệu Thủ Công</h3>
              <p className="text-[11px] text-text-muted">
                Trao thưởng sự kiện ngoại lệ / Bù lỗi kỹ thuật cho học viên
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Học Viên Tiếp Nhận: <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              placeholder="VD: Nguyễn Văn Hoà"
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Email Học Viên:
            </label>
            <input
              type="email"
              value={learnerEmail}
              onChange={(e) => setLearnerEmail(e.target.value)}
              placeholder="VD: hoa.nguyen@example.com"
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Huy Hiệu Cần Cấp Phát: <span className="text-danger">*</span>
            </label>
            <select
              value={selectedBadgeId}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-semibold"
            >
              {badges
                .filter((b) => b.status !== 'archived')
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.icon} {b.name} ({b.code} - Hạng {b.tier})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Lý Do Cấp Phát & Mã Ticket (Audit Reason): <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="VD: Trao giải quán quân cuộc thi từ vựng Offline / Đã xác nhận qua ticket CSKH #TKT-8120..."
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {error && <p className="text-[11px] text-danger font-medium mt-0.5">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-muted hover:text-text transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check size={14} />
              <span>Xác Nhận Cấp Phát</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
