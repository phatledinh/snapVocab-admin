import React from 'react';
import { EconomyTransaction } from '../../../domains/economy/types';
import { INITIAL_SHOP_ITEMS } from '../../../domains/economy/mock-data';
import { X, Receipt, ArrowRight, Smartphone, Shield, Copy, Check } from 'lucide-react';

interface LedgerDetailDrawerProps {
  transaction: EconomyTransaction | null;
  onClose: () => void;
}

export const LedgerDetailDrawer: React.FC<LedgerDetailDrawerProps> = ({
  transaction,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const isFaucet = transaction.type === 'FAUCET_EARN';

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 select-none animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-modal flex flex-col justify-between">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-info-light text-info flex items-center justify-center">
                <Receipt size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text font-mono">
                  {transaction.id}
                </h3>
                <p className="text-[10px] text-text-muted">Chi tiết giao dịch sổ cái ảo</p>
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
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Summary Banner */}
            <div
              className={`p-4 rounded-xl border text-center ${
                isFaucet
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50/70 border-amber-200 text-[#9A7000]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                {isFaucet ? 'Tiền Thưởng Phát Hành (Faucet Earn)' : 'Tiền Thu Hồi Tiêu Thụ (Sink Spend)'}
              </span>
              <div className="text-2xl font-black font-mono my-1">
                {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}{' '}
                {transaction.currency === 'coins' ? 'Coins 🟡' : 'Gems 💎'}
              </div>
              <span className="text-xs font-semibold">
                Nguồn: {transaction.source} · {transaction.status}
              </span>
            </div>

            {/* Learner Info */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-2">
              <div className="text-[11px] font-bold text-text uppercase tracking-wider">
                Người Học (Learner Profile)
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-xl shadow-xs">
                  {transaction.learnerAvatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-text">{transaction.learnerName}</div>
                  <div className="text-[10px] text-text-muted font-mono">{transaction.learnerId}</div>
                </div>
              </div>
            </div>

            {/* Wallet Balance Progression */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-2">
              <div className="text-[11px] font-bold text-text uppercase tracking-wider">
                Biến Động Số Dư Ví (Balance Ledger)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-surface border border-border">
                  <span className="text-[10px] text-text-muted block">Trước GD</span>
                  <strong className="text-text">{transaction.balanceBefore}</strong>
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted">
                  <ArrowRight size={14} />
                </div>
                <div className="p-2 rounded-lg bg-surface border border-border">
                  <span className="text-[10px] text-text-muted block">Sau GD</span>
                  <strong className={isFaucet ? 'text-emerald-600' : 'text-[#9A7000]'}>
                    {transaction.balanceAfter}
                  </strong>
                </div>
              </div>
            </div>

            {/* Technical Metadata */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-2 text-xs">
              <div className="text-[11px] font-bold text-text uppercase tracking-wider mb-1">
                Thông Tin Kỹ Thuật (Telemetry)
              </div>

              {(() => {
                const matchedItem = transaction.itemId
                  ? INITIAL_SHOP_ITEMS.find((i) => i.id === transaction.itemId)
                  : null;
                if (!matchedItem) return null;

                return (
                  <div className="p-2.5 rounded-lg bg-surface border border-border flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        matchedItem.bgColorClass || 'bg-surface-subtle'
                      } flex items-center justify-center p-1 shrink-0 border border-border/70`}
                    >
                      {matchedItem.imageUrl ? (
                        <img
                          src={matchedItem.imageUrl}
                          alt={matchedItem.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-xl">{matchedItem.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-text truncate">
                        {matchedItem.name}
                      </div>
                      <div className="text-[10px] text-text-muted flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{matchedItem.sku}</span>
                        <span>·</span>
                        <span className="capitalize">{matchedItem.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Thời gian:</span>
                <span className="font-mono text-text">{transaction.timestamp}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Mục đích/Vật phẩm:</span>
                <span className="font-semibold text-text truncate max-w-[220px]">
                  {transaction.itemOrQuestName}
                </span>
              </div>
              {transaction.deviceInfo && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Thiết bị:</span>
                  <span className="font-mono text-text">{transaction.deviceInfo}</span>
                </div>
              )}
              {transaction.clientVersion && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Phiên bản Client:</span>
                  <span className="font-mono text-text">{transaction.clientVersion}</span>
                </div>
              )}
              {transaction.note && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 font-medium">
                  <strong>Ghi chú:</strong> {transaction.note}
                </div>
              )}
            </div>

            {/* Raw JSON Payload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <button
                  type="button"
                  onClick={copyJson}
                  className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copied ? 'Đã chép' : 'Sao chép JSON'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-900 text-neutral-200 text-[10px] font-mono overflow-x-auto max-h-40 leading-relaxed border border-neutral-800">
                {JSON.stringify(transaction, null, 2)}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-subtle hover:bg-neutral-200 text-text font-bold text-xs transition-all"
            >
              Đóng Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
