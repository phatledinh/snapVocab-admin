import React, { useState } from 'react';
import { TopicItem, TopicFilterState } from '../../../domains/topics/types';
import { CEFRLevel, VocabStatus } from '../../../domains/flashcard/types';
import {
  Search,
  Volume2,
  ExternalLink,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface TopicItemsTableProps {
  items: TopicItem[];
  filter: TopicFilterState;
  onFilterChange: (newFilter: Partial<TopicFilterState>) => void;
  onOpenInStudio?: (word: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onBulkStatusChange?: (itemIds: string[], newStatus: VocabStatus) => void;
  onBulkRemove?: (itemIds: string[]) => void;
  onAddNewWord?: () => void;
}

export const TopicItemsTable: React.FC<TopicItemsTableProps> = ({
  items,
  filter,
  onFilterChange,
  onOpenInStudio,
  onRemoveItem,
  onBulkStatusChange,
  onBulkRemove,
  onAddNewWord,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Play audio via Web Speech API or Audio Element
  const handlePlayAudio = (word: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis API.');
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingWord(word);

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setPlayingWord(null);
    };

    utterance.onerror = () => {
      setPlayingWord(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CEFR color mapping
  const getCefrBadgeClass = (cefr: CEFRLevel) => {
    switch (cefr) {
      case 'A1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'A2':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'B1':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B2':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'C1':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'C2':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Status badge mapping
  const getStatusBadge = (status: VocabStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-light text-primary border border-primary/20">
            <CheckCircle size={10} />
            <span>Published</span>
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle size={10} />
            <span>In Review</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock size={10} />
            <span>Draft</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span>Archived</span>
          </span>
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-surface overflow-hidden">
      {/* Table Toolbar & Multi-Layer Filters */}
      <div className="p-3 border-b border-border space-y-2 bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Tìm từ vựng, IPA, nghĩa tiếng Việt..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:bg-surface transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* CEFR Level */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-text-muted text-[11px] font-medium">CEFR:</span>
              <select
                value={filter.cefrLevel}
                onChange={(e) =>
                  onFilterChange({ cefrLevel: e.target.value as 'all' | CEFRLevel })
                }
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-text-muted text-[11px] font-medium">Trạng thái:</span>
              <select
                value={filter.status}
                onChange={(e) =>
                  onFilterChange({ status: e.target.value as 'all' | VocabStatus })
                }
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả</option>
                <option value="published">Published</option>
                <option value="review">In Review</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Part of Speech */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-text-muted text-[11px] font-medium">Từ loại:</span>
              <select
                value={filter.partOfSpeech}
                onChange={(e) => onFilterChange({ partOfSpeech: e.target.value })}
                className="px-2 py-1 rounded-md bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="all">Tất cả</option>
                <option value="noun">Danh từ (n)</option>
                <option value="verb">Động từ (v)</option>
                <option value="adjective">Tính từ (adj)</option>
                <option value="adverb">Trạng từ (adv)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar (When rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary-light border border-primary/20 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary font-mono">
                Đã chọn {selectedIds.length} / {items.length} từ
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onBulkStatusChange) onBulkStatusChange(selectedIds, 'published');
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-all shadow-xs"
              >
                Duyệt Xuất Bản ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onBulkStatusChange) onBulkStatusChange(selectedIds, 'review');
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs"
              >
                Chuyển Review
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onBulkRemove) onBulkRemove(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded bg-danger hover:bg-danger-hover text-white text-[11px] font-bold transition-all shadow-xs"
              >
                Gỡ Khỏi Topic
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 rounded bg-surface border border-border text-text-muted hover:text-text text-[11px] transition-all"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data-Dense Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          {/* Table Header */}
          <thead className="sticky top-0 bg-surface-subtle border-b border-border z-10 text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
            <tr>
              <th className="p-2.5 w-10 text-center">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-text-muted hover:text-text"
                >
                  {selectedIds.length === items.length && items.length > 0 ? (
                    <CheckSquare size={14} className="text-primary" />
                  ) : (
                    <Square size={14} />
                  )}
                </button>
              </th>
              <th className="p-2.5 w-48">Từ Vựng & Phát Âm</th>
              <th className="p-2.5 w-20 text-center">CEFR</th>
              <th className="p-2.5">Nghĩa Tiếng Việt & Ngữ Cảnh</th>
              <th className="p-2.5 w-24 text-center">Media / TTS</th>
              <th className="p-2.5 w-28 text-center">Trạng Thái</th>
              <th className="p-2.5 w-32 text-right">Thao Tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              const isPlaying = playingWord === item.word;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-surface-subtle/50 transition-colors ${
                    isChecked ? 'bg-primary-light/30' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleRow(item.id)}
                      className="text-text-muted hover:text-text"
                    >
                      {isChecked ? (
                        <CheckSquare size={14} className="text-primary" />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </td>

                  {/* Word & Phonetic */}
                  <td className="p-2.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-text">
                          {item.word}
                        </span>
                        <span className="text-[10px] px-1 rounded bg-surface-subtle text-text-muted font-medium uppercase">
                          {item.partOfSpeech}
                        </span>
                        {item.source === 'SCAN' && (
                          <span className="text-[9px] px-1 rounded bg-snapy-light text-snapy font-bold">
                            SCAN
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-text-muted">
                        {item.phonetic}
                      </span>
                    </div>
                  </td>

                  {/* CEFR Badge */}
                  <td className="p-2.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getCefrBadgeClass(
                        item.cefr
                      )}`}
                    >
                      {item.cefr}
                    </span>
                  </td>

                  {/* Definition & Examples */}
                  <td className="p-2.5 max-w-md">
                    <div className="space-y-0.5">
                      <div className="font-medium text-text text-xs leading-snug">
                        {item.definitionVi}
                      </div>
                      {item.exampleEn && (
                        <div className="text-[11px] text-text-muted italic leading-relaxed">
                          "{item.exampleEn}"
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Audio / Media */}
                  <td className="p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Audio Button */}
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.word)}
                        className={`p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors ${
                          isPlaying ? 'text-primary animate-pulse border-primary' : 'text-text-muted'
                        }`}
                        title="Nghe phát âm chuẩn US"
                      >
                        <Volume2 size={13} />
                      </button>

                      {/* Image Thumbnail */}
                      {item.imageUrl ? (
                        <div className="w-7 h-7 rounded border border-border overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.word}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-text-light font-mono">—</span>
                      )}
                    </div>
                  </td>

                  {/* Operational Status */}
                  <td className="p-2.5 text-center">{getStatusBadge(item.status)}</td>

                  {/* Actions */}
                  <td className="p-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Open in Content Studio */}
                      <button
                        type="button"
                        onClick={() => onOpenInStudio && onOpenInStudio(item.word)}
                        className="px-2 py-1 rounded bg-surface hover:bg-primary-light border border-border hover:border-primary/40 text-text-muted hover:text-primary text-[11px] font-medium flex items-center gap-1 transition-all shadow-xs"
                        title="Mở trong Split-Screen Content Studio"
                      >
                        <ExternalLink size={11} />
                        <span>Studio</span>
                      </button>

                      {/* Remove from Topic */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem && onRemoveItem(item.id)}
                        className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger-light/30 transition-colors"
                        title="Gỡ khỏi chủ đề này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-muted select-none">
                  <div className="max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-subtle text-text-muted flex items-center justify-center mx-auto border border-border">
                      <Search size={18} />
                    </div>
                    <div className="font-bold text-text text-sm">
                      Không tìm thấy từ vựng nào
                    </div>
                    <p className="text-xs text-text-muted">
                      Chưa có từ nào khớp với bộ lọc hiện tại hoặc chủ đề chưa được gán từ vựng.
                    </p>
                    {onAddNewWord && (
                      <button
                        type="button"
                        onClick={onAddNewWord}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
                      >
                        + Thêm Từ Vào Chủ Đề Này
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-2.5 border-t border-border bg-surface-subtle/50 flex items-center justify-between text-xs text-text-muted">
        <div>
          Tổng cộng: <span className="font-bold text-text font-mono">{items.length}</span> từ vựng
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>
            Nhấp <strong>Studio</strong> để mở trình biên tập kèm Mobile Simulator
          </span>
        </div>
      </div>
    </div>
  );
};
