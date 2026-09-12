import React from 'react';
import {
  AuditLogEntry,
  AuditDomainCategory,
  AuditSeverity,
} from '../../../domains/audit/types';
import {
  Eye,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  ExternalLink,
  BookOpen,
  User,
  Camera,
  ShoppingBag,
  Ticket,
  Server,
  AlertOctagon,
} from 'lucide-react';

interface MasterAuditStreamTabProps {
  logs: AuditLogEntry[];
  onSelectEntry: (entry: AuditLogEntry) => void;
  onNavigateEntity?: (navDeepLink?: string, entityTitle?: string) => void;
}

export const MasterAuditStreamTab: React.FC<MasterAuditStreamTabProps> = ({
  logs,
  onSelectEntry,
  onNavigateEntity,
}) => {
  const getDomainBadge = (domain: AuditDomainCategory) => {
    switch (domain) {
      case 'CONTENT_STUDIO':
        return {
          label: 'Content Studio',
          className: 'bg-primary-light text-primary border-primary/20',
          icon: <BookOpen size={11} />,
        };
      case 'AI_SCAN':
        return {
          label: 'AI Scan Engine',
          className: 'bg-snapy-light text-snapy border-snapy/20',
          icon: <Camera size={11} />,
        };
      case 'LIVEOPS_ECONOMY':
        return {
          label: 'LiveOps & Kinh Tế',
          className: 'bg-reward-light text-[#9A7000] border-reward/20',
          icon: <ShoppingBag size={11} />,
        };
      case 'LEARNERS_PEOPLE':
        return {
          label: 'Học Viên & Người Dùng',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <User size={11} />,
        };
      case 'ISSUE_REPORTS':
        return {
          label: 'Báo Cáo Sự Cố',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Ticket size={11} />,
        };
      case 'SYSTEM_SECURITY':
        return {
          label: 'Bảo Mật & Hạ Tầng',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Server size={11} />,
        };
    }
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-danger-light text-danger border-danger/30 font-bold';
      case 'SECURITY':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'WARNING':
        return 'bg-snapy-light text-snapy border-snapy/30 font-semibold';
      case 'NOTICE':
        return 'bg-primary-light text-primary border-primary/30 font-medium';
      case 'INFO':
      default:
        return 'bg-surface-subtle text-text-muted border-border font-medium';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <th className="p-3 w-40">Thời Gian & Ticket</th>
              <th className="p-3 w-36">Phân Hệ & Mức Độ</th>
              <th className="p-3 min-w-[200px]">Hành Động & Đối Tượng</th>
              <th className="p-3 min-w-[190px]">Biến Động (Trước ➔ Sau)</th>
              <th className="p-3 min-w-[240px]">Lý Do & Căn Cứ Giải Trình</th>
              <th className="p-3 w-36">Người Thao Tác</th>
              <th className="p-3 w-20 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-text-muted">
                  <Clock size={32} className="mx-auto mb-2 opacity-30 text-text-muted" />
                  <p className="font-semibold text-sm">Không tìm thấy bản ghi kiểm toán phù hợp bộ lọc</p>
                  <p className="text-xs text-text-muted/70 mt-1">
                    Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc bỏ chọn các điều kiện lọc.
                  </p>
                </td>
              </tr>
            ) : (
              logs.map((entry) => {
                const domainBadge = getDomainBadge(entry.domain);
                const severityClass = getSeverityBadge(entry.severity);

                return (
                  <tr
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="hover:bg-surface-subtle/50 transition-colors cursor-pointer group"
                  >
                    {/* Cột 1: Thời gian & Ticket */}
                    <td className="p-3 align-top">
                      <div className="font-mono text-xs text-text font-bold">
                        {new Date(entry.timestamp).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString('vi-VN')}
                      </div>
                      {entry.ticketId ? (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-primary-light/60 border border-primary/20 text-[10px] font-mono font-bold text-primary">
                            <Ticket size={9} />
                            <span>{entry.ticketId}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <span className="text-[9px] font-mono text-text-muted/60">
                            #{entry.metadata.blockHeight || entry.id.slice(-4)}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Cột 2: Phân hệ & Mức độ */}
                    <td className="p-3 align-top space-y-1.5">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${domainBadge.className}`}
                        >
                          {domainBadge.icon}
                          <span>{domainBadge.label}</span>
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] uppercase border ${severityClass}`}
                        >
                          {entry.severity}
                        </span>
                      </div>
                    </td>

                    {/* Cột 3: Hành động & Đối tượng */}
                    <td className="p-3 align-top">
                      <div className="font-extrabold text-text text-xs leading-snug group-hover:text-primary transition-colors">
                        {entry.actionLabel}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold uppercase px-1 py-0.2 rounded bg-surface-subtle border border-border text-text-muted">
                          {entry.targetEntity.type}
                        </span>
                        <span className="text-[11px] font-medium text-text font-mono truncate max-w-[180px]">
                          {entry.targetEntity.title}
                        </span>
                        {entry.targetEntity.navDeepLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateEntity?.(
                                entry.targetEntity.navDeepLink,
                                entry.targetEntity.title
                              );
                            }}
                            title="Chuyển đến màn hình nghiệp vụ"
                            className="text-text-muted hover:text-primary p-0.5"
                          >
                            <ExternalLink size={11} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Cột 4: Biến động (Trước ➔ Sau) */}
                    <td className="p-3 align-top">
                      {entry.diff ? (
                        <div className="bg-surface-subtle/70 p-1.5 rounded-lg border border-border/60 text-[11px] space-y-0.5">
                          {Object.keys(entry.diff.after || {}).slice(0, 2).map((key) => {
                            const beforeVal = (entry.diff?.before as any)?.[key];
                            const afterVal = (entry.diff?.after as any)?.[key];
                            return (
                              <div key={key} className="flex items-center gap-1 truncate">
                                <span className="text-[10px] font-mono text-text-muted">
                                  {key}:
                                </span>
                                {beforeVal !== undefined && (
                                  <>
                                    <span className="line-through text-text-muted/80 text-[10px]">
                                      {String(beforeVal)}
                                    </span>
                                    <ArrowRight size={10} className="text-text-muted shrink-0" />
                                  </>
                                )}
                                <span className="font-bold text-primary text-[10px]">
                                  {String(afterVal)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[10px] text-text-muted italic">
                          Không có biến động trạng thái
                        </span>
                      )}
                    </td>

                    {/* Cột 5: Lý do kiểm toán */}
                    <td className="p-3 align-top">
                      <div className="bg-surface-subtle/50 p-2 rounded-lg border border-border/50 text-[11px] text-text leading-relaxed italic line-clamp-3">
                        "{entry.reason}"
                      </div>
                      {entry.metadata.guardrailRule && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-danger font-mono font-bold">
                          <AlertOctagon size={10} />
                          <span>Guardrail: {entry.metadata.guardrailRule}</span>
                        </div>
                      )}
                    </td>

                    {/* Cột 6: Người thao tác */}
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-2">
                        <img
                          src={entry.operator.avatar}
                          alt={entry.operator.name}
                          className="w-6 h-6 rounded-full object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-text text-[11px] truncate">
                            {entry.operator.name}
                          </div>
                          <div className="text-[9px] font-mono text-text-muted uppercase">
                            {entry.operator.role}
                          </div>
                          <div className="text-[9px] font-mono text-text-muted/70 truncate">
                            {entry.operator.ipAddress}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 7: Nút xem chi tiết */}
                    <td className="p-3 align-top text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEntry(entry);
                        }}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-surface hover:bg-primary-light hover:text-primary hover:border-primary/30 transition-all text-text-muted"
                        title="Soi chi tiết bản ghi (Audit Inspector)"
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
  );
};
