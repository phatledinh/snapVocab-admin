import React from 'react';
import { AuditEventProjection, InfraServiceHealth } from '../../../domains/dashboard/types';
import { History, Server, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuditActivityWidgetProps {
  auditTrail: AuditEventProjection[];
  infraServices: InfraServiceHealth[];
  r2Storage: { usedGb: number; quotaGb: number };
  onNavigate?: (navId: string) => void;
}

export const AuditActivityWidget: React.FC<AuditActivityWidgetProps> = ({
  auditTrail,
  infraServices,
  r2Storage,
  onNavigate,
}) => {
  const getActionBadge = (type: AuditEventProjection['type']) => {
    switch (type) {
      case 'status_change':
        return 'bg-primary-light text-primary border-primary/20';
      case 'ai_correction':
        return 'bg-snapy-light text-snapy border-snapy/20';
      case 'import':
        return 'bg-info-light text-info border-info/20';
      case 'guardrail':
        return 'bg-reward-light text-[#9A7000] border-reward/30';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <History size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text">Nhật Ký Kiểm Toán & Trạng Thái Hạ Tầng</h3>
              <p className="text-[10px] text-text-muted">
                Audit Trail sự kiện vận hành thời gian thực & Kết nối dịch vụ (SS-17)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('activity-log')}
            className="flex items-center gap-1 text-[11px] font-semibold text-text-muted hover:text-text transition-colors"
          >
            <span>Toàn bộ Log</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* 2-Column inner layout: Left = Audit Trail Stream, Right = Service Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          {/* Audit Events List */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
              Sự kiện kiểm toán gần nhất
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {auditTrail.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded-lg bg-surface-subtle/70 border border-border/80 hover:bg-surface-subtle transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-text truncate">{ev.operator}</span>
                      <span className="text-text-light">·</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${getActionBadge(
                          ev.type
                        )}`}
                      >
                        {ev.action}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-text font-medium truncate">
                    Đối tượng: <span className="font-bold text-primary">{ev.target}</span>
                  </div>
                  <div className="text-[10px] text-text-muted line-clamp-1 italic mt-0.5">
                    "{ev.reason}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Services Health Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
              <span>Hạ tầng & Dịch vụ (SS-17)</span>
              <span className="text-emerald-600 font-mono font-bold">100% Online</span>
            </div>

            <div className="space-y-1.5">
              {infraServices.map((svc) => (
                <div
                  key={svc.name}
                  className="p-1.5 px-2 rounded-lg bg-surface-subtle/50 border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-medium text-text text-[11px] leading-tight">
                        {svc.name}
                      </div>
                      <div className="text-[9px] text-text-muted">{svc.detail}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {svc.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>

            {/* R2 Storage bar */}
            <div className="p-2 rounded-lg bg-surface-subtle/50 border border-border text-xs mt-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-text-muted font-medium">Cloudflare R2 Storage:</span>
                <span className="font-mono font-bold text-text">
                  {r2Storage.usedGb} GB / {r2Storage.quotaGb} GB
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${(r2Storage.usedGb / r2Storage.quotaGb) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-primary" />
          <span>Mọi thay đổi trạng thái đều bắt buộc nhập lý do kiểm toán</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('settings')}
          className="text-xs font-semibold text-text hover:text-primary transition-colors"
        >
          Cấu hình hệ thống →
        </button>
      </div>
    </div>
  );
};
