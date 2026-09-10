import React, { useState } from 'react';
import {
  SystemDeck,
  DeckNote,
  DeckFilterState,
  CardTemplateType,
} from '../../../domains/topics/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import { DeckInspectorDrawer } from './DeckInspectorDrawer';
import {
  Layers,
  Search,
  Plus,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Edit2,
  Copy,
  ChevronRight,
  TrendingUp,
  Volume2,
  Camera,
  Keyboard,
  FileText,
} from 'lucide-react';

interface SystemDecksViewProps {
  decks: SystemDeck[];
  deckNotes: DeckNote[];
  onOpenCreateDeck: () => void;
  onUpdateDeckTemplate?: (deckId: string, newTemplate: CardTemplateType) => void;
  onOpenInStudio?: (word: string) => void;
  onCloneDeck?: (deck: SystemDeck) => void;
}

export const SystemDecksView: React.FC<SystemDecksViewProps> = ({
  decks,
  deckNotes,
  onOpenCreateDeck,
  onUpdateDeckTemplate,
  onOpenInStudio,
  onCloneDeck,
}) => {
  const [filter, setFilter] = useState<DeckFilterState>({
    searchQuery: '',
    templateId: 'all',
    targetCefr: 'all',
    status: 'all',
  });

  const [selectedDeck, setSelectedDeck] = useState<SystemDeck | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Filtered decks
  const filteredDecks = decks.filter((d) => {
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchTitleVi = d.titleVi.toLowerCase().includes(q);
      const matchDesc = d.description.toLowerCase().includes(q);
      if (!matchTitle && !matchTitleVi && !matchDesc) return false;
    }
    if (filter.templateId !== 'all' && d.templateId !== filter.templateId) return false;
    if (filter.targetCefr !== 'all' && d.targetCefr !== filter.targetCefr) return false;
    if (filter.status !== 'all' && d.status !== filter.status) return false;
    return true;
  });

  const handleInspect = (deck: SystemDeck) => {
    setSelectedDeck(deck);
    setIsInspectorOpen(true);
  };

  // Template icon helper
  const getTemplateIcon = (tpl: CardTemplateType) => {
    switch (tpl) {
      case 'LISTENING':
        return <Volume2 size={13} className="text-primary" />;
      case 'VISUAL_IMAGE':
        return <Camera size={13} className="text-snapy" />;
      case 'CLOZE_TYPING':
        return <Keyboard size={13} className="text-purple-600" />;
      case 'MINIMAL':
        return <FileText size={13} className="text-blue-600" />;
      default:
        return <Layers size={13} className="text-text-muted" />;
    }
  };

  // Template badge color helper
  const getTemplateBadgeClass = (tpl: CardTemplateType) => {
    switch (tpl) {
      case 'LISTENING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'VISUAL_IMAGE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CLOZE_TYPING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MINIMAL':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden select-none">
      {/* Top Filter & Toolbar */}
      <div className="p-4 bg-surface border-b border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-text tracking-tight">
                Kho Bộ Bài Mẫu Hệ Thống (Curated Starter Decks)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-reward-light text-[#9A7000] text-[10px] font-bold border border-reward/20">
                Deck & Template Catalog
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Cung cấp cho Learner bộ thẻ dựng sẵn theo mô hình Canonical <code>Deck ➔ Note ➔ Card</code> kèm Card Template chuyên biệt.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateDeck}
            className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Tạo Starter Deck</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              placeholder="Tìm kiếm bộ bài, mẫu template..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:bg-surface transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Template Filter */}
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium">Template:</span>
              <select
                value={filter.templateId}
                onChange={(e) =>
                  setFilter({ ...filter, templateId: e.target.value as 'all' | CardTemplateType })
                }
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả mẫu ({decks.length})</option>
                <option value="CLASSIC">CLASSIC</option>
                <option value="LISTENING">LISTENING</option>
                <option value="VISUAL_IMAGE">VISUAL_IMAGE</option>
                <option value="CLOZE_TYPING">CLOZE_TYPING</option>
                <option value="MINIMAL">MINIMAL</option>
              </select>
            </div>

            {/* CEFR Filter */}
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium">CEFR:</span>
              <select
                value={filter.targetCefr}
                onChange={(e) =>
                  setFilter({ ...filter, targetCefr: e.target.value as 'all' | CEFRLevel })
                }
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium">Trạng thái:</span>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    status: e.target.value as 'all' | 'published' | 'draft' | 'archived',
                  })
                }
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả</option>
                <option value="published">Đã phát hành</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of System Decks */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-surface border border-border rounded-xl p-4 shadow-xs hover:shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              {/* Card Top */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {deck.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="text-sm font-extrabold text-text tracking-tight">
                          {deck.title}
                        </h2>
                        {deck.isRecommended && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-reward-light text-[#9A7000] border border-reward/20">
                            Khuyên Dùng
                          </span>
                        )}
                        {deck.isSystemDefault && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted">{deck.titleVi}</div>
                    </div>
                  </div>

                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                    {deck.targetCefr}
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {deck.description}
                </p>

                {/* Template Tag */}
                <div className="flex items-center gap-2 pt-1">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTemplateBadgeClass(
                      deck.templateId
                    )}`}
                  >
                    {getTemplateIcon(deck.templateId)}
                    <span>{deck.templateName}</span>
                  </div>
                </div>

                {/* Source Mapping */}
                {deck.sourceTopicName && (
                  <div className="text-[11px] text-text-muted flex items-center gap-1 truncate">
                    <span>Nguồn:</span>
                    <span className="font-medium text-text truncate">
                      {deck.sourceTopicName}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Bottom Stats & Actions */}
              <div className="mt-4 pt-3 border-t border-border space-y-3">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Quy mô</div>
                    <div className="text-xs font-extrabold text-text font-mono">
                      {deck.noteCount} thẻ
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Người học</div>
                    <div className="text-xs font-extrabold text-text font-mono">
                      {deck.activeLearners.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Hoàn thành</div>
                    <div className="text-xs font-extrabold text-primary font-mono">
                      {deck.completionRate}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInspect(deck)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-surface-subtle hover:bg-primary-light text-text hover:text-primary border border-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Soát Thẻ & Template</span>
                    <ChevronRight size={12} />
                  </button>

                  {onCloneDeck && (
                    <button
                      type="button"
                      onClick={() => onCloneDeck(deck)}
                      className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text"
                      title="Nhân bản bộ bài mẫu này"
                    >
                      <Copy size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredDecks.length === 0 && (
            <div className="col-span-full p-10 text-center text-text-muted">
              Không tìm thấy bộ bài mẫu nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Drawer for Inspecting Deck */}
      <DeckInspectorDrawer
        deck={selectedDeck}
        notes={deckNotes.filter((n) => !selectedDeck || n.deckId === selectedDeck.id)}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onUpdateTemplate={onUpdateDeckTemplate}
        onOpenInStudio={onOpenInStudio}
      />
    </div>
  );
};
