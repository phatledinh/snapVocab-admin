import React, { useState } from 'react';
import {
  StreakRecoveryRequest,
} from '../../../domains/learners/types';
import {
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface StreakRecoveryDeskTabProps {
  requests: StreakRecoveryRequest[];
  onApproveRequest: (request: StreakRecoveryRequest, reason: string) => void;
  onRejectRequest: (request: StreakRecoveryRequest, reason: string) => void;
  onOpenManualRecovery: () => void;
}

export const StreakRecoveryDeskTab: React.FC<StreakRecoveryDeskTabProps> = ({
  requests,
  onApproveRequest,
  onRejectRequest,
  onOpenManualRecovery,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [activeRequestForAction, setActiveRequestForAction] = useState<{
    request: StreakRecoveryRequest;
    action: 'approve' | 'reject';
  } | null>(null);
  const [actionReason, setActionReason] = useState<string>('');

  const filteredRequests = requests.filter((r) =>
    filterStatus === 'ALL' ? true : r.status === filterStatus
  );

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleConfirmAction = () => {
    if (!activeRequestForAction) return;
    if (!actionReason.trim()) {
      alert('Vui lòng nhập lý do xử lý yêu cầu!');
      return;
    }

    if (activeRequestForAction.action === 'approve') {
      onApproveRequest(activeRequestForAction.request, actionReason);
    } else {
      onRejectRequest(activeRequestForAction.request, actionReason);
    }

    setActiveRequestForAction(null);
    setActionReason('');
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Header Banner & LiveOps Desk KPIs */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
              <Flame size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text tracking-tight flex items-center gap-2">
                <span>Hàng Đợi Khôi Phục Chuỗi Streak (LiveOps Guardrails)</span>
                <span className="px-2 py-0.2 rounded-full bg-snapy-light text-snapy text-[10px] font-bold border border-snapy/20">
                  design.md §7.3
                </span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Hỗ trợ phục hồi chuỗi học do lỗi kỹ thuật hoặc sự cố ngoại lệ. Bắt buộc gắn Ticket ID vào Audit Log.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch Manual Recovery */}
        <button
          type="button"
          onClick={onOpenManualRecovery}
          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw size={13} />
          <span>Khôi phục thủ công cho học viên</span>
        </button>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
              filterStatus === 'ALL'
                ? 'bg-surface text-text font-bold shadow-xs border border-border'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Tất cả ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-snapy-light text-snapy font-bold shadow-xs border border-snapy/30'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Clock size={13} />
            <span>Chờ duyệt ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              filterStatus === 'approved'
                ? 'bg-primary-light text-primary font-bold shadow-xs border border-primary/30'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Đã phê duyệt ({approvedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              filterStatus === 'rejected'
                ? 'bg-danger-light text-danger font-bold shadow-xs border border-danger/30'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <XCircle size={13} />
            <span>Đã từ chối ({rejectedCount})</span>
          </button>
        </div>
      </div>

      {/* 3. Requests Cards List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted shadow-card">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-primary opacity-60" />
            <p className="font-bold text-sm text-text">Không có phiếu yêu cầu nào trong danh sách</p>
            <p className="text-[11px] mt-0.5">
              Hàng đợi xử lý sự cố chuỗi học Streak hiện đang trống.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            return (
              <div
                key={req.id}
                className="bg-surface border border-border hover:border-border-strong rounded-xl p-4 shadow-card transition-all space-y-3"
              >
                {/* Top Ticket Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-surface-subtle font-mono text-xs font-bold text-text border border-border">
                      {req.ticketId}
                    </span>
                    <span className="text-xs font-bold text-text">
                      Yêu cầu khôi phục chuỗi Streak
                    </span>
                    <span className="text-[10px] text-text-muted">
                      • Gửi lúc {new Date(req.requestedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {req.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-snapy-light text-snapy border border-snapy/20 text-[10px] font-bold">
                        <Clock size={11} />
                        Chờ Operator duyệt
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20 text-[10px] font-bold">
                        <CheckCircle2 size={11} />
                        Đã phục hồi ({req.resolvedBy})
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-danger-light text-danger border border-danger/20 text-[10px] font-bold">
                        <XCircle size={11} />
                        Đã từ chối ({req.resolvedBy})
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Content: Learner Info & Streak Delta & Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Col 1: Learner Info */}
                  <div className="flex items-center gap-2.5 bg-surface-subtle/50 p-2.5 rounded-lg border border-border/60">
                    <img
                      src={req.avatar}
                      alt={req.learnerName}
                      className="w-10 h-10 rounded-full object-cover border border-border shadow-2xs shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-bold text-text truncate">{req.learnerName}</div>
                      <div className="text-[11px] text-text-muted truncate">{req.learnerEmail}</div>
                      <div className="text-[10px] font-mono text-text-muted mt-0.5">
                        ID: {req.learnerId}
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Streak Comparison */}
                  <div className="bg-surface-subtle/50 p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        Chuỗi Bị Đứt
                      </div>
                      <div className="text-base font-extrabold text-danger flex items-center gap-1 mt-0.5">
                        <Flame size={16} />
                        <span>{req.lostStreakDays} ngày</span>
                      </div>
                    </div>

                    <ArrowRight size={18} className="text-text-muted/60" />

                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        Chuỗi Sau Phục Hồi
                      </div>
                      <div className="text-base font-extrabold text-primary flex items-center gap-1 mt-0.5">
                        <Flame size={16} />
                        <span>{req.targetStreakDays} ngày</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 3: Reason Category */}
                  <div className="bg-surface-subtle/50 p-2.5 rounded-lg border border-border/60 flex flex-col justify-center">
                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                      Phân Loại Sự Cố
                    </div>
                    <div className="font-bold text-text mt-0.5 text-xs text-snapy flex items-center gap-1">
                      <AlertTriangle size={13} />
                      <span>{req.lossReasonLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Proof Note */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900">
                  <div className="font-bold text-[11px] flex items-center gap-1.5 mb-1 text-amber-800">
                    <FileText size={13} />
                    <span>Giải trình & Bằng chứng từ người học:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed italic">
                    "{req.proofNote}"
                  </p>
                </div>

                {/* Resolution info if resolved */}
                {req.status !== 'pending' && req.resolutionReason && (
                  <div className="bg-surface-subtle rounded-lg p-2.5 text-xs text-text-muted border border-border/60 flex items-start gap-2">
                    <ShieldAlert size={14} className="text-text-muted shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text">Kết quả xử lý:</span> {req.resolutionReason}
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Xử lý ngày: {req.resolvedAt && new Date(req.resolvedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending Actions */}
                {req.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveRequestForAction({ request: req, action: 'reject' })
                      }
                      className="px-3 py-1.5 rounded-lg border border-danger/30 bg-danger-light text-danger hover:bg-danger/20 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      Từ chối yêu cầu
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveRequestForAction({ request: req, action: 'approve' })
                      }
                      className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Phê duyệt & Phục hồi {req.targetStreakDays} ngày</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog Modal */}
      {activeRequestForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-5 shadow-modal space-y-4 select-none">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    activeRequestForAction.action === 'approve'
                      ? 'bg-primary-light text-primary'
                      : 'bg-danger-light text-danger'
                  }`}
                >
                  {activeRequestForAction.action === 'approve' ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-text">
                  {activeRequestForAction.action === 'approve'
                    ? 'Phê Duyệt Phục Hồi Chuỗi Streak'
                    : 'Từ Chối Yêu Cầu Phục Hồi'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequestForAction(null)}
                className="text-text-muted hover:text-text"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="text-xs space-y-2 text-text-muted">
              <p>
                Mã Ticket: <strong className="text-text font-mono">{activeRequestForAction.request.ticketId}</strong>
              </p>
              <p>
                Học viên: <strong className="text-text">{activeRequestForAction.request.learnerName}</strong> ({activeRequestForAction.request.learnerEmail})
              </p>
              {activeRequestForAction.action === 'approve' && (
                <p className="text-primary font-bold">
                  Chuỗi sẽ được điều chỉnh lên: {activeRequestForAction.request.targetStreakDays} ngày.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">
                Lý do xử lý (Bắt buộc ghi vào Audit Log):
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={
                  activeRequestForAction.action === 'approve'
                    ? 'Ví dụ: Đã kiểm tra log máy chủ xác nhận có lỗi văng app, hợp lệ phục hồi.'
                    : 'Ví dụ: Người học không thực hiện bài ôn tập trong thời gian hợp lệ, từ chối.'
                }
                rows={3}
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setActiveRequestForAction(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-surface-subtle"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition-all ${
                  activeRequestForAction.action === 'approve'
                    ? 'bg-primary hover:bg-primary-hover'
                    : 'bg-danger hover:bg-danger-hover'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
