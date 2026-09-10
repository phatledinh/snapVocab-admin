import React from 'react';
import { TopicMetricsSummary } from '../../../domains/topics/types';
import { FolderTree, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface TopicMetricsRibbonProps {
  metrics: TopicMetricsSummary;
  onNavigateTab?: (tab: 'collections-topics' | 'system-decks' | 'batch-operations') => void;
}

export const TopicMetricsRibbon: React.FC<TopicMetricsRibbonProps> = ({
  metrics,
  onNavigateTab,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Metric 1: Collections & Topic Hierarchy */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('collections-topics')}
        className="p-3 bg-surface border border-border rounded-xl shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted">Cấu Trúc Danh Mục</span>
          <div className="w-6 h-6 rounded-lg bg-primary-light text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderTree size={14} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalCollections}
          </span>
          <span className="text-[11px] text-text-muted">Bộ Sưu Tập</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-border/50 text-[11px] text-text-muted">
          <span className="font-semibold text-text font-mono">{metrics.totalTopics}</span> chủ đề cha
          <span className="text-border">•</span>
          <span className="font-semibold text-text font-mono">{metrics.totalSubtopics}</span> chủ đề con
        </div>
      </div>

      {/* Metric 2: Curated Vocab Items */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('collections-topics')}
        className="p-3 bg-surface border border-border rounded-xl shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted">Từ Vựng Theo Chủ Đề</span>
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen size={14} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalCuratedWords}
          </span>
          <span className="text-[11px] text-text-muted">Mục Từ Vựng</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-border/50 text-[11px] text-emerald-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{metrics.publishedWords} từ đã xuất bản</span>
          <span className="text-text-muted font-normal">
            ({metrics.totalCuratedWords - metrics.publishedWords} chờ duyệt)
          </span>
        </div>
      </div>

      {/* Metric 3: System Curated Decks */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('system-decks')}
        className="p-3 bg-surface border border-border rounded-xl shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted">Bộ Thẻ Mẫu Hệ Thống</span>
          <div className="w-6 h-6 rounded-lg bg-reward-light text-[#9A7000] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers size={14} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-text tracking-tight font-mono">
            {metrics.totalSystemDecks}
          </span>
          <span className="text-[11px] text-text-muted">Starter Decks</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-border/50 text-[11px] text-text-muted">
          <span className="font-semibold text-text font-mono">
            {metrics.activeLearnersOnDecks.toLocaleString()}
          </span>
          <span>lượt người học đăng ký</span>
        </div>
      </div>

      {/* Metric 4: Content Health & Coverage */}
      <div className="p-3 bg-surface border border-border rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-text-muted">Độ Phủ Media & Đồng Bộ</span>
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={14} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-emerald-600 tracking-tight font-mono">
            {metrics.audioVisualCoveragePercent}%
          </span>
          <span className="text-[11px] text-text-muted">Đầy đủ Audio/Ảnh</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-border/50 text-[11px] text-text-muted">
          <span className="text-emerald-600 font-semibold font-mono">100%</span>
          <span>chuẩn Canonical Deck/Note</span>
        </div>
      </div>
    </div>
  );
};
