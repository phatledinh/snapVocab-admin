import React, { useState } from 'react';
import { CardTemplate, DeckTemplateMapping } from '../../../domains/templates/types';
import {
  X,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface AssignTemplateDeckModalProps {
  template: CardTemplate | null;
  decks: DeckTemplateMapping[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmAssign: (templateId: string, deckIds: string[]) => void;
}

export const AssignTemplateDeckModal: React.FC<AssignTemplateDeckModalProps> = ({
  template,
  decks,
  isOpen,
  onClose,
  onConfirmAssign,
}) => {
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !template) return null;

  const filteredDecks = decks.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return d.deckTitle.toLowerCase().includes(q) || d.deckTitleVi.toLowerCase().includes(q);
  });

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId) ? prev.filter((id) => id !== deckId) : [...prev, deckId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDeckIds.length === filteredDecks.length) {
      setSelectedDeckIds([]);
    } else {
      setSelectedDeckIds(filteredDecks.map((d) => d.deckId));
    }
  };

  const handleSave = () => {
    if (selectedDeckIds.length === 0) return;
    onConfirmAssign(template.id, selectedDeckIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-modal z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-light text-primary">
              <Bookmark size={16} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-text tracking-tight">
                Gán Template Cho Bộ Bài (Deck)
              </h3>
              <p className="text-xs text-text-muted">
                Áp dụng mẫu <span className="font-bold text-primary">{template.name}</span> ({template.code})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>
            <strong>Bảo toàn SRS:</strong> Thay đổi template chỉ thay đổi giao diện hiển thị flashcard, tiến độ học và FSRS log của học viên được giữ nguyên 100%.
          </span>
        </div>

        {/* Search & Select All */}
        <div className="p-3 border-b border-border bg-background flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bộ bài..."
              className="w-full pl-7.5 pr-2.5 py-1 rounded-md border border-border text-xs text-text bg-surface focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1 rounded-md bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text shadow-2xs"
          >
            {selectedDeckIds.length === filteredDecks.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
          </button>
        </div>

        {/* Deck List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1.5 max-h-[340px]">
          {filteredDecks.map((deck) => {
            const isChecked = selectedDeckIds.includes(deck.deckId);
            const isCurrentlyUsing = deck.currentTemplateId === template.id;

            return (
              <div
                key={deck.deckId}
                onClick={() => toggleDeck(deck.deckId)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'border-primary bg-primary-light/30 shadow-2xs'
                    : 'border-border bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="text-xl">{deck.deckIcon}</span>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text truncate">{deck.deckTitle}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-surface-subtle text-text-muted border border-border">
                        {deck.targetCefr}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted flex items-center gap-2">
                      <span>{deck.noteCount} từ</span>
                      <span>•</span>
                      <span>Mẫu hiện tại: {deck.currentTemplateName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2 shrink-0">
                  {isCurrentlyUsing && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Đang dùng
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded text-primary focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-background flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Đã chọn: <strong className="text-text">{selectedDeckIds.length}</strong> bộ bài
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-surface transition-all"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={selectedDeckIds.length === 0}
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40"
            >
              Áp Dụng Cho {selectedDeckIds.length} Decks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
