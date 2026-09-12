import React from 'react';
import { IssueRibbonMetrics } from '../../../domains/issue-reports/types';
import {
  AlertTriangle,
  Camera,
  BookOpen,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface IssueReportsMetricsRibbonProps {
  metrics: IssueRibbonMetrics;
  onJumpToP1Scan?: () => void;
  onJumpToDictionary?: () => void;
}

export const IssueReportsMetricsRibbon: React.FC<IssueReportsMetricsRibbonProps> = ({
  metrics,
  onJumpToP1Scan,
  onJumpToDictionary,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. Hàng Đợi Chờ Xử Lý & Tỷ Lệ Giải Quyết (Primary Green) */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Hàng Đợi Chờ Tiếp Nhận
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <CheckCircle2 size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            {metrics.totalPendingIssues} sự cố
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Tỷ lệ giải quyết: <strong className="text-primary font-bold">{metrics.slaComplianceRate}%</strong> (SLA)
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-primary font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Đã xử lý hôm nay: {metrics.resolvedTodayCount}
          </span>
          <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border/60">
            Active Triage Live
          </span>
        </div>
      </div>

      {/* 2. Sự Cố AI Camera Scan Khẩn Cấp (P1) (Danger Red / Snapy Orange) */}
      <div
        onClick={onJumpToP1Scan}
        className="bg-surface border border-danger/30 rounded-xl p-3.5 shadow-card hover:border-danger hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
            Sự Cố AI Scan Khẩn Cấp (P1)
          </span>
          <div className="w-7 h-7 rounded-lg bg-danger-light text-danger flex items-center justify-center border border-danger/30 group-hover:scale-105 transition-transform">
            <Camera size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-danger tracking-tight block">
            {metrics.urgentP1Count} ca cần xử lý
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Ưu tiên giải quyết: <strong className="text-danger font-semibold">&lt; 2 giờ</strong> (Active Learning)
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-snapy font-bold text-[10px] flex items-center gap-1">
            <Flame size={12} />
            <span>thermos, workbook, glasses</span>
          </span>
          <span className="text-[10px] font-semibold text-danger group-hover:underline">
            Xử lý ngay →
          </span>
        </div>
      </div>

      {/* 3. Báo Lỗi Từ Vựng & Từ Điển (Info Blue) */}
      <div
        onClick={onJumpToDictionary}
        className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-info/50 cursor-pointer transition-all flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Khiếu Nại Từ Vựng & Thẻ
          </span>
          <div className="w-7 h-7 rounded-lg bg-info-light text-info flex items-center justify-center border border-info/20 group-hover:scale-105 transition-transform">
            <BookOpen size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            6 báo cáo
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Đã duyệt & cập nhật từ điển: <strong className="text-info font-semibold">{metrics.dictionaryFixesCount} từ</strong>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-muted text-[10px]">
            MH-ADM-06 Feedback Queue
          </span>
          <span className="text-[10px] text-info font-semibold group-hover:underline">
            Xem chi tiết →
          </span>
        </div>
      </div>

      {/* 4. SLA & Huấn Luyện AI Vision (Reward Gold) */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card hover:border-border-strong transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            SLA & Huấn Luyện Gemini
          </span>
          <div className="w-7 h-7 rounded-lg bg-reward-light text-reward flex items-center justify-center border border-reward/20">
            <Sparkles size={15} />
          </div>
        </div>
        <div className="truncate">
          <span className="text-xl font-extrabold text-text tracking-tight block">
            {metrics.avgResolutionTimeMinutes} phút / ca
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Đã xuất fine-tuning: <strong className="text-reward font-semibold">{metrics.activeLearningFineTunedCount} mẫu chuẩn</strong>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-muted text-[10px] flex items-center gap-1">
            <Clock size={11} />
            Mục tiêu P1: &lt; 120p
          </span>
          <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border/60">
            Gemini Vision Ready
          </span>
        </div>
      </div>
    </div>
  );
};
