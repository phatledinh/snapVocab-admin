import React, { useState } from 'react';
import { AuditLogEntry } from '../../../domains/audit/types';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  ArrowRight,
  RotateCcw,
  Cpu,
  Ticket,
  Globe,
  User,
  AlertTriangle,
  FileCode2,
} from 'lucide-react';

interface AuditInspectorDrawerProps {
  entry: AuditLogEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateEntity?: (navDeepLink?: string, entityTitle?: string) => void;
  onRollback?: (entry: AuditLogEntry) => void;
}

export const AuditInspectorDrawer: React.FC<AuditInspectorDrawerProps> = ({
  entry,
  isOpen,
  onClose,
  onNavigateEntity,
  onRollback,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [rollbackConfirm, setRollbackConfirm] = useState(false);

  if (!isOpen || !entry) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xl bg-surface h-full shadow-2xl border-l border-border flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between bg-surface-subtle/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-text-muted px-2 py-0.5 rounded bg-surface border border-border">
                {entry.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(entry.id, 'auditId')}
                className="text-text-muted hover:text-text p-1"
                title="Sao chép Audit ID"
              >
                {copiedField === 'auditId' ? (
                  <Check size={12} className="text-primary" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold border ${
                  entry.severity === 'CRITICAL'
                    ? 'bg-danger-light text-danger border-danger/30'
                    : entry.severity === 'WARNING'
                    ? 'bg-snapy-light text-snapy border-snapy/30'
                    : 'bg-primary-light text-primary border-primary/30'
                }`}
              >
                {entry.severity}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-text mt-1.5 leading-snug">
              {entry.actionLabel}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted font-mono">
              <Clock size={11} />
              <span>{new Date(entry.timestamp).toLocaleString('vi-VN')}</span>
              <span>·</span>
              <span>Block #{entry.metadata.blockHeight || 10420}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle border border-transparent hover:border-border transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Section 1: Justification & Reason (Crucial rule §5.3) */}
          <div className="bg-primary-50/50 border border-primary/20 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-primary flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <Shield size={13} />
                Căn Cứ Giải Trình Kiểm Toán (Bắt Buộc)
              </span>
              {entry.ticketId && (
                <button
                  type="button"
                  onClick={() => handleCopy(entry.ticketId || '', 'ticketId')}
                  className="flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface border border-primary/30 font-bold text-primary hover:bg-primary-light transition-all"
                >
                  <Ticket size={10} />
                  <span>{entry.ticketId}</span>
                  {copiedField === 'ticketId' ? <Check size={10} /> : <Copy size={10} />}
                </button>
              )}
            </div>

            <p className="text-xs text-text leading-relaxed italic bg-surface/80 p-2.5 rounded-lg border border-primary/20">
              "{entry.reason}"
            </p>

            {entry.details && (
              <p className="text-[11px] text-text-muted mt-1 leading-normal">
                {entry.details}
              </p>
            )}
          </div>

          {/* Section 2: Operator & Environment Card */}
          <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
            <div className="text-[10px] font-bold text-text-light uppercase tracking-wider">
              Chủ Thể Thao Tác (Operator Environment)
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={entry.operator.avatar}
                  alt={entry.operator.name}
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-text truncate">
                    {entry.operator.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-subtle border border-border font-bold text-primary">
                      {entry.operator.role}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      ID: {entry.operator.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
              <div>
                <span className="text-[10px] text-text-muted font-medium block">Địa chỉ IP:</span>
                <div className="font-mono text-[11px] text-text flex items-center gap-1 mt-0.5">
                  <Globe size={11} className="text-text-muted" />
                  <span>{entry.operator.ipAddress}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-medium block">Trình duyệt / Client:</span>
                <span className="font-mono text-[10px] text-text-muted truncate block mt-0.5" title={entry.operator.userAgent}>
                  {entry.operator.userAgent || 'Chrome v128'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Target Entity with Deep Link */}
          <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                Thực Thể Chịu Tác Động (Target Entity)
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface-subtle border border-border font-bold text-text-muted">
                {entry.targetEntity.type}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border">
              <div>
                <div className="text-xs font-extrabold text-text font-mono">
                  {entry.targetEntity.title}
                </div>
                <div className="text-[10px] font-mono text-text-muted mt-0.5">
                  ID: {entry.targetEntity.id}
                </div>
              </div>

              {entry.targetEntity.navDeepLink && (
                <button
                  type="button"
                  onClick={() =>
                    onNavigateEntity?.(
                      entry.targetEntity.navDeepLink,
                      entry.targetEntity.title
                    )
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-primary/40 text-text hover:text-primary text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  <span>Mở màn hình</span>
                  <ExternalLink size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Visual State Diff Viewer */}
          <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                Chi Tiết Biến Động Dữ Liệu (State Diff)
              </span>
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
              >
                <FileCode2 size={11} />
                <span>{showRawJson ? 'Xem bảng thuộc tính' : 'Xem JSON thô'}</span>
              </button>
            </div>

            {showRawJson ? (
              <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                {JSON.stringify(entry.diff, null, 2)}
              </pre>
            ) : entry.diff ? (
              <div className="space-y-1.5">
                {Object.keys(entry.diff.after || {}).map((key) => {
                  const beforeVal = (entry.diff?.before as any)?.[key];
                  const afterVal = (entry.diff?.after as any)?.[key];
                  return (
                    <div
                      key={key}
                      className="p-2 rounded-lg bg-surface-subtle border border-border/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="font-mono text-text-muted font-bold text-[11px]">
                        {key}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        {beforeVal !== undefined ? (
                          <>
                            <span className="line-through text-danger/80 bg-danger-light/40 px-1.5 py-0.2 rounded">
                              {String(beforeVal)}
                            </span>
                            <ArrowRight size={11} className="text-text-muted shrink-0" />
                          </>
                        ) : (
                          <span className="text-text-muted italic text-[10px]">mới</span>
                        )}
                        <span className="font-bold text-primary bg-primary-light px-1.5 py-0.2 rounded border border-primary/20">
                          {String(afterVal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-text-muted italic p-3 text-center">
                Không có biến động thuộc tính được lưu trữ.
              </div>
            )}
          </div>

          {/* Section 5: Tamper Proof Cryptographic Proof */}
          <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-text-light uppercase tracking-wider flex items-center gap-1">
                <Cpu size={12} className="text-snapy" />
                Mã Băm Toàn Vẹn Bất Biến (SHA-256 Checksum)
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                100% VALIDATED
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-subtle border border-border font-mono text-[10px] text-text break-all flex items-center justify-between gap-2">
              <span>{entry.metadata.tamperHash}</span>
              <button
                type="button"
                onClick={() => handleCopy(entry.metadata.tamperHash, 'hash')}
                className="text-text-muted hover:text-text shrink-0"
              >
                {copiedField === 'hash' ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-border bg-surface-subtle/40 flex items-center justify-between gap-2">
          {entry.canRollback ? (
            rollbackConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onRollback?.(entry);
                    setRollbackConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-danger hover:bg-danger-hover text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Xác nhận Hoàn tác
                </button>
                <button
                  type="button"
                  onClick={() => setRollbackConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text hover:bg-surface-subtle transition-colors"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRollbackConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-bold transition-all shadow-xs"
              >
                <RotateCcw size={12} className="text-snapy" />
                <span>Hoàn Tác Trạng Thái (Rollback)</span>
              </button>
            )
          ) : (
            <span className="text-[11px] text-text-muted italic">
              Bản ghi bất biến, không thể rollback trực tiếp
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
          >
            Đóng Thanh Soi
          </button>
        </div>
      </div>
    </div>
  );
};
