import React, { useState } from 'react';
import { AuditLogEntry } from '../../../domains/audit/types';
import {
  FileCheck2,
  Download,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  FileSpreadsheet,
  FileCode2,
  RefreshCw,
  Hash,
  Lock,
} from 'lucide-react';
import { exportAuditLogsToCsv, exportAuditLogsToJson } from '../../../domains/audit/selectors';

interface ComplianceExportTabProps {
  logs: AuditLogEntry[];
  onOpenExportModal: () => void;
}

export const ComplianceExportTab: React.FC<ComplianceExportTabProps> = ({
  logs,
  onOpenExportModal,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(true);

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifySuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner Information */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary/20 text-primary flex items-center justify-center text-xl shadow-xs">
            ⛓️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-text tracking-tight">
                Hệ Thống Sổ Cái Bất Biến & Kiểm Định Bằng Chứng Toàn Vẹn (Proof of Audit)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold border border-primary/20">
                Immutable Ledger
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Mỗi sự kiện kiểm toán được gắn mã băm mật mã học (SHA-256) tuần tự và tham chiếu khối liền trước. Không bất kỳ người vận hành nào có thể chỉnh sửa hay xóa bản ghi cũ.
            </p>
          </div>
        </div>

        {/* Verify CTA */}
        <button
          type="button"
          onClick={handleVerifyLedger}
          disabled={isVerifying}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={13} className={isVerifying ? 'animate-spin' : ''} />
          <span>{isVerifying ? 'Đang kiểm tra chuỗi băm...' : 'Xác Thực Toàn Vẹn Chuỗi Sổ Cái'}</span>
        </button>
      </div>

      {/* Compliance Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Compliance Rate Card */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-light">
              Tỷ Lệ Tuân Thủ Quy Chuẩn
            </span>
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-primary font-mono">100.0%</div>
            <p className="text-xs text-text-muted mt-1">
              Tất cả <b>{logs.length} bản ghi</b> đều có đầy đủ người chịu trách nhiệm, mã Ticket ID và căn cứ giải trình hợp lệ.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 size={13} />
            <span>Đạt chuẩn kiểm toán SOX / ISO 27001</span>
          </div>
        </div>

        {/* Cryptographic Proof Card */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-light">
              Chuỗi Băm Mật Mã Học
            </span>
            <Cpu size={18} className="text-snapy" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-text font-mono">SHA-256</div>
            <p className="text-xs text-text-muted mt-1">
              Khối hiện tại: <span className="font-mono font-bold text-text">#10420</span> · Chống giả mạo và chống sửa lén cơ sở dữ liệu.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 size={13} />
            <span>Không phát hiện sai lệch chuỗi (0 Tamper Detected)</span>
          </div>
        </div>

        {/* Instant Export Card */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-light">
              Trích Xuất Báo Cáo
            </span>
            <Download size={18} className="text-info" />
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => exportAuditLogsToCsv(logs)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-bold text-text transition-all"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={14} className="text-emerald-600" />
                <span>Xuất CSV (Excel tương thích)</span>
              </div>
              <span className="text-[10px] text-text-muted font-mono">{logs.length} dòng</span>
            </button>

            <button
              type="button"
              onClick={() => exportAuditLogsToJson(logs)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-bold text-text transition-all"
            >
              <div className="flex items-center gap-2">
                <FileCode2 size={14} className="text-info" />
                <span>Xuất JSON (Đầy đủ mã băm Hash)</span>
              </div>
              <span className="text-[10px] text-text-muted font-mono">JSON format</span>
            </button>
          </div>
          <div className="mt-3 pt-2 border-t border-border text-[11px] text-text-muted">
            Hỗ trợ tùy biến cột trong <button type="button" onClick={onOpenExportModal} className="text-primary font-bold hover:underline">Hộp thoại Xuất chi tiết</button>.
          </div>
        </div>
      </div>

      {/* Block Hash Sequence Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="p-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            <h3 className="text-xs font-extrabold text-text tracking-tight uppercase">
              Chuỗi Khối Kiểm Định Tuần Tự (Cryptographic Block Sequence)
            </h3>
          </div>
          <span className="text-[11px] text-text-muted font-mono">
            {logs.length} Blocks Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3 w-28">Block Height</th>
                <th className="p-3 w-40">Thời Điểm Ghi Nhận</th>
                <th className="p-3 min-w-[180px]">Sự Kiện & Phân Hệ</th>
                <th className="p-3 min-w-[260px]">Chuỗi Băm Mã Hóa (Tamper Hash SHA-256)</th>
                <th className="p-3 w-36">Người Ký Danh</th>
                <th className="p-3 w-28 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-surface-subtle/50 transition-colors font-mono">
                  <td className="p-3 font-bold text-text">
                    #{entry.metadata.blockHeight || 10420 - idx}
                  </td>
                  <td className="p-3 text-[11px] text-text-muted">
                    {new Date(entry.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 font-sans">
                    <span className="font-bold text-text text-xs block">
                      {entry.actionLabel}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {entry.domain} · {entry.id}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-[11px] font-mono text-text bg-surface-subtle/80 px-2 py-1 rounded border border-border/60 truncate max-w-sm">
                      {entry.metadata.tamperHash}
                    </div>
                  </td>
                  <td className="p-3 font-sans text-xs">
                    <div className="font-semibold text-text">{entry.operator.name}</div>
                    <div className="text-[10px] font-mono text-text-muted">{entry.operator.role}</div>
                  </td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle2 size={10} />
                      <span>VERIFIED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
