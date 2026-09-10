import React from 'react';
import { ContentPipelineProjection } from '../../../domains/dashboard/types';
import { ArrowRight, BookOpen, Volume2, Image as ImageIcon } from 'lucide-react';

interface ContentPipelineWidgetProps {
  pipeline: ContentPipelineProjection;
  onNavigate?: (navId: string) => void;
}

export const ContentPipelineWidget: React.FC<ContentPipelineWidgetProps> = ({
  pipeline,
  onNavigate,
}) => {
  const { byStatus, byCefr, totalWords } = pipeline;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-light text-primary flex items-center justify-center">
              <BookOpen size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text">Content Studio Pipeline & CEFR</h3>
              <p className="text-[10px] text-text-muted">
                Quy trình vòng đời từ vựng & phân bổ chuẩn CEFR
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('content-studio')}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Content Studio</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* State Machine Status Flow */}
        <div className="grid grid-cols-4 gap-2 my-3.5">
          <div className="bg-surface-subtle border border-border rounded-lg p-2 text-center">
            <div className="text-[10px] text-text-muted font-medium">Draft (Nháp)</div>
            <div className="text-sm font-bold font-mono text-text mt-0.5">{byStatus.draft}</div>
          </div>

          <div
            onClick={() => onNavigate?.('content-studio')}
            className="bg-info-light border border-info/30 rounded-lg p-2 text-center cursor-pointer hover:border-info transition-all shadow-xs"
          >
            <div className="text-[10px] text-info font-bold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              In Review
            </div>
            <div className="text-sm font-bold font-mono text-info mt-0.5">
              {byStatus.review}
            </div>
          </div>

          <div className="bg-primary-light border border-primary/30 rounded-lg p-2 text-center">
            <div className="text-[10px] text-primary font-bold">Published</div>
            <div className="text-sm font-bold font-mono text-primary mt-0.5">
              {byStatus.published.toLocaleString('vi-VN')}
            </div>
          </div>

          <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-2 text-center">
            <div className="text-[10px] text-text-light font-medium">Archived</div>
            <div className="text-sm font-bold font-mono text-text-muted mt-0.5">
              {byStatus.archived}
            </div>
          </div>
        </div>

        {/* CEFR Level Matrix Table */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
            Phân bổ trình độ & Độ phủ Media / TTS
          </div>

          <div className="divide-y divide-border/60 text-xs">
            {byCefr.map((row) => (
              <div
                key={row.level}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-surface-subtle/50 px-1 rounded transition-colors"
              >
                {/* Level badge & count */}
                <div className="flex items-center gap-2 w-28">
                  <span
                    className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border"
                    style={{
                      backgroundColor: `${row.color}15`,
                      color: row.color,
                      borderColor: `${row.color}30`,
                    }}
                  >
                    {row.level}
                  </span>
                  <span className="font-mono text-xs font-semibold text-text">
                    {row.count} từ
                  </span>
                </div>

                {/* Progress bar representing proportion */}
                <div className="flex-1 bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(row.count / totalWords) * 100 * 2.5}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>

                {/* Audio and Image coverage icons */}
                <div className="flex items-center gap-3 w-28 justify-end text-[10px] text-text-muted font-mono">
                  <span className="flex items-center gap-0.5" title="Độ phủ phát âm audio TTS">
                    <Volume2 size={11} className="text-info" />
                    {row.ttsPercent}%
                  </span>
                  <span className="flex items-center gap-0.5" title="Độ phủ ảnh minh họa">
                    <ImageIcon size={11} className="text-snapy" />
                    {row.mediaPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Deep Link Button */}
      <div className="mt-3 pt-2.5 border-t border-border">
        <button
          type="button"
          onClick={() => onNavigate?.('content-studio')}
          className="w-full py-1.5 px-3 bg-surface-subtle hover:bg-primary-light text-text hover:text-primary rounded-lg text-xs font-semibold transition-all border border-border flex items-center justify-center gap-1.5"
        >
          <span>Kiểm duyệt {byStatus.review} từ chờ duyệt trong Content Studio</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
