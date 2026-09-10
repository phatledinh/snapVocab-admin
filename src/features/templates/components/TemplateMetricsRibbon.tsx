import React from 'react';
import { TemplateMetricsSummary } from '../../../domains/templates/types';
import {
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  Volume2,
  CheckCircle2,
  RotateCw,
  Keyboard,
  Eye,
} from 'lucide-react';

interface TemplateMetricsRibbonProps {
  metrics: TemplateMetricsSummary;
}

export const TemplateMetricsRibbon: React.FC<TemplateMetricsRibbonProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 select-none">
      {/* Metric 1: Total Templates */}
      <div className="bg-surface p-3.5 rounded-xl border border-border hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="font-semibold">Mẫu Thẻ Học (Templates)</span>
          <span className="p-1.5 rounded-lg bg-primary-light text-primary">
            <Layers size={14} />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight">
            {metrics.totalTemplates}
          </span>
          <span className="text-[11px] font-medium text-text-muted">mẫu lưu hành</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
          <span className="text-primary font-bold">{metrics.systemCount} Mẫu Hệ Thống</span>
          <span className="text-text-muted">{metrics.customCount} Custom</span>
        </div>
      </div>

      {/* Metric 2: Active Decks Linked */}
      <div className="bg-surface p-3.5 rounded-xl border border-border hover:border-info/40 transition-all shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="font-semibold">Bộ Bài (Decks) Áp Dụng</span>
          <span className="p-1.5 rounded-lg bg-info-light text-info">
            <Sparkles size={14} />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text tracking-tight">
            {metrics.activeDecksLinked}
          </span>
          <span className="text-[11px] font-medium text-text-muted">decks active</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center gap-1.5 text-[11px] text-info font-medium">
          <CheckCircle2 size={12} />
          <span>100% Decks có template gán</span>
        </div>
      </div>

      {/* Metric 3: Interaction Types Breakdown */}
      <div className="bg-surface p-3.5 rounded-xl border border-border hover:border-snapy/40 transition-all shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="font-semibold">Kiểu Tương Tác</span>
          <span className="p-1.5 rounded-lg bg-snapy-light text-snapy">
            <Zap size={14} />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-text tracking-tight">
            {metrics.flipCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
            <RotateCw size={10} /> Flip
          </span>
          <span className="text-xl font-extrabold text-text tracking-tight ml-1">
            {metrics.typeInCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
            <Keyboard size={10} /> Type
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Tap-to-reveal:</span>
          <span className="font-bold text-text flex items-center gap-1">
            <Eye size={11} /> {metrics.tapToRevealCount} mẫu
          </span>
        </div>
      </div>

      {/* Metric 4: Average Retention Rate */}
      <div className="bg-surface p-3.5 rounded-xl border border-border hover:border-reward/40 transition-all shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="font-semibold">Hiệu Suất Nhớ FSRS</span>
          <span className="p-1.5 rounded-lg bg-reward-light text-[#9A7000]">
            <TrendingUp size={14} />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#9A7000] tracking-tight">
            {metrics.averageRetentionRate}%
          </span>
          <span className="text-[11px] font-semibold text-emerald-600">+2.4% vs chuẩn</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Tỷ lệ nhớ trung bình</span>
          <span className="text-emerald-700 font-bold">Rất cao</span>
        </div>
      </div>

      {/* Metric 5: Rich Media Coverage */}
      <div className="bg-surface p-3.5 rounded-xl border border-border hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="font-semibold">Độ Phủ Media & Audio</span>
          <span className="p-1.5 rounded-lg bg-primary-light text-primary">
            <Volume2 size={14} />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-primary tracking-tight">
            {metrics.mediaRichCoverageRate}%
          </span>
          <span className="text-[11px] font-medium text-text-muted">có âm thanh / ảnh</span>
        </div>
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Hỗ trợ TTS giọng US/UK</span>
          <span className="text-primary font-bold">Chuẩn hoá</span>
        </div>
      </div>
    </div>
  );
};
