import React, { useState } from 'react';
import { IssueReportItem } from '../../../domains/issue-reports/types';
import {
  getPriorityBadge,
  getStatusBadge,
  getCategoryInfo,
} from '../../../domains/issue-reports/selectors';
import {
  X,
  Camera,
  BookOpen,
  User,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Coins,
  Clock,
  Send,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

interface IssueDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueReportItem | null;
  onOpenQuickResolveModal: (issue: IssueReportItem) => void;
  onOpenInContentStudio?: (word: string) => void;
  onNavigateToLearner?: (learnerId: string) => void;
}

export const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({
  isOpen,
  onClose,
  issue,
  onOpenQuickResolveModal,
  onOpenInContentStudio,
  onNavigateToLearner,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'reporter' | 'audit'>(
    'evidence'
  );

  if (!isOpen || !issue) return null;

  const pBadge = getPriorityBadge(issue.priority);
  const sBadge = getStatusBadge(issue.status);
  const catInfo = getCategoryInfo(issue.category);

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-surface h-full shadow-2xl flex flex-col z-10 border-l border-border animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border bg-canvas flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-text bg-surface px-2 py-0.5 rounded border border-border">
                {issue.ticketId}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${pBadge.className}`}
              >
                {pBadge.label}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${sBadge.className}`}
              >
                {sBadge.label}
              </span>
            </div>
            <h2 className="font-bold text-sm text-text mt-1.5 line-clamp-1">
              {issue.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border bg-surface px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-primary text-primary bg-primary-light/20'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Camera size={13} />
            <span>Bằng Chứng & Kỹ Thuật</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reporter')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reporter'
                ? 'border-primary text-primary bg-primary-light/20'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <User size={13} />
            <span>Người Học Báo Cáo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-primary text-primary bg-primary-light/20'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <ShieldCheck size={13} />
            <span>Xử Lý & Kiểm Toán</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              {/* Scan photo if present */}
              {issue.scanData && (
                <div className="bg-canvas rounded-xl p-3 border border-border space-y-2">
                  <span className="text-[11px] font-bold text-text uppercase tracking-wider block">
                    Ảnh Chụp Camera Thực Tế
                  </span>
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-border bg-black/5 flex items-center justify-center">
                    <img
                      src={issue.scanData.originalImageUrl}
                      alt="Scan capture"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-text-muted">
                      AI Label: <strong className="text-danger">{issue.scanData.predictedLabel}</strong>
                    </span>
                    <span className="text-text-muted">
                      Confidence: <strong className="text-text">{Math.round(issue.scanData.confidence * 100)}%</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Description & Learner Words */}
              <div className="bg-surface-subtle rounded-xl p-3 border border-border space-y-2">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block">
                  Mô Tả Chi Tiết Từ Người Học
                </span>
                <p className="text-text leading-relaxed italic bg-surface p-2.5 rounded-lg border border-border">
                  "{issue.description}"
                </p>
                {issue.targetWord && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-text-muted">Từ vựng mục tiêu:</span>
                    <span className="font-bold text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20">
                      {issue.targetWord}
                    </span>
                    {issue.suggestedWord && (
                      <>
                        <span className="text-text-muted">➔ Đề xuất:</span>
                        <span className="font-bold text-snapy bg-snapy-light px-2 py-0.5 rounded border border-snapy/20">
                          {issue.suggestedWord}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Context */}
              <div className="bg-surface-subtle rounded-xl p-3 border border-border space-y-2">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block flex items-center gap-1.5">
                  <Smartphone size={13} />
                  <span>Thông Số Thiết Bị & Kỹ Thuật</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-text-muted block text-[10px]">Thiết bị</span>
                    <span className="font-semibold text-text">{issue.deviceInfo.deviceModel}</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-text-muted block text-[10px]">Hệ điều hành</span>
                    <span className="font-semibold text-text">{issue.deviceInfo.osVersion}</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-text-muted block text-[10px]">Phiên bản App</span>
                    <span className="font-semibold text-text">{issue.deviceInfo.appVersion}</span>
                  </div>
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-text-muted block text-[10px]">Thời điểm gửi</span>
                    <span className="font-semibold text-text">{new Date(issue.reportedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reporter' && (
            <div className="space-y-3">
              <div className="bg-canvas rounded-xl p-4 border border-border text-center flex flex-col items-center">
                <img
                  src={issue.learner.avatar}
                  alt={issue.learner.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-xs mb-2"
                />
                <h3 className="font-extrabold text-sm text-text">
                  {issue.learner.fullName}
                </h3>
                <span className="text-xs text-text-muted font-mono">
                  {issue.learner.email}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
                    Cấp độ {issue.learner.cefrLevel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-snapy-light text-snapy border border-snapy/20">
                    🔥 Streak {issue.learner.streakDays} ngày
                  </span>
                </div>

                {onNavigateToLearner && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToLearner(issue.learner.id);
                      onClose();
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <ExternalLink size={12} />
                    <span>Mở Hồ Sơ 360° Người Học</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              {issue.resolution ? (
                <div className="bg-primary-light/20 rounded-xl p-3.5 border border-primary/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                    <CheckCircle2 size={15} />
                    <span>Đã Giải Quyết Bởi {issue.resolution.resolvedBy}</span>
                  </div>
                  <p className="text-text text-xs leading-relaxed bg-surface p-2.5 rounded-lg border border-primary/20">
                    {issue.resolution.resolutionNotes}
                  </p>
                  <div className="text-[10px] text-text-muted pt-1 flex items-center justify-between">
                    <span>Thời gian: {new Date(issue.resolution.resolvedAt).toLocaleString('vi-VN')}</span>
                    {issue.resolution.compensationCoins && (
                      <span className="font-bold text-reward flex items-center gap-1">
                        <Coins size={11} /> +{issue.resolution.compensationCoins} Coins
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-surface-subtle rounded-xl p-3 border border-border text-center text-text-muted">
                  <Clock size={20} className="mx-auto mb-1 text-text-light" />
                  <p className="font-semibold text-text">Sự cố đang chờ xử lý</p>
                  <p className="text-[11px] mt-0.5">
                    Chưa có nhật ký giải quyết cho mã ticket này.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border bg-canvas flex items-center justify-between gap-2">
          {issue.targetWord && onOpenInContentStudio ? (
            <button
              type="button"
              onClick={() => {
                onOpenInContentStudio(issue.targetWord!);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={13} />
              <span>Sửa trong Studio</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-medium transition-all"
            >
              Đóng
            </button>

            {issue.status !== 'RESOLVED' && (
              <button
                type="button"
                onClick={() => {
                  onOpenQuickResolveModal(issue);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <CheckCircle2 size={14} />
                <span>Giải Quyết Ngay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
