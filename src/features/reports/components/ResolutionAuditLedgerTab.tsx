import React, { useState } from 'react';
import { IssueReportItem } from '../../../domains/issue-reports/types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Coins,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ResolutionAuditLedgerTabProps {
  issues: IssueReportItem[];
  onSelectIssue: (issue: IssueReportItem) => void;
  onExportCsv: () => void;
}

export const ResolutionAuditLedgerTab: React.FC<ResolutionAuditLedgerTabProps> = ({
  issues,
  onSelectIssue,
  onExportCsv,
}) => {
  const resolvedIssues = issues.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'DISMISSED'
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = resolvedIssues.filter((issue) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTicket = issue.ticketId.toLowerCase().includes(q);
      const matchOperator = issue.resolution?.resolvedBy
        .toLowerCase()
        .includes(q);
      const matchLearner = issue.learner.fullName.toLowerCase().includes(q);
      const matchNote = issue.resolution?.resolutionNotes
        .toLowerCase()
        .includes(q);

      if (!matchTicket && !matchOperator && !matchLearner && !matchNote) {
        return false;
      }
    }

    if (
      filterAction !== 'ALL' &&
      issue.resolution?.actionTaken !== filterAction
    ) {
      return false;
    }

    return true;
  });

  const getActionBadge = (action?: string) => {
    switch (action) {
      case 'LABEL_CORRECTED_AND_DATASET_SAVED':
        return {
          label: 'Sửa Nhãn AI & Fine-tune',
          className: 'bg-snapy-light text-snapy border-snapy/20 font-bold',
          icon: '📸',
        };
      case 'VOCABULARY_UPDATED_INLINE':
      case 'OPENED_IN_CONTENT_STUDIO':
        return {
          label: 'Cập Nhật Từ Điển',
          className: 'bg-info-light text-info border-info/20 font-bold',
          icon: '📚',
        };
      case 'STREAK_RESTORED':
        return {
          label: 'Khôi Phục Streak',
          className: 'bg-primary-light text-primary border-primary/20 font-bold',
          icon: '🔥',
        };
      case 'COMPENSATION_GRANTED':
        return {
          label: 'Cấp Bù Tiền Tệ',
          className: 'bg-reward-light text-reward border-reward/20 font-bold',
          icon: '🪙',
        };
      case 'DISMISSED_INVALID':
        return {
          label: 'Bác Bỏ Báo Cáo',
          className: 'bg-surface-subtle text-text-muted border-border font-medium',
          icon: '✖️',
        };
      default:
        return {
          label: 'Đã Giải Quyết',
          className: 'bg-primary-light text-primary border-primary/20 font-medium',
          icon: '✓',
        };
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* 1. SLA Performance Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Tuân Thủ Cam Kết SLA
            </span>
            <span className="text-lg font-extrabold text-primary">
              96.2% đạt chuẩn
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Thời Gian Xử Lý Trung Bình
            </span>
            <span className="text-lg font-extrabold text-text">
              48 phút / ca (P1 &lt; 120p)
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-reward-light text-reward flex items-center justify-center border border-reward/20">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Mẫu Huấn Luyện Đã Xuất
            </span>
            <span className="text-lg font-extrabold text-reward">
              {resolvedIssues.filter((i) => i.scanData?.pushedToFineTuning).length} samples Gemini Vision
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="relative w-full sm:w-80">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã ticket, tên operator, lý do..."
            className="w-full pl-8 pr-3 py-1.5 bg-canvas border border-border rounded-lg text-xs text-text placeholder:text-text-light focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text font-medium focus:outline-none focus:border-primary"
          >
            <option value="ALL">Mọi hành động kiểm toán</option>
            <option value="LABEL_CORRECTED_AND_DATASET_SAVED">
              📸 Sửa Nhãn AI & Fine-tune
            </option>
            <option value="OPENED_IN_CONTENT_STUDIO">
              📚 Cập Nhật Từ Điển (Studio)
            </option>
            <option value="STREAK_RESTORED">🔥 Khôi Phục Streak</option>
            <option value="DISMISSED_INVALID">✖️ Bác Bỏ Báo Cáo</option>
          </select>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <Download size={13} />
            <span>Xuất Sổ Cái</span>
          </button>
        </div>
      </div>

      {/* 3. Immutable Ledger Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-[11px] font-bold text-text-light uppercase tracking-wider">
                <th className="py-2.5 px-3">Mã Ticket & Ngày Xử Lý</th>
                <th className="py-2.5 px-3">Người Báo Cáo</th>
                <th className="py-2.5 px-3">Hành Động Kiểm Toán</th>
                <th className="py-2.5 px-3">Operator Thực Hiện</th>
                <th className="py-2.5 px-3">Lý Do Xử Lý (Audit Reason)</th>
                <th className="py-2.5 px-3 text-center">Bồi Thường</th>
                <th className="py-2.5 px-3 text-center">Thông Báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted">
                    Không có bản ghi kiểm toán nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((issue) => {
                  const actBadge = getActionBadge(
                    issue.resolution?.actionTaken
                  );

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      className="hover:bg-canvas/80 transition-colors cursor-pointer"
                    >
                      {/* Ticket & Date */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-text text-xs">
                          {issue.ticketId}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          {issue.resolution?.resolvedAt
                            ? new Date(
                                issue.resolution.resolvedAt
                              ).toLocaleString('vi-VN')
                            : new Date(issue.reportedAt).toLocaleDateString(
                                'vi-VN'
                              )}
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={issue.learner.avatar}
                            alt={issue.learner.fullName}
                            className="w-5 h-5 rounded-full object-cover border border-border"
                          />
                          <span className="font-semibold text-text text-[11px]">
                            {issue.learner.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md inline-flex items-center gap-1 border ${actBadge.className}`}
                        >
                          <span>{actBadge.icon}</span>
                          <span>{actBadge.label}</span>
                        </span>
                      </td>

                      {/* Operator */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-text text-[11px]">
                        {issue.resolution?.resolvedBy || 'Admin Duyệt Viên'}
                      </td>

                      {/* Reason */}
                      <td className="py-2.5 px-3 max-w-xs md:max-w-sm">
                        <p className="text-[11px] text-text leading-relaxed line-clamp-2">
                          {issue.resolution?.resolutionNotes ||
                            issue.description}
                        </p>
                      </td>

                      {/* Compensation */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {issue.resolution?.compensationCoins ? (
                          <span className="text-[10px] font-bold text-reward bg-reward-light px-2 py-0.5 rounded border border-reward/30 flex items-center justify-center gap-1">
                            <Coins size={11} /> +{issue.resolution.compensationCoins} Coins
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted">---</span>
                        )}
                      </td>

                      {/* Notification */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {issue.resolution?.pushNotificationSent ? (
                          <span className="text-[10px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20 inline-flex items-center gap-1">
                            <Send size={10} /> Đã gửi App
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted">Không gửi</span>
                        )}
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
