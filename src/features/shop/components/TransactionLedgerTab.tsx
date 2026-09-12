import React, { useState, useMemo } from 'react';
import {
  EconomyTransaction,
  TransactionFlowType,
  ShopCurrency,
  TransactionSource,
} from '../../../domains/economy/types';
import { INITIAL_SHOP_ITEMS } from '../../../domains/economy/mock-data';
import { LedgerDetailDrawer } from './LedgerDetailDrawer';
import {
  Receipt,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface TransactionLedgerTabProps {
  transactions: EconomyTransaction[];
}

export const TransactionLedgerTab: React.FC<TransactionLedgerTabProps> = ({
  transactions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [flowFilter, setFlowFilter] = useState<'ALL' | TransactionFlowType>('ALL');
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | ShopCurrency>('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | TransactionSource>('ALL');
  const [selectedTx, setSelectedTx] = useState<EconomyTransaction | null>(null);

  // Filtered transactions
  const filteredTx = useMemo(() => {
    return transactions.filter((tx) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tx.learnerName.toLowerCase().includes(q);
        const matchesId = tx.learnerId.toLowerCase().includes(q);
        const matchesTxId = tx.id.toLowerCase().includes(q);
        const matchesItem = tx.itemOrQuestName.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesTxId && !matchesItem) {
          return false;
        }
      }

      if (flowFilter !== 'ALL' && tx.type !== flowFilter) {
        return false;
      }

      if (currencyFilter !== 'ALL' && tx.currency !== currencyFilter) {
        return false;
      }

      if (sourceFilter !== 'ALL' && tx.source !== sourceFilter) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, flowFilter, currencyFilter, sourceFilter]);

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'Transaction ID,Timestamp,Learner ID,Learner Name,Flow Type,Currency,Amount,Source,Item or Reason,Balance Before,Balance After,Status\n';
    filteredTx.forEach((tx) => {
      csv += `"${tx.id}","${tx.timestamp}","${tx.learnerId}","${tx.learnerName}","${tx.type}","${tx.currency}",${tx.amount},"${tx.source}","${tx.itemOrQuestName}",${tx.balanceBefore},${tx.balanceAfter},"${tx.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `snapvocab_economy_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Filter Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo ID, người học, tên vật phẩm..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface-subtle focus:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-text font-medium"
              />
            </div>

            {/* Flow Filter */}
            <select
              value={flowFilter}
              onChange={(e) => setFlowFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Mọi luồng tiền</option>
              <option value="FAUCET_EARN">Bơm Thưởng (Faucet +)</option>
              <option value="SINK_SPEND">Hút Tiêu Thụ (Sink -)</option>
            </select>

            {/* Currency Filter */}
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Mọi tiền tệ</option>
              <option value="coins">Coins 🟡</option>
              <option value="gems">Gems 💎</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Mọi nguồn phát sinh</option>
              <option value="SHOP_PURCHASE">Mua sắm Shop</option>
              <option value="MISSION_REWARD">Thưởng nhiệm vụ</option>
              <option value="STREAK_BONUS">Thưởng chuỗi Streak</option>
              <option value="CHEST_REWARD">Rương phần thưởng</option>
              <option value="ADMIN_ADJUSTMENT">Admin can thiệp</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-neutral-200 border border-border text-text font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Download size={14} />
            <span>Xuất CSV Sổ Cái</span>
          </button>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs text-text border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">Thời Gian & Mã GD</th>
                <th className="py-2.5 px-3">Người Học</th>
                <th className="py-2.5 px-3">Loại Luồng</th>
                <th className="py-2.5 px-3 text-right">Biến Động</th>
                <th className="py-2.5 px-3">Nội Dung / Vật Phẩm</th>
                <th className="py-2.5 px-3 text-right">Số Dư Sau</th>
                <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                <th className="py-2.5 px-3 text-center">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-xs">
                    Không có giao dịch nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => {
                  const isFaucet = tx.type === 'FAUCET_EARN';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-surface-subtle/70 transition-all cursor-pointer"
                    >
                      {/* ID & Timestamp */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono text-[11px] font-bold text-text">{tx.id}</div>
                        <div className="text-[10px] text-text-muted font-mono">{tx.timestamp}</div>
                      </td>

                      {/* Learner */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{tx.learnerAvatar}</span>
                          <div>
                            <div className="font-bold text-text truncate max-w-[130px]">
                              {tx.learnerName}
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">{tx.learnerId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Flow Type */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFaucet
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-[#9A7000] border border-amber-200'
                          }`}
                        >
                          {isFaucet ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                          <span>{isFaucet ? 'Faucet +' : 'Sink -'}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isFaucet ? 'text-emerald-600' : 'text-[#9A7000]'
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </span>
                        <span className="text-[10px] ml-1">
                          {tx.currency === 'coins' ? '🟡' : '💎'}
                        </span>
                      </td>

                      {/* Item or Quest */}
                      <td className="py-2.5 px-3">
                        {(() => {
                          const matchedItem = tx.itemId
                            ? INITIAL_SHOP_ITEMS.find((i) => i.id === tx.itemId)
                            : null;
                          return (
                            <div className="flex items-center gap-2">
                              {matchedItem?.imageUrl ? (
                                <div
                                  className={`w-7 h-7 rounded-md ${
                                    matchedItem.bgColorClass || 'bg-surface-subtle'
                                  } flex items-center justify-center p-0.5 shrink-0 border border-border/80`}
                                >
                                  <img
                                    src={matchedItem.imageUrl}
                                    alt={matchedItem.name}
                                    className="w-5 h-5 object-contain"
                                  />
                                </div>
                              ) : null}
                              <div className="min-w-0">
                                <div
                                  className="font-semibold text-text truncate max-w-[200px]"
                                  title={tx.itemOrQuestName}
                                >
                                  {tx.itemOrQuestName}
                                </div>
                                <div className="text-[10px] text-text-muted font-mono">
                                  {tx.source}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Balance After */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-text">
                        {tx.balanceAfter.toLocaleString('vi-VN')}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : tx.status === 'FLAGGED'
                              ? 'bg-danger-light text-danger animate-pulse'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      {/* Detail CTA */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="p-1 rounded-md hover:bg-neutral-200 text-text-muted hover:text-text transition-all"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
          <span>
            Hiển thị <strong>{filteredTx.length}</strong> / {transactions.length} giao dịch gần nhất
          </span>
          <span className="font-mono text-[11px]">
            Sổ cái hỗ trợ kiểm toán chống lạm phát và phát hiện bất thường thời gian thực
          </span>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      <LedgerDetailDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
