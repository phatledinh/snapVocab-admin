import React, { useState } from 'react';
import { LearnerProfile } from '../../../domains/learners/types';
import {
  X,
  Sparkles,
  Camera,
  Coins,
} from 'lucide-react';

interface LiveOpsGrantModalProps {
  learner: LearnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmGrant: (
    learnerId: string,
    grantType: 'extra_scans' | 'currency_compensation',
    amount: number,
    currencyType: 'coins' | 'gems',
    reason: string,
    ticketId: string
  ) => void;
}

export const LiveOpsGrantModal: React.FC<LiveOpsGrantModalProps> = ({
  learner,
  isOpen,
  onClose,
  onConfirmGrant,
}) => {
  const [grantType, setGrantType] = useState<'extra_scans' | 'currency_compensation'>('extra_scans');
  const [extraScans, setExtraScans] = useState<number>(5);
  const [currencyType, setCurrencyType] = useState<'coins' | 'gems'>('coins');
  const [currencyAmount, setCurrencyAmount] = useState<number>(200);
  const [ticketId, setTicketId] = useState<string>('TK-2026-');
  const [reason, setReason] = useState<string>('');

  if (!isOpen || !learner) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do kiểm toán!');
      return;
    }

    // LiveOps Guardrail cap validation (design.md §7.3)
    if (grantType === 'currency_compensation') {
      if (currencyType === 'coins' && currencyAmount > 1000) {
        alert('Cảnh báo Guardrail: Không được cấp vượt quá 1,000 Coins trong 1 lần hỗ trợ!');
        return;
      }
      if (currencyType === 'gems' && currencyAmount > 100) {
        alert('Cảnh báo Guardrail: Không được cấp vượt quá 100 Gems trong 1 lần hỗ trợ!');
        return;
      }
    }

    const amount = grantType === 'extra_scans' ? extraScans : currencyAmount;
    onConfirmGrant(learner.id, grantType, amount, currencyType, reason.trim(), ticketId.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-5 shadow-modal space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text">
                Cấp Quota AI Scan & Bồi Thường LiveOps
              </h3>
              <p className="text-[11px] text-text-muted">
                Hàng rào an toàn LiveOps Guardrail (design.md §7.3)
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
              Quota hôm nay: {learner.economy.scansUsedToday}/{learner.economy.dailyScanQuota} • Coins: {learner.economy.coins} • Gems: {learner.economy.gems}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Grant Type Tabs */}
          <div>
            <label className="block font-bold text-text mb-1">Loại hỗ trợ cấp phát:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGrantType('extra_scans')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  grantType === 'extra_scans'
                    ? 'border-snapy bg-snapy-light/50 text-snapy font-bold shadow-xs'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Camera size={14} />
                  <span>Tăng Quota Scan</span>
                </div>
                <div className="text-[10px] font-normal text-text-muted">
                  Thêm lượt chụp AI Camera hôm nay
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGrantType('currency_compensation')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  grantType === 'currency_compensation'
                    ? 'border-reward bg-reward-light/50 text-reward-hover font-bold shadow-xs'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Coins size={14} />
                  <span>Bồi Thường Tiền Tệ</span>
                </div>
                <div className="text-[10px] font-normal text-text-muted">
                  Cấp bù Coins hoặc Gems sự cố
                </div>
              </button>
            </div>
          </div>

          {/* Amount selector for scans */}
          {grantType === 'extra_scans' ? (
            <div>
              <label className="block font-bold text-text mb-1">Số lượt scan tặng thêm hôm nay:</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setExtraScans(num)}
                    className={`py-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                      extraScans === num
                        ? 'bg-snapy text-white border-snapy shadow-xs'
                        : 'bg-surface border-border text-text-muted hover:text-text'
                    }`}
                  >
                    +{num} lượt
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block font-bold text-text mb-1">Loại tiền tệ:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrencyType('coins')}
                    className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all ${
                      currencyType === 'coins'
                        ? 'bg-reward text-white border-reward'
                        : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    🪙 Coins Vàng (Max 1,000)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyType('gems')}
                    className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all ${
                      currencyType === 'gems'
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    💎 Gems Tím (Max 100)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Số lượng cấp bù:</label>
                <input
                  type="number"
                  min={1}
                  max={currencyType === 'coins' ? 1000 : 100}
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-mono font-bold text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Ticket ID */}
          <div>
            <label className="block font-bold text-text mb-1">Mã Ticket Hỗ Trợ:</label>
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
              placeholder="Ví dụ: Bồi thường sự cố gián đoạn AI camera scan sáng ngày 11/09..."
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
              className="px-4 py-1.5 rounded-lg bg-snapy hover:bg-snapy-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Xác Nhận Cấp Phát
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
