import React, { useState } from 'react';
import {
  IssueReportItem,
  IssueFilterState,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from '../../../domains/issue-reports/types';
import {
  getPriorityBadge,
  getStatusBadge,
  getCategoryInfo,
} from '../../../domains/issue-reports/selectors';
import {
  Search,
  RotateCcw,
  Download,
  CheckSquare,
  X,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MasterIssueQueueTabProps {
  issues: IssueReportItem[];
  filterState: IssueFilterState;
  onFilterChange: (newFilters: Partial<IssueFilterState>) => void;
  onResetFilters: () => void;
  onSelectIssue: (issue: IssueReportItem) => void;
  selectedIssueId?: string;
  onOpenQuickResolveModal: (issue: IssueReportItem) => void;
  onOpenInContentStudio?: (word: string) => void;
  onBulkResolve: (issueIds: string[]) => void;
  onExportCsv: () => void;
}

export const MasterIssueQueueTab: React.FC<MasterIssueQueueTabProps> = ({
  issues,
  filterState,
  onFilterChange,
  onResetFilters,
  onSelectIssue,
  selectedIssueId,
  onOpenQuickResolveModal,
  onOpenInContentStudio,
  onBulkResolve,
  onExportCsv,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === issues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(issues.map((i) => i.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3 select-none">
      {/* 1. Multi-Tier Filter Toolbar */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
            />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Tìm theo mã ticket, tên người học, từ vựng hoặc nội dung..."
              className="w-full pl-9 pr-3 py-1.5 bg-canvas border border-border rounded-lg text-xs text-text placeholder:text-text-light focus:outline-none focus:border-primary focus:bg-surface transition-all"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category */}
            <select
              value={filterState.category}
              onChange={(e) =>
                onFilterChange({
                  category: e.target.value as IssueCategory | 'ALL',
                })
              }
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Mọi phân loại</option>
              <option value="AI_SCAN">📸 Scan Camera AI (P1)</option>
              <option value="VOCABULARY">📚 Từ vựng & Từ điển</option>
              <option value="LIVEOPS_ACCOUNT">🔥 LiveOps & Tài khoản</option>
              <option value="TECHNICAL_APP">⚙️ Lỗi ứng dụng</option>
            </select>

            {/* Priority */}
            <select
              value={filterState.priority}
              onChange={(e) =>
                onFilterChange({
                  priority: e.target.value as IssuePriority | 'ALL',
                })
              }
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Mọi ưu tiên</option>
              <option value="P1">🚨 P1 · Khẩn cấp</option>
              <option value="P2">⚡ P2 · Cao</option>
              <option value="P3">🔹 P3 · Bình thường</option>
            </select>

            {/* Status */}
            <select
              value={filterState.status}
              onChange={(e) =>
                onFilterChange({
                  status: e.target.value as IssueStatus | 'ALL',
                })
              }
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="PENDING">Chờ tiếp nhận</option>
              <option value="INVESTIGATING">Đang xử lý</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="DISMISSED">Đã bác bỏ</option>
            </select>

            {/* Platform */}
            <select
              value={filterState.platform}
              onChange={(e) =>
                onFilterChange({
                  platform: e.target.value as 'ios' | 'android' | 'ALL',
                })
              }
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Mọi nền tảng</option>
              <option value="ios">Apple iOS</option>
              <option value="android">Google Android</option>
            </select>

            {/* Reset */}
            <button
              type="button"
              onClick={onResetFilters}
              className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Active Filters Summary & Bulk Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-text-muted">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-text font-bold">{issues.length}</strong> sự cố
            </span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold border border-primary/20 flex items-center gap-1">
                <CheckSquare size={12} /> Đã chọn {selectedIds.length} dòng
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onBulkResolve(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
              >
                <CheckCircle2 size={12} />
                <span>Giải quyết ({selectedIds.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportCsv}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text font-medium text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download size={12} />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Data-Dense Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-[11px] font-bold text-text-light uppercase tracking-wider">
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      issues.length > 0 && selectedIds.length === issues.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Mã Ticket & Hạn SLA</th>
                <th className="py-2.5 px-3">Mức Ưu Tiên</th>
                <th className="py-2.5 px-3">Phân Loại</th>
                <th className="py-2.5 px-3">Người Học Báo Cáo</th>
                <th className="py-2.5 px-3">Nội Dung Báo Cáo & Từ Vựng</th>
                <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                <th className="py-2.5 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-text-light">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="font-semibold text-text">
                        Không tìm thấy sự cố nào phù hợp
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Thử điều chỉnh từ khóa tìm kiếm hoặc xóa các điều kiện lọc.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                issues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;
                  const isChecked = selectedIds.includes(issue.id);
                  const pBadge = getPriorityBadge(issue.priority);
                  const sBadge = getStatusBadge(issue.status);
                  const catInfo = getCategoryInfo(issue.category);

                  const isSlaBreached =
                    issue.status !== 'RESOLVED' &&
                    issue.status !== 'DISMISSED' &&
                    issue.slaRemainingMinutes <= 0;

                  const isSlaUrgent =
                    issue.status !== 'RESOLVED' &&
                    issue.status !== 'DISMISSED' &&
                    issue.slaRemainingMinutes > 0 &&
                    issue.slaRemainingMinutes <= 30;

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      className={`hover:bg-canvas/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-primary-light/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => handleToggleRow(issue.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Ticket & SLA */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-text text-[11px]">
                          {issue.ticketId}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {issue.status === 'RESOLVED' ? (
                            <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
                              <CheckCircle2 size={10} /> Đã hoàn thành
                            </span>
                          ) : issue.status === 'DISMISSED' ? (
                            <span className="text-[10px] text-text-muted">
                              Đã đóng
                            </span>
                          ) : isSlaBreached ? (
                            <span className="text-[10px] font-bold text-danger bg-danger-light px-1.5 py-0.2 rounded border border-danger/30 flex items-center gap-0.5">
                              <Clock size={10} /> Quá hạn SLA
                            </span>
                          ) : isSlaUrgent ? (
                            <span className="text-[10px] font-bold text-danger bg-danger-light px-1.5 py-0.2 rounded border border-danger/30 animate-pulse flex items-center gap-0.5">
                              <Clock size={10} /> Còn {issue.slaRemainingMinutes}p
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-text-muted flex items-center gap-0.5">
                              <Clock size={10} /> Còn {issue.slaRemainingMinutes}p
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${pBadge.className}`}
                        >
                          {pBadge.label}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 border ${catInfo.bgColor} ${catInfo.color} ${catInfo.borderColor}`}
                        >
                          <span>{catInfo.icon}</span>
                          <span>{catInfo.label}</span>
                        </span>
                      </td>

                      {/* Learner */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={issue.learner.avatar}
                            alt={issue.learner.fullName}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                          />
                          <div>
                            <div className="font-semibold text-text text-[11px] leading-tight">
                              {issue.learner.fullName}
                            </div>
                            <div className="text-[10px] text-text-muted flex items-center gap-1 leading-tight">
                              <span>{issue.learner.cefrLevel}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {issue.deviceInfo.platform}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Content & Word */}
                      <td className="py-2.5 px-3 max-w-xs md:max-w-md">
                        <div className="font-medium text-text text-xs truncate">
                          {issue.title}
                        </div>
                        <div className="text-[11px] text-text-muted truncate mt-0.5">
                          {issue.targetWord ? (
                            <span className="inline-flex items-center gap-1.5">
                              <strong className="text-primary font-bold bg-primary-light/50 px-1.5 py-0.2 rounded border border-primary/20">
                                {issue.targetWord}
                              </strong>
                              {issue.suggestedWord && (
                                <span className="text-text-muted text-[10px]">
                                  (Đề xuất: {issue.suggestedWord})
                                </span>
                              )}
                            </span>
                          ) : (
                            issue.description
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${sBadge.className}`}
                        >
                          {sBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-2.5 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {/* 1-Click Content Studio jump if word exists */}
                          {issue.targetWord && onOpenInContentStudio && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenInContentStudio(issue.targetWord!)
                              }
                              className="p-1 rounded-md text-text-muted hover:text-info hover:bg-info-light transition-all"
                              title="Sửa trong Content Studio"
                            >
                              <ExternalLink size={13} />
                            </button>
                          )}

                          {/* Quick Resolve Button */}
                          {issue.status !== 'RESOLVED' && (
                            <button
                              type="button"
                              onClick={() => onOpenQuickResolveModal(issue)}
                              className="p-1 rounded-md text-primary hover:bg-primary-light transition-all"
                              title="Giải quyết sự cố"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                          )}

                          {/* Inspect Details Drawer */}
                          <button
                            type="button"
                            onClick={() => onSelectIssue(issue)}
                            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-subtle transition-all"
                            title="Xem chi tiết 360°"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
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
