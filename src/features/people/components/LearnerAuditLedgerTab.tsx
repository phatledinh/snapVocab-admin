import React, { useState } from 'react';
import {
  LearnerAuditLogEntry,
  LearnerAuditAction,
} from '../../../domains/learners/types';
import {
  ShieldCheck,
  Search,
  Flame,
  Ban,
  KeyRound,
  Sparkles,
  Coins,
  Clock,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface LearnerAuditLedgerTabProps {
  auditLogs: LearnerAuditLogEntry[];
}

export const LearnerAuditLedgerTab: React.FC<LearnerAuditLedgerTabProps> = ({
  auditLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<'ALL' | LearnerAuditAction>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'ALL' && log.action !== selectedAction) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = log.learnerName.toLowerCase().includes(q);
      const matchId = log.learnerId.toLowerCase().includes(q);
      const matchTicket = log.ticketId?.toLowerCase().includes(q) || false;
      const matchOperator = log.operatorName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTicket && !matchOperator) {
        return false;
      }
    }
    return true;
  });

  const getActionBadge = (action: LearnerAuditAction) => {
    switch (action) {
      case 'STREAK_RECOVERED':
        return {
          label: 'Phục hồi Streak',
          class: 'bg-snapy-light text-snapy border-snapy/30',
          icon: <Flame size={12} />,
        };
      case 'ACCOUNT_BANNED':
        return {
          label: 'Khóa tài khoản',
          class: 'bg-danger-light text-danger border-danger/30',
          icon: <Ban size={12} />,
        };
      case 'ACCOUNT_UNBANNED':
        return {
          label: 'Mở khóa tài khoản',
          class: 'bg-primary-light text-primary border-primary/30',
          icon: <ShieldCheck size={12} />,
        };
      case 'PASSWORD_RESET':
        return {
          label: 'Reset mật khẩu',
          class: 'bg-info-light text-info border-info/30',
          icon: <KeyRound size={12} />,
        };
      case 'QUOTA_ADJUSTED':
        return {
          label: 'Điều chỉnh Quota',
          class: 'bg-primary-light text-primary border-primary/30',
          icon: <Sparkles size={12} />,
        };
      case 'CURRENCY_COMPENSATED':
        return {
          label: 'Cấp bù tiền tệ',
          class: 'bg-reward-light text-reward-hover border-reward/30',
          icon: <Coins size={12} />,
        };
      default:
        return {
          label: action,
          class: 'bg-surface-subtle text-text-muted border-border',
          icon: <FileText size={12} />,
        };
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Header Info */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-text tracking-tight flex items-center gap-2">
              <span>Sổ Cái Kiểm Toán Vận Hành Người Học (Immutable Audit Ledger)</span>
              <span className="px-2 py-0.2 rounded-full bg-primary-light text-primary text-[10px] font-bold border border-primary/20">
                Audit Trail
              </span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Lưu vết toàn bộ thao tác can thiệp tài khoản của Operator kèm mã Ticket ID và căn cứ giải trình.
            </p>
          </div>
        </div>

        {/* Filter Action Selector */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Ticket ID, Học viên, Operator..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) =>
              setSelectedAction(e.target.value as 'ALL' | LearnerAuditAction)
            }
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="STREAK_RECOVERED">Phục hồi Streak</option>
            <option value="ACCOUNT_BANNED">Khóa tài khoản</option>
            <option value="ACCOUNT_UNBANNED">Mở khóa</option>
            <option value="PASSWORD_RESET">Reset mật khẩu</option>
            <option value="QUOTA_ADJUSTED">Điều chỉnh Quota</option>
            <option value="CURRENCY_COMPENSATED">Cấp bù Tiền tệ</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3 w-40">Thời Gian & Ticket</th>
                <th className="p-3 w-40">Hành Động Can Thiệp</th>
                <th className="p-3 min-w-[180px]">Học Viên Ảnh Hưởng</th>
                <th className="p-3 min-w-[200px]">Thay Đổi (Trước ➔ Sau)</th>
                <th className="p-3 min-w-[220px]">Lý Do & Ghi Chú Kiểm Toán</th>
                <th className="p-3 w-36 text-right">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">
                    <Clock size={28} className="mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">Không có dữ liệu nhật ký kiểm toán phù hợp</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-surface-subtle/40 transition-colors">
                      {/* Timestamp & Ticket ID */}
                      <td className="p-3">
                        <div className="font-mono text-xs text-text font-bold">
                          {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-[10px] text-text-muted font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                        </div>
                        {log.ticketId && (
                          <div className="mt-1">
                            <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-[10px] font-mono font-bold text-primary">
                              {log.ticketId}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Action Badge */}
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.class}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Learner Info */}
                      <td className="p-3">
                        <div className="font-bold text-text">{log.learnerName}</div>
                        <div className="text-[10px] font-mono text-text-muted">
                          ID: {log.learnerId}
                        </div>
                      </td>

                      {/* Before -> After */}
                      <td className="p-3">
                        <div className="text-[11px] font-medium text-text-muted flex items-center gap-1.5 flex-wrap">
                          <span className="line-through opacity-75">{log.previousValue}</span>
                          <ArrowRight size={12} className="text-text-muted shrink-0" />
                          <span className="font-bold text-text text-primary">
                            {log.newValue}
                          </span>
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          {log.details}
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="p-3">
                        <p className="text-[11px] text-text leading-relaxed italic bg-surface-subtle/60 p-2 rounded border border-border/40">
                          "{log.reason}"
                        </p>
                      </td>

                      {/* Operator */}
                      <td className="p-3 text-right">
                        <span className="font-semibold text-text text-[11px] block">
                          {log.operatorName}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono uppercase bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                          ROLE_ADMIN
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
