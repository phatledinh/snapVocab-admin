import React, { useState } from 'react';
import { AIScanRequest } from '../../../domains/ai-scan/types';
import { getConfidenceBadge } from '../../../domains/ai-scan/selectors';
import {
  X,
  Code2,
  AlertOctagon,
  Copy,
  Check,
  Layers,
  Clock,
  User,
  HardDrive,
} from 'lucide-react';

interface RequestDetailDrawerProps {
  request: AIScanRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'json' | 'error'>('overview');

  if (!isOpen || !request) return null;

  const conf = getConfidenceBadge(request.confidence);

  const rawJsonPayload = {
    requestId: request.id,
    learner: {
      id: request.learnerId,
      name: request.learnerName,
    },
    status: request.status,
    storage: {
      r2Key: request.r2StorageKey,
      imageUrl: request.imageUrl,
      cropUrl: request.cropUrl,
    },
    inference: {
      model: 'Florence-2-large (zero-shot) + SAM (ViT-H) + CLIP (ViT-B/32)',
      detectionSource: request.detectionSource,
      predictedLabel: request.predictedLabel,
      confidence: request.confidence,
      clipScore: request.clipScore,
      clipFloor: 0.23,
      boundingBox: request.boundingBox,
    },
    performance: {
      queueWaitTimeMs: request.queueWaitTimeMs,
      processingTimeMs: request.processingTimeMs,
      totalDurationMs: request.queueWaitTimeMs + request.processingTimeMs,
    },
    error: request.errorReason || null,
    createdAt: request.createdAt,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawJsonPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-surface border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div>
            <div className="p-4 border-b border-border bg-surface-subtle/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center font-bold">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-text">Chi Tiết Scan Request</h3>
                    <span className="font-mono text-[10px] font-bold text-text-muted">
                      {request.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Tạo lúc {new Date(request.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-2 border-b border-border px-4 pt-2 bg-surface text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className={`pb-2 border-b-2 transition-all ${
                  activeSubTab === 'overview'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                Tổng Quan
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('json')}
                className={`pb-2 border-b-2 flex items-center gap-1 transition-all ${
                  activeSubTab === 'json'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                <Code2 size={12} />
                <span>Raw JSON Payload</span>
              </button>
              {request.errorReason && (
                <button
                  type="button"
                  onClick={() => setActiveSubTab('error')}
                  className={`pb-2 border-b-2 flex items-center gap-1 transition-all ${
                    activeSubTab === 'error'
                      ? 'border-danger text-danger font-bold'
                      : 'border-transparent text-danger/80 hover:text-danger'
                  }`}
                >
                  <AlertOctagon size={12} />
                  <span>Error Trace</span>
                </button>
              )}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {activeSubTab === 'overview' && (
              <div className="space-y-4">
                {/* Photo & Thumbnail Preview */}
                <div className="flex gap-3">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/10 border border-border shrink-0">
                    <img
                      src={request.imageUrl}
                      alt={request.predictedLabel}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="text-[10px] text-text-muted">Nhãn Dự Đoán</div>
                      <div className="text-base font-bold font-mono text-text">
                        {request.predictedLabel}
                      </div>
                      {request.correctedLabel && (
                        <div className="text-xs text-emerald-600 font-semibold font-mono">
                          Đã sửa: {request.correctedLabel}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${conf.badgeClass}`}
                      >
                        {conf.text}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-snapy">
                        CLIP: {request.clipScore}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted">
                      Nguồn: <span className="font-mono font-bold text-text">{request.detectionSource}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Error Alert */}
                {request.errorReason && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertOctagon size={13} />
                      <span>Thông Báo Lỗi ({request.status})</span>
                    </div>
                    <p className="font-mono text-[11px] break-all">{request.errorReason}</p>
                  </div>
                )}

                {/* Learner Info */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-2 text-xs">
                  <div className="font-bold text-text flex items-center gap-1.5">
                    <User size={13} className="text-primary" />
                    <span>Thông Tin Người Học (Learner)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-text-muted">Họ tên:</span>{' '}
                      <span className="font-semibold text-text">{request.learnerName}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">User ID:</span>{' '}
                      <span className="text-text">{request.learnerId}</span>
                    </div>
                  </div>
                </div>

                {/* Storage & Latency Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-border">
                    <div className="text-[10px] text-text-muted flex items-center gap-1">
                      <Clock size={11} />
                      <span>Thời Gian Chờ &amp; Xử Lý</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-text mt-1">
                      {(request.processingTimeMs / 1000).toFixed(2)}s
                    </div>
                    <div className="text-[10px] text-text-muted font-mono mt-0.5">
                      Chờ hàng đợi: {request.queueWaitTimeMs}ms
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-border">
                    <div className="text-[10px] text-text-muted flex items-center gap-1">
                      <HardDrive size={11} />
                      <span>R2 Storage Key</span>
                    </div>
                    <div className="text-xs font-mono text-text mt-1 truncate" title={request.r2StorageKey}>
                      {request.r2StorageKey.split('/').pop()}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">Bucket: snap-scans-private</div>
                  </div>
                </div>

                {/* Bounding Box Info */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-xs font-mono">
                  <div className="text-[10px] text-text-muted mb-1">Tọa độ Bounding Box [ymin, xmin, ymax, xmax]:</div>
                  <div className="font-bold text-text">
                    [{request.boundingBox.join(', ')}]
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'json' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">Internal API Response Dump:</span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2 py-1 rounded bg-surface border border-border hover:bg-surface-subtle text-xs text-text flex items-center gap-1 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed">
                  {JSON.stringify(rawJsonPayload, null, 2)}
                </pre>
              </div>
            )}

            {activeSubTab === 'error' && request.errorReason && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <div className="font-bold text-rose-900">Chi Tiết Ngoại Lệ:</div>
                  <div className="font-mono text-rose-800 break-all bg-white p-2 rounded border border-rose-200">
                    {request.errorReason}
                  </div>
                </div>

                <div className="text-xs text-text-muted space-y-1">
                  <div className="font-semibold text-text">Khuyến nghị xử lý:</div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Nếu là lỗi <strong>AI_TIMEOUT</strong>: Kiểm tra GPU load, cân nhắc bật Fast Mode.</li>
                    <li>Nếu là lỗi <strong>QUOTA_EXCEEDED</strong>: Learner đã dùng hết 20 lượt scan/ngày; quota reset vào 00:00 UTC.</li>
                    <li>Nếu là lỗi <strong>NO_OBJECT_DETECTED</strong>: Ảnh mờ hoặc không có vật thể rõ nét.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border bg-surface-subtle/50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-subtle transition-all"
            >
              Đóng Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
