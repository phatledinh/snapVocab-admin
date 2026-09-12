import React, { useState } from 'react';
import { AuditLogEntry } from '../../../domains/audit/types';
import {
  X,
  Download,
  FileSpreadsheet,
  FileCode2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  exportAuditLogsToCsv,
  exportAuditLogsToJson,
} from '../../../domains/audit/selectors';

interface AuditExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredLogs: AuditLogEntry[];
  allLogs: AuditLogEntry[];
  onSuccessToast: (msg: string) => void;
}

export const AuditExportModal: React.FC<AuditExportModalProps> = ({
  isOpen,
  onClose,
  filteredLogs,
  allLogs,
  onSuccessToast,
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [scope, setScope] = useState<'filtered' | 'all'>('filtered');
  const [includeSecurityMeta, setIncludeSecurityMeta] = useState(true);

  if (!isOpen) return null;

  const targetLogs = scope === 'filtered' ? filteredLogs : allLogs;

  const handleExport = () => {
    if (format === 'csv') {
      exportAuditLogsToCsv(targetLogs);
      onSuccessToast(
        `Đã xuất thành công ${targetLogs.length} bản ghi kiểm toán dạng CSV!`
      );
    } else {
      exportAuditLogsToJson(targetLogs);
      onSuccessToast(
        `Đã xuất thành công ${targetLogs.length} bản ghi kiểm toán dạng JSON kèm chuỗi băm!`
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-border p-5 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
              <Download size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-text tracking-tight">
                Xuất Báo Cáo Sổ Cái Kiểm Toán
              </h3>
              <p className="text-[11px] text-text-muted">
                Trích xuất dữ liệu vận hành phục vụ thanh tra & lưu trữ an ninh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text rounded-md"
          >
            <X size={16} />
          </button>
        </div>

        {/* Format Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text block">
            1. Định dạng tập tin:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                format === 'csv'
                  ? 'bg-primary-50/50 border-primary shadow-xs'
                  : 'bg-surface hover:bg-surface-subtle border-border'
              }`}
            >
              <FileSpreadsheet
                size={20}
                className={format === 'csv' ? 'text-primary' : 'text-text-muted'}
              />
              <div>
                <div className="text-xs font-bold text-text">CSV (Bảng tính)</div>
                <div className="text-[10px] text-text-muted">
                  Tương thích Excel & Google Sheets
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                format === 'json'
                  ? 'bg-primary-50/50 border-primary shadow-xs'
                  : 'bg-surface hover:bg-surface-subtle border-border'
              }`}
            >
              <FileCode2
                size={20}
                className={format === 'json' ? 'text-primary' : 'text-text-muted'}
              />
              <div>
                <div className="text-xs font-bold text-text">JSON (Toàn vẹn)</div>
                <div className="text-[10px] text-text-muted">
                  Đầy đủ mã băm SHA-256 & Diff
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Scope Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text block">
            2. Phạm vi dữ liệu trích xuất:
          </label>
          <div className="space-y-1 text-xs">
            <label className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-surface-subtle cursor-pointer transition-colors">
              <input
                type="radio"
                name="exportScope"
                checked={scope === 'filtered'}
                onChange={() => setScope('filtered')}
                className="text-primary focus:ring-primary"
              />
              <span className="font-medium text-text">
                Chỉ xuất theo bộ lọc hiện tại ({filteredLogs.length} bản ghi)
              </span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-surface-subtle cursor-pointer transition-colors">
              <input
                type="radio"
                name="exportScope"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="text-primary focus:ring-primary"
              />
              <span className="font-medium text-text">
                Toàn bộ dữ liệu sổ cái trong hệ thống ({allLogs.length} bản ghi)
              </span>
            </label>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="pt-2 border-t border-border/60">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={includeSecurityMeta}
              onChange={(e) => setIncludeSecurityMeta(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-text-muted font-medium">
              Đính kèm dấu vết an ninh (Mã băm SHA-256, IP Address & Watermark)
            </span>
          </label>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download size={13} />
            <span>Tải Tập Tin ({targetLogs.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
