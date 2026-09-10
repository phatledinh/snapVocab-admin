import React from 'react';
import { AIScanProjection } from '../../../domains/dashboard/types';
import { Camera, AlertCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface AIScanMonitorWidgetProps {
  aiScan: AIScanProjection;
  onNavigate?: (navId: string) => void;
}

export const AIScanMonitorWidget: React.FC<AIScanMonitorWidgetProps> = ({
  aiScan,
  onNavigate,
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-snapy-light text-snapy flex items-center justify-center">
              <Camera size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text">AI Scan Monitor & Review Queue</h3>
              <p className="text-[10px] text-text-muted">
                Gemini Vision Object Detection & Active Feedback Loop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>94.2% OK</span>
          </div>
        </div>

        {/* 3 Micro Metrics */}
        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="p-2 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-text-muted">Hôm nay</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5">
              {aiScan.todayScans.toLocaleString('vi-VN')}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-text-muted">Độ trễ TB</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5 flex items-center gap-1">
              <Clock size={12} className="text-text-muted" />
              {aiScan.avgLatencyMs}ms
            </div>
          </div>

          <div className="p-2 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-text-muted">Độ tin cậy cao</div>
            <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
              {aiScan.confidenceRate}%
            </div>
          </div>
        </div>

        {/* Actionable Review Queue & Issue Banners */}
        <div className="space-y-2">
          {/* Urgent P1 Reports */}
          <div
            onClick={() => onNavigate?.('reports')}
            className="p-2.5 rounded-lg bg-danger-light border border-danger/30 flex items-center justify-between cursor-pointer hover:border-danger transition-all group"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-danger/20 text-danger flex items-center justify-center shrink-0">
                <AlertCircle size={13} />
              </div>
              <div>
                <div className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <span>{aiScan.urgentReportCount} Báo cáo Lỗi Scan (P1)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-danger text-white text-[9px] font-mono">
                    Khẩn cấp
                  </span>
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Người học báo cáo kết quả nhận diện camera chưa chính xác
                </div>
              </div>
            </div>
            <ArrowRight
              size={13}
              className="text-danger opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </div>

          {/* Pending Operator Queue */}
          <div
            onClick={() => onNavigate?.('ai-queue')}
            className="p-2.5 rounded-lg bg-snapy-light border border-snapy/30 flex items-center justify-between cursor-pointer hover:border-snapy transition-all group"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-snapy/20 text-snapy flex items-center justify-center shrink-0">
                <Sparkles size={13} />
              </div>
              <div>
                <div className="text-xs font-bold text-snapy flex items-center gap-1.5">
                  <span>Hàng đợi Review Queue ({aiScan.pendingQueueCount} ảnh)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-snapy text-white text-[9px] font-mono font-bold">
                    P2
                  </span>
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Ảnh scan có độ tin cậy AI &lt; 75% cần operator kiểm duyệt
                </div>
              </div>
            </div>
            <ArrowRight
              size={13}
              className="text-snapy opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <span>Active Learning Feedback Loop: Sẵn sàng</span>
        <button
          type="button"
          onClick={() => onNavigate?.('ai-queue')}
          className="text-xs font-semibold text-snapy hover:text-snapy-hover transition-colors"
        >
          Xử lý hàng đợi →
        </button>
      </div>
    </div>
  );
};
