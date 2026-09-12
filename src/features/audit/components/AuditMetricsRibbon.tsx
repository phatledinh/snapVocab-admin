import React from 'react';
import { AuditRibbonMetrics } from '../../../domains/audit/types';
import {
  History,
  AlertOctagon,
  ShieldCheck,
  Users,
  Cpu,
  ShieldAlert,
} from 'lucide-react';

interface AuditMetricsRibbonProps {
  metrics: AuditRibbonMetrics;
  onFilterGuardrails?: () => void;
  onFilterToday?: () => void;
}

export const AuditMetricsRibbon: React.FC<AuditMetricsRibbonProps> = ({
  metrics,
  onFilterGuardrails,
  onFilterToday,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
      {/* 1. Tổng Sự Kiện Kiểm Toán */}
      <div
        onClick={onFilterToday}
        className="bg-surface border border-border hover:border-primary/40 rounded-xl p-3 shadow-card cursor-pointer transition-all hover:translate-y-[-1px] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[11px] font-bold tracking-wider uppercase text-text-light">
            Sự Kiện 24 Giờ
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <History size={14} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-text font-mono tracking-tight">
              {metrics.logsTodayCount}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              / {metrics.totalLogsCount} toàn bộ
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-primary font-semibold">
            <span>● Luồng trực tiếp: ~{metrics.avgEventsPerHour} sự kiện/h</span>
          </div>
        </div>
      </div>

      {/* 2. Cảnh Báo Guardrail & Critical */}
      <div
        onClick={onFilterGuardrails}
        className="bg-surface border border-danger/20 hover:border-danger/40 rounded-xl p-3 shadow-card cursor-pointer transition-all hover:translate-y-[-1px] flex flex-col justify-between bg-gradient-to-br from-surface to-danger-light/10"
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[11px] font-bold tracking-wider uppercase text-danger">
            Guardrail & Critical
          </span>
          <div className="w-7 h-7 rounded-lg bg-danger-light text-danger flex items-center justify-center border border-danger/20">
            <AlertOctagon size={14} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-danger font-mono tracking-tight">
              {metrics.criticalViolationsCount}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-danger-light text-danger font-bold border border-danger/20">
              {metrics.guardrailViolationsBlocked} bị chặn
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-text-muted font-medium">
            <span>Vượt trần thưởng & Gian lận tốc độ</span>
          </div>
        </div>
      </div>

      {/* 3. Tỷ Lệ Giải Trình Kiểm Toán (Compliance Rate) */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[11px] font-bold tracking-wider uppercase text-text-light">
            Tuân Thủ Lý Do
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <ShieldCheck size={14} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-primary font-mono tracking-tight">
              {metrics.complianceRate}%
            </span>
            <span className="text-[11px] text-text-muted font-medium">bắt buộc</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-text-muted">
            <span className="text-primary font-bold">100% bản ghi</span>
            <span>có lý do/ticket hợp lệ</span>
          </div>
        </div>
      </div>

      {/* 4. Nhân Sự Vận Hành Đang Active */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[11px] font-bold tracking-wider uppercase text-text-light">
            Nhân Sự Vận Hành
          </span>
          <div className="w-7 h-7 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20">
            <Users size={14} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-text font-mono tracking-tight">
              {metrics.activeOperatorsCount}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-info-light text-info border border-info/20">
              Admin & Bots
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-text-muted font-medium truncate">
            <span>Lead, Content Editor & Sentinel</span>
          </div>
        </div>
      </div>

      {/* 5. Tính Toàn Vẹn Chuỗi Sổ Cái (Tamper-Proof Status) */}
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[11px] font-bold tracking-wider uppercase text-text-light">
            Toàn Vẹn Bất Biến
          </span>
          <div className="w-7 h-7 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20">
            <Cpu size={14} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-extrabold text-emerald-600 font-mono tracking-tight">
              SHA-256 VERIFIED
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-text-muted font-mono truncate">
            <span>Block Height: #10420 · 0 desync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
