import React, { useState } from 'react';
import { CardTemplate, InteractionType } from '../../../domains/templates/types';
import {
  Search,
  RotateCw,
  Keyboard,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Users,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

interface CustomTemplatesAuditViewProps {
  templates: CardTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (template: CardTemplate) => void;
  onPromoteToSystem: (template: CardTemplate) => void;
  onToggleFlagStatus: (template: CardTemplate) => void;
  onDeleteTemplate: (template: CardTemplate) => void;
}

export const CustomTemplatesAuditView: React.FC<CustomTemplatesAuditViewProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onPromoteToSystem,
  onToggleFlagStatus,
  onDeleteTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'flagged'>('all');

  const filtered = templates.filter((tpl) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchAuthor = tpl.authorName.toLowerCase().includes(q);
      const matchCode = tpl.code.toLowerCase().includes(q);
      if (!matchName && !matchAuthor && !matchCode) return false;
    }
    if (statusFilter !== 'all' && tpl.status !== statusFilter) return false;
    return true;
  });

  const renderInteractionBadge = (type: InteractionType) => {
    switch (type) {
      case 'FLIP':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <RotateCw size={10} /> FLIP
          </span>
        );
      case 'TYPE_IN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Keyboard size={10} /> TYPE-IN
          </span>
        );
      case 'TAP_TO_REVEAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Eye size={10} /> TAP
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 select-none">
      {/* Top Banner Guideline */}
      <div className="mb-4 p-3.5 bg-snapy-light/60 border border-snapy/20 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🛡️</span>
          <div>
            <span className="font-extrabold text-snapy-hover">Hàng rào Kiểm duyệt LiveOps:</span>
            <span className="text-text-muted ml-1.5 leading-relaxed">
              Mẫu tùy chỉnh vi phạm hoặc bị xóa mềm (soft-delete) sẽ tự động kích hoạt cơ chế an toàn: chuyển các Deck liên kết về mẫu <span className="font-mono font-bold text-text">CLASSIC</span>, tuyệt đối không làm mất thẻ hay dữ liệu FSRS của người học.
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface border border-border text-text shrink-0 shadow-2xs">
          Giới hạn: Max 20 tpl / Learner
        </span>
      </div>

      {/* Control Bar */}
      <div className="bg-surface p-3.5 rounded-xl border border-border mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên mẫu hoặc tên học viên tác giả..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Mọi trạng thái kiểm duyệt</option>
            <option value="active">Đang hoạt động (Active)</option>
            <option value="flagged">Bị gắn cờ vi phạm (Flagged)</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background text-text-muted font-bold uppercase tracking-wider text-[10px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Tên Mẫu Thẻ</th>
                <th className="py-3 px-4">Tác Giả (Học Viên)</th>
                <th className="py-3 px-4">Kiểu Tương Tác</th>
                <th className="py-3 px-4">Bộ Bài Đang Dùng</th>
                <th className="py-3 px-4">Học Viên Active</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Hành Động Kiểm Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                const isFlagged = template.status === 'flagged';

                return (
                  <tr
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className={`hover:bg-surface-subtle/70 transition-colors cursor-pointer ${
                      isSelected ? 'bg-primary-light/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-text">{template.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface-subtle text-text-muted border border-border">
                            {template.code}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-muted">{template.nameVi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {template.authorAvatar ? (
                          <img
                            src={template.authorAvatar}
                            alt={template.authorName}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-surface-subtle text-text-muted font-bold text-[10px] flex items-center justify-center border border-border">
                            {template.authorName[0]}
                          </div>
                        )}
                        <span className="font-semibold text-text">{template.authorName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{renderInteractionBadge(template.interactionType)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-text">
                        <Bookmark size={12} className="text-primary" />
                        <span>{template.deckCount} Decks</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-text-muted">
                      {template.activeLearners.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {isFlagged ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-max">
                          <AlertTriangle size={11} /> Cần Rà Soát
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                          <CheckCircle2 size={11} /> Hoạt Động
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFlagStatus(template);
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            isFlagged
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-surface text-text-muted border-border hover:text-rose-600 hover:border-rose-300'
                          }`}
                          title={isFlagged ? 'Gỡ cờ vi phạm (Approve)' : 'Gắn cờ vi phạm (Flag)'}
                        >
                          {isFlagged ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPromoteToSystem(template);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 text-[11px] font-bold flex items-center gap-1 transition-all"
                          title="Nâng cấp lên làm Mẫu Hệ Thống dùng chung"
                        >
                          <ArrowUpRight size={12} />
                          <span>Promote</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTemplate(template);
                          }}
                          className="p-1.5 rounded-lg bg-surface hover:bg-rose-50 border border-border hover:border-rose-200 text-text-muted hover:text-rose-600 transition-all"
                          title="Xóa mềm (Chuyển Decks về CLASSIC)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
