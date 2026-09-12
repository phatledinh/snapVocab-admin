import React from 'react';
import { AuditLogEntry } from '../../../domains/audit/types';
import {
  Sparkles,
  BookOpen,
  Camera,
  ArrowRight,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';

interface ContentAiAuditTabProps {
  logs: AuditLogEntry[];
  onSelectEntry: (entry: AuditLogEntry) => void;
  onNavigateToContentStudio?: (wordTitle: string) => void;
  onNavigateToAiScan?: () => void;
}

export const ContentAiAuditTab: React.FC<ContentAiAuditTabProps> = ({
  logs,
  onSelectEntry,
  onNavigateToContentStudio,
  onNavigateToAiScan,
}) => {
  const contentAiLogs = logs.filter(
    (l) => l.domain === 'CONTENT_STUDIO' || l.domain === 'AI_SCAN'
  );

  const publishedCount = contentAiLogs.filter(
    (l) => l.action === 'VOCAB_PUBLISHED'
  ).length;

  const aiFinetunedCount = contentAiLogs.filter(
    (l) => l.action === 'AI_LABEL_CORRECTED' || l.action === 'AI_DATASET_SAVED'
  ).length;

  return (
    <div className="space-y-3 select-none">
      {/* Top Banner Information */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-snapy-light border border-snapy/20 text-snapy flex items-center justify-center text-lg shadow-xs">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-text tracking-tight">
                Nhật Ký Vòng Đời Từ Vựng & AI Scan Feedback Loop (§7.1 & §7.2)
              </h2>
              <span className="px-2 py-0.2 rounded-full bg-snapy-light text-snapy text-[10px] font-bold border border-snapy/20">
                Content Studio & Vision
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Lưu vết mọi thay đổi trạng thái thẻ học FSM, cấu hình âm thanh TTS và các nhãn ảnh sửa đổi đưa vào tập huấn luyện Gemini Vision.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-center min-w-[110px]">
            <div className="text-[10px] text-text-muted font-bold uppercase">Đã Duyệt Publish</div>
            <div className="text-sm font-extrabold text-primary font-mono">{publishedCount} thẻ</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-center min-w-[110px]">
            <div className="text-[10px] text-text-muted font-bold uppercase">Fine-tuning AI</div>
            <div className="text-sm font-extrabold text-snapy font-mono">{aiFinetunedCount} bộ mẫu</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3 w-40">Thời Gian & Ticket</th>
                <th className="p-3 w-36">Loại Thao Tác</th>
                <th className="p-3 min-w-[200px]">Từ Vựng / Nhãn AI Tác Động</th>
                <th className="p-3 min-w-[200px]">Thay Đổi Thuộc Tính</th>
                <th className="p-3 min-w-[220px]">Lý Do Kiểm Toán & Căn Cứ</th>
                <th className="p-3 w-36">Biên Tập Viên</th>
                <th className="p-3 w-16 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {contentAiLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-text-muted">
                    <Clock size={28} className="mx-auto mb-2 opacity-30 text-text-muted" />
                    <p className="font-semibold text-sm">Không có dữ liệu kiểm toán Content & AI phù hợp</p>
                  </td>
                </tr>
              ) : (
                contentAiLogs.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="hover:bg-surface-subtle/50 transition-colors cursor-pointer group"
                  >
                    {/* Timestamp & Ticket */}
                    <td className="p-3 align-top">
                      <div className="font-mono text-xs text-text font-bold">
                        {new Date(entry.timestamp).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString('vi-VN')}
                      </div>
                      {entry.ticketId && (
                        <div className="mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-[10px] font-mono font-bold text-primary">
                            {entry.ticketId}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Action badge */}
                    <td className="p-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          entry.domain === 'CONTENT_STUDIO'
                            ? 'bg-primary-light text-primary border-primary/20'
                            : 'bg-snapy-light text-snapy border-snapy/20'
                        }`}
                      >
                        {entry.domain === 'CONTENT_STUDIO' ? <BookOpen size={11} /> : <Camera size={11} />}
                        <span>{entry.actionLabel}</span>
                      </span>
                    </td>

                    {/* Target Entity with CTA */}
                    <td className="p-3 align-top">
                      <div className="font-bold text-text text-xs flex items-center gap-1.5">
                        <span className="font-mono">{entry.targetEntity.title}</span>
                        {entry.targetEntity.type === 'WORD' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const cleanWord = entry.targetEntity.title.split(' ')[0];
                              onNavigateToContentStudio?.(cleanWord);
                            }}
                            className="text-text-muted hover:text-primary p-0.5"
                            title="Mở trong Content Studio"
                          >
                            <ExternalLink size={11} />
                          </button>
                        )}
                        {entry.targetEntity.type === 'SCAN' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToAiScan?.();
                            }}
                            className="text-text-muted hover:text-snapy p-0.5"
                            title="Mở trong AI Scan Queue"
                          >
                            <ExternalLink size={11} />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        ID: <span className="font-mono">{entry.targetEntity.id}</span>
                      </div>
                    </td>

                    {/* Diff */}
                    <td className="p-3 align-top">
                      {entry.diff ? (
                        <div className="bg-surface-subtle/70 p-1.5 rounded-lg border border-border/60 text-[11px] space-y-0.5">
                          {Object.keys(entry.diff.after || {}).map((key) => {
                            const bVal = (entry.diff?.before as any)?.[key];
                            const aVal = (entry.diff?.after as any)?.[key];
                            return (
                              <div key={key} className="flex items-center gap-1 truncate text-[10px]">
                                <span className="font-mono text-text-muted">{key}:</span>
                                {bVal !== undefined && (
                                  <>
                                    <span className="line-through text-text-muted">{String(bVal)}</span>
                                    <ArrowRight size={10} className="text-text-muted shrink-0" />
                                  </>
                                )}
                                <span className="font-bold text-primary">{String(aVal)}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[10px] text-text-muted italic">—</span>
                      )}
                    </td>

                    {/* Reason */}
                    <td className="p-3 align-top">
                      <div className="bg-surface-subtle/50 p-2 rounded-lg border border-border/50 text-[11px] text-text leading-relaxed italic line-clamp-2">
                        "{entry.reason}"
                      </div>
                    </td>

                    {/* Operator */}
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={entry.operator.avatar}
                          alt={entry.operator.name}
                          className="w-5 h-5 rounded-full object-cover border border-border"
                        />
                        <span className="font-semibold text-text text-[11px]">
                          {entry.operator.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-text-muted font-mono uppercase block mt-0.5">
                        {entry.operator.role}
                      </span>
                    </td>

                    {/* CTA */}
                    <td className="p-3 align-top text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEntry(entry);
                        }}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-surface hover:bg-primary-light hover:text-primary transition-all text-text-muted"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
