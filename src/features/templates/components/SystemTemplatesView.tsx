import React, { useState } from 'react';
import { CardTemplate, TemplateFilterState, BaseLayoutType, InteractionType } from '../../../domains/templates/types';
import {
  Layers,
  Search,
  RotateCw,
  Keyboard,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Copy,
  ExternalLink,
  Code2,
  Users,
  TrendingUp,
  Bookmark,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface SystemTemplatesViewProps {
  templates: CardTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (template: CardTemplate) => void;
  onInspectTemplate: (template: CardTemplate) => void;
  onCloneTemplate: (template: CardTemplate) => void;
  onAssignToDeck: (template: CardTemplate) => void;
}

export const SystemTemplatesView: React.FC<SystemTemplatesViewProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onInspectTemplate,
  onCloneTemplate,
  onAssignToDeck,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState<TemplateFilterState>({
    searchQuery: '',
    baseLayout: 'all',
    interactionType: 'all',
    status: 'all',
  });

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchNameVi = tpl.nameVi.toLowerCase().includes(q);
      const matchCode = tpl.code.toLowerCase().includes(q);
      const matchDesc = tpl.description.toLowerCase().includes(q);
      if (!matchName && !matchNameVi && !matchCode && !matchDesc) return false;
    }
    if (filter.baseLayout !== 'all' && tpl.baseLayout !== filter.baseLayout) return false;
    if (filter.interactionType !== 'all' && tpl.interactionType !== filter.interactionType) return false;
    return true;
  });

  // Interaction type badge helper
  const renderInteractionBadge = (type: InteractionType) => {
    switch (type) {
      case 'FLIP':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <RotateCw size={11} />
            <span>FLIP</span>
          </span>
        );
      case 'TYPE_IN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Keyboard size={11} />
            <span>TYPE-IN</span>
          </span>
        );
      case 'TAP_TO_REVEAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Eye size={11} />
            <span>TAP-TO-REVEAL</span>
          </span>
        );
    }
  };

  // Layout icon helper
  const getLayoutLabel = (layout: BaseLayoutType) => {
    switch (layout) {
      case 'SINGLE_COLUMN':
        return '1 Cột Chuẩn';
      case 'TWO_COLUMN':
        return '2 Cột Song Song';
      case 'IMAGE_TOP':
        return 'Ảnh Lớn Trên Cùng';
      case 'AUDIO_CENTER':
        return 'Sóng Âm Trung Tâm';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 select-none">
      {/* Control Bar */}
      <div className="bg-surface p-3.5 rounded-xl border border-border mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
            placeholder="Tìm theo tên, mã thẻ (CLASSIC, SPELLING...)..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Filter */}
          <select
            value={filter.baseLayout}
            onChange={(e) => setFilter({ ...filter, baseLayout: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Mọi Bố Cục (Layout)</option>
            <option value="SINGLE_COLUMN">1 Cột Chuẩn</option>
            <option value="TWO_COLUMN">2 Cột</option>
            <option value="IMAGE_TOP">Ảnh Trên Cùng</option>
            <option value="AUDIO_CENTER">Audio Trung Tâm</option>
          </select>

          {/* Interaction Filter */}
          <select
            value={filter.interactionType}
            onChange={(e) => setFilter({ ...filter, interactionType: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Mọi Tương Tác</option>
            <option value="FLIP">Lật Thẻ (FLIP)</option>
            <option value="TYPE_IN">Gõ Chính Tả (TYPE_IN)</option>
            <option value="TAP_TO_REVEAL">Chạm Lộ Dần (TAP)</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-text-muted hover:text-text'
              }`}
              title="Chế độ Lưới (Grid)"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-text-muted hover:text-text'
              }`}
              title="Chế độ Bảng (Table)"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-xl border border-border text-text-muted">
          <Layers size={36} className="mx-auto mb-2 text-text-muted/60" />
          <p className="text-sm font-semibold text-text">Không tìm thấy mẫu thẻ hệ thống phù hợp</p>
          <p className="text-xs mt-1">Vui lòng thử điều chỉnh lại từ khóa hoặc bộ lọc tìm kiếm.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const frontFields = template.fields.filter((f) => f.side === 'FRONT');
            const backFields = template.fields.filter((f) => f.side === 'BACK');

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`bg-surface rounded-xl border-2 p-4 flex flex-col justify-between transition-all cursor-pointer relative shadow-xs hover:border-primary/60 ${
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-extrabold text-xs border border-primary/20">
                        {template.code[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-text leading-snug">
                            {template.name}
                          </h4>
                          {template.isDefault && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-reward-light text-[#9A7000] border border-reward/20">
                              Mặc Định
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-text-muted font-medium">
                          {template.nameVi}
                        </span>
                      </div>
                    </div>
                    {renderInteractionBadge(template.interactionType)}
                  </div>

                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
                    {template.description}
                  </p>

                  {/* Field Mapping Badges Preview */}
                  <div className="space-y-1.5 bg-background p-2.5 rounded-lg border border-border/70 text-[11px] mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-text-muted uppercase text-[9px] w-10">Mặt trước:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {frontFields.map((f) => (
                          <span
                            key={f.id}
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                              f.isPrimary
                                ? 'bg-primary-light text-primary border-primary/30'
                                : 'bg-surface text-text-muted border-border'
                            }`}
                          >
                            {f.fieldType} {f.isPrimary && '★'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-text-muted uppercase text-[9px] w-10">Mặt sau:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {backFields.map((f) => (
                          <span
                            key={f.id}
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                              f.isPrimary
                                ? 'bg-primary-light text-primary border-primary/30'
                                : 'bg-surface text-text-muted border-border'
                            }`}
                          >
                            {f.fieldType} {f.isPrimary && '★'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Stats & Actions */}
                <div>
                  <div className="pt-2.5 border-t border-border/80 flex items-center justify-between text-xs text-text-muted mb-3">
                    <div className="flex items-center gap-1">
                      <Bookmark size={12} className="text-primary" />
                      <span>{template.deckCount} Decks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-info" />
                      <span>{template.activeLearners.toLocaleString()} Học viên</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <TrendingUp size={12} />
                      <span>{template.retentionRate}%</span>
                    </div>
                  </div>

                  {/* Actions Button Group */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-primary text-white hover:bg-primary-hover'
                          : 'bg-surface hover:bg-surface-subtle border border-border text-text'
                      }`}
                    >
                      <Sparkles size={12} />
                      <span>{isSelected ? 'Đang giả lập' : 'Thử mô phỏng'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectTemplate(template);
                      }}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-subtle text-text-muted hover:text-text transition-colors"
                      title="Xem JSON Schema & Audit"
                    >
                      <Code2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneTemplate(template);
                      }}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-subtle text-text-muted hover:text-text transition-colors"
                      title="Nhân bản sang Trình thiết kế (Clone)"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignToDeck(template);
                      }}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-subtle text-text-muted hover:text-primary transition-colors"
                      title="Gán cho Deck"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background text-text-muted font-bold uppercase tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-3 px-4">Tên Mẫu & Mã</th>
                  <th className="py-3 px-4">Bố Cục</th>
                  <th className="py-3 px-4">Kiểu Tương Tác</th>
                  <th className="py-3 px-4">Số Fields</th>
                  <th className="py-3 px-4">Bộ Bài Dùng</th>
                  <th className="py-3 px-4">Học Viên Active</th>
                  <th className="py-3 px-4">Nhớ FSRS</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplateId === template.id;
                  return (
                    <tr
                      key={template.id}
                      onClick={() => onSelectTemplate(template)}
                      className={`hover:bg-surface-subtle/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-primary-light/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary font-bold flex items-center justify-center text-xs">
                            {template.code[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-text">{template.name}</span>
                              {template.isDefault && (
                                <span className="px-1 py-0.1 rounded text-[9px] font-bold bg-reward-light text-[#9A7000]">
                                  Default
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-text-muted">{template.nameVi}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border font-medium text-[11px]">
                          {getLayoutLabel(template.baseLayout)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{renderInteractionBadge(template.interactionType)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-muted">
                        F:{template.fields.filter((f) => f.side === 'FRONT').length} | B:
                        {template.fields.filter((f) => f.side === 'BACK').length}
                      </td>
                      <td className="py-3 px-4 font-bold text-text">{template.deckCount} decks</td>
                      <td className="py-3 px-4 font-medium text-text-muted">
                        {template.activeLearners.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {template.retentionRate}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectTemplate(template);
                            }}
                            className="px-2 py-1 rounded bg-surface hover:bg-surface-subtle border border-border text-[11px] font-semibold text-text"
                          >
                            Schema
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCloneTemplate(template);
                            }}
                            className="px-2 py-1 rounded bg-surface hover:bg-surface-subtle border border-border text-[11px] font-semibold text-text"
                          >
                            Clone
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignToDeck(template);
                            }}
                            className="px-2 py-1 rounded bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 text-[11px] font-bold transition-all"
                          >
                            Gán Deck
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
      )}
    </div>
  );
};
