import React, { useState } from 'react';
import {
  AIScanRequest,
  ScanHistoryFilter,
  ScanRequestStatus,
} from '../../../domains/ai-scan/types';
import { filterScanRequests, getConfidenceBadge } from '../../../domains/ai-scan/selectors';
import { RequestDetailDrawer } from './RequestDetailDrawer';
import {
  Search,
  Download,
  Eye,
  Inbox,
} from 'lucide-react';

interface ScanRequestsExplorerTabProps {
  requests: AIScanRequest[];
}

export const ScanRequestsExplorerTab: React.FC<ScanRequestsExplorerTabProps> = ({
  requests,
}) => {
  const [filter, setFilter] = useState<ScanHistoryFilter>({
    status: 'all',
    confidenceLevel: 'all',
    search: '',
    dateRange: '7d',
  });

  const [selectedRequest, setSelectedRequest] = useState<AIScanRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredRequests = filterScanRequests(requests, filter);

  const handleInspect = (req: AIScanRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Learner,Label,Status,Confidence,CLIP,LatencyMs,CreatedAt']
        .concat(
          filteredRequests.map(
            (r) =>
              `"${r.id}","${r.learnerName}","${r.predictedLabel}","${r.status}",${r.confidence},${r.clipScore},${r.processingTimeMs},"${r.createdAt}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `snapvocab_scan_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ScanRequestStatus) => {
    switch (status) {
      case 'DONE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'PENDING':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'FAILED':
      case 'TIMEOUT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'QUOTA_EXCEEDED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Search and Filters Toolbar */}
      <div className="p-3 bg-surface border border-border rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search and Selects */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Tìm theo Request ID, Tên người học, Nhãn, hoặc Lỗi..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs focus:ring-1 focus:ring-primary"
            />
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value as any })
            }
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text focus:ring-1 focus:ring-primary"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="DONE">DONE (Thành công)</option>
            <option value="PROCESSING">PROCESSING (Đang xử lý)</option>
            <option value="FAILED">FAILED (Lỗi)</option>
            <option value="TIMEOUT">TIMEOUT (Quá hạn 60s)</option>
            <option value="QUOTA_EXCEEDED">QUOTA_EXCEEDED</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={filter.confidenceLevel}
            onChange={(e) =>
              setFilter({ ...filter, confidenceLevel: e.target.value as any })
            }
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text focus:ring-1 focus:ring-primary"
          >
            <option value="all">Độ tin cậy: Tất cả</option>
            <option value="high">Cao (&gt;= 90%)</option>
            <option value="medium">Vừa (70% - 89%)</option>
            <option value="low">Thấp (&lt; 70%)</option>
          </select>
        </div>

        {/* Right: Export CSV & Count */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs font-mono text-text-muted">
            Tìm thấy <strong className="text-text">{filteredRequests.length}</strong> logs
          </span>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download size={13} />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Dense Table */}
      <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/80 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3">Request ID</th>
                <th className="p-3">Người Học</th>
                <th className="p-3">Vật Thể &amp; Ảnh</th>
                <th className="p-3">Nguồn</th>
                <th className="p-3">Độ Tin Cậy</th>
                <th className="p-3">Độ Trễ</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const conf = getConfidenceBadge(req.confidence);
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-surface-subtle/50 transition-colors group"
                    >
                      {/* Request ID */}
                      <td className="p-3 font-mono font-bold text-text whitespace-nowrap">
                        <span className="group-hover:text-primary transition-colors">
                          {req.id}
                        </span>
                        {req.priority === 'P1' && (
                          <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] bg-danger text-white font-mono font-bold">
                            P1
                          </span>
                        )}
                      </td>

                      {/* Learner */}
                      <td className="p-3">
                        <div className="font-semibold text-text truncate max-w-[140px]">
                          {req.learnerName}
                        </div>
                        <div className="text-[10px] text-text-muted font-mono">
                          {req.learnerId}
                        </div>
                      </td>

                      {/* Thumbnail & Label */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-black/10 border border-border shrink-0">
                            <img
                              src={req.imageUrl}
                              alt={req.predictedLabel}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-text font-mono">
                              {req.predictedLabel}
                            </div>
                            {req.correctedLabel && (
                              <div className="text-[10px] text-emerald-600 font-semibold font-mono">
                                ↳ {req.correctedLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="p-3 font-mono text-[11px] text-text-muted">
                        {req.detectionSource}
                      </td>

                      {/* Confidence */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold border ${conf.badgeClass}`}
                          >
                            {Math.round(req.confidence * 100)}%
                          </span>
                          <span className="text-[10px] text-text-light font-mono">
                            ({req.clipScore})
                          </span>
                        </div>
                      </td>

                      {/* Latency */}
                      <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                        <div className="text-text font-semibold">
                          {(req.processingTimeMs / 1000).toFixed(2)}s
                        </div>
                        <div className="text-[10px] text-text-muted">
                          Chờ {req.queueWaitTimeMs}ms
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-3 text-[11px] text-text-muted font-mono whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleInspect(req)}
                          className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-text font-semibold text-xs inline-flex items-center gap-1 transition-all shadow-xs"
                        >
                          <Eye size={12} className="text-primary" />
                          <span>Xem</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox size={24} className="text-text-light mb-1.5" />
                      <span className="text-xs">Không có request nào khớp với bộ lọc</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Info */}
        <div className="p-3 border-t border-border bg-surface-subtle/50 flex items-center justify-between text-xs text-text-muted">
          <span>
            Hiển thị <strong>{filteredRequests.length}</strong> / <strong>{requests.length}</strong> scan requests
          </span>
          <div className="text-[11px] font-mono">
            Retention chính sách lưu trữ: 30 ngày (ARC-13)
          </div>
        </div>
      </div>

      {/* Drawer */}
      <RequestDetailDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
