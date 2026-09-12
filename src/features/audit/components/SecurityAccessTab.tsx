import React from 'react';
import { AuditLogEntry } from '../../../domains/audit/types';
import {
  Lock,
  Ban,
  ShieldCheck,
  KeyRound,
  FileSpreadsheet,
  Globe,
  ArrowRight,
  ExternalLink,
  Clock,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface SecurityAccessTabProps {
  logs: AuditLogEntry[];
  onSelectEntry: (entry: AuditLogEntry) => void;
  onNavigateToLearner?: (learnerId: string) => void;
}

export const SecurityAccessTab: React.FC<SecurityAccessTabProps> = ({
  logs,
  onSelectEntry,
  onNavigateToLearner,
}) => {
  const securityLogs = logs.filter(
    (l) =>
      l.domain === 'SYSTEM_SECURITY' ||
      l.action === 'ACCOUNT_BANNED' ||
      l.action === 'ACCOUNT_UNBANNED' ||
      l.action === 'PASSWORD_RESET'
  );

  return (
    <div className="space-y-3 select-none">
      {/* Top Banner */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-danger-light border border-danger/20 text-danger flex items-center justify-center text-lg shadow-xs">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-text tracking-tight">
                Sổ Cái An Ninh, Phân Quyền & Kỷ Luật Tài Khoản
              </h2>
              <span className="px-2 py-0.2 rounded-full bg-danger-light text-danger text-[10px] font-bold border border-danger/20">
                Security & Access
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Ghi nhận toàn bộ thao tác can thiệp tài khoản (Khóa/Mở Ban, Reset mật khẩu), đăng nhập Admin, nâng quyền và các tác vụ trích xuất dữ liệu lớn (CSV Export).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-center">
            <div className="text-[10px] text-text-muted font-bold uppercase">Tài Khoản Đang Khóa</div>
            <div className="text-sm font-extrabold text-danger font-mono">1 tài khoản</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-center">
            <div className="text-[10px] text-text-muted font-bold uppercase">Mã Hóa Dấu Vết</div>
            <div className="text-sm font-extrabold text-primary font-mono">100% Watermark</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3 w-40">Thời Gian & Ticket</th>
                <th className="p-3 w-44">Sự Kiện An Ninh</th>
                <th className="p-3 min-w-[190px]">Đối Tượng Ảnh Hưởng</th>
                <th className="p-3 min-w-[200px]">Thay Đổi Quyền / Trạng Thái</th>
                <th className="p-3 min-w-[240px]">Lý Do & Căn Cứ An Ninh</th>
                <th className="p-3 w-44">Người Thao Tác & IP</th>
                <th className="p-3 w-16 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {securityLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-text-muted">
                    <Clock size={28} className="mx-auto mb-2 opacity-30 text-text-muted" />
                    <p className="font-semibold text-sm">Không có dữ liệu an ninh & tài khoản</p>
                  </td>
                </tr>
              ) : (
                securityLogs.map((entry) => {
                  const isBan = entry.action === 'ACCOUNT_BANNED';
                  const isExport = entry.action === 'BULK_DATA_EXPORT';
                  const isRole = entry.action === 'ROLE_ELEVATED';

                  return (
                    <tr
                      key={entry.id}
                      onClick={() => onSelectEntry(entry)}
                      className={`hover:bg-surface-subtle/50 transition-colors cursor-pointer group ${
                        isBan ? 'bg-danger-light/10' : ''
                      }`}
                    >
                      {/* Timestamp & Ticket */}
                      <td className="p-3 align-top">
                        <div className="font-mono text-xs text-text font-bold">
                          {new Date(entry.timestamp).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-[10px] text-text-muted font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString('vi-VN')}
                        </div>
                        {entry.ticketId && (
                          <div className="mt-1">
                            <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-[10px] font-mono font-bold text-danger">
                              {entry.ticketId}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Event badge */}
                      <td className="p-3 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isBan
                              ? 'bg-danger-light text-danger border-danger/30'
                              : isExport
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : isRole
                              ? 'bg-primary-light text-primary border-primary/30'
                              : 'bg-surface-subtle text-text-muted border-border'
                          }`}
                        >
                          {isBan ? (
                            <Ban size={11} />
                          ) : isExport ? (
                            <FileSpreadsheet size={11} />
                          ) : (
                            <Lock size={11} />
                          )}
                          <span>{entry.actionLabel}</span>
                        </span>
                      </td>

                      {/* Target */}
                      <td className="p-3 align-top">
                        <div className="font-bold text-text text-xs flex items-center gap-1.5">
                          <span>{entry.targetEntity.title}</span>
                          {entry.targetEntity.type === 'LEARNER' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToLearner?.(entry.targetEntity.id);
                              }}
                              className="text-text-muted hover:text-primary p-0.5"
                              title="Xem hồ sơ Learner 360"
                            >
                              <ExternalLink size={11} />
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5 font-mono">
                          {entry.targetEntity.id}
                        </div>
                      </td>

                      {/* Diff */}
                      <td className="p-3 align-top">
                        {entry.diff ? (
                          <div className="bg-surface-subtle/70 p-1.5 rounded-lg border border-border/60 text-[11px] space-y-0.5">
                            {Object.keys(entry.diff.after || {}).map((key) => {
                              const bVal = (entry.diff?.before as any)?.[key];
                              const aVal = (entry.diff?.after as any)?.[key];
                              return (
                                <div key={key} className="flex items-center gap-1 truncate text-[10px]">
                                  <span className="font-mono text-text-muted">{key}:</span>
                                  {bVal !== undefined && (
                                    <>
                                      <span className="line-through text-text-muted">{String(bVal)}</span>
                                      <ArrowRight size={10} className="text-text-muted shrink-0" />
                                    </>
                                  )}
                                  <span className="font-bold text-danger">{String(aVal)}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10px] text-text-muted italic">—</span>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="p-3 align-top">
                        <div className="bg-surface-subtle/50 p-2 rounded-lg border border-border/50 text-[11px] text-text leading-relaxed italic line-clamp-3">
                          "{entry.reason}"
                        </div>
                      </td>

                      {/* Operator & IP */}
                      <td className="p-3 align-top">
                        <div className="font-bold text-text text-[11px]">
                          {entry.operator.name}
                        </div>
                        <div className="text-[10px] font-mono text-text-muted flex items-center gap-1 mt-0.5">
                          <Globe size={10} className="text-text-muted/60" />
                          <span>{entry.operator.ipAddress}</span>
                        </div>
                        <div className="text-[9px] font-mono text-text-muted/70 uppercase">
                          {entry.operator.role}
                        </div>
                      </td>

                      {/* CTA */}
                      <td className="p-3 align-top text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntry(entry);
                          }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-surface hover:bg-primary-light hover:text-primary transition-all text-text-muted"
                        >
                          <Eye size={13} />
                        </button>
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
