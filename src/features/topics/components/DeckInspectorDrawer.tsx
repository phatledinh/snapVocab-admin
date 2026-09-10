import React, { useState, useEffect } from 'react';
import { SystemDeck, DeckNote, CardTemplateType } from '../../../domains/topics/types';
import {
  X,
  Volume2,
  ExternalLink,
  Settings2,
} from 'lucide-react';

interface DeckInspectorDrawerProps {
  deck: SystemDeck | null;
  notes: DeckNote[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateTemplate?: (deckId: string, newTemplate: CardTemplateType) => void;
  onOpenInStudio?: (word: string) => void;
}

export const DeckInspectorDrawer: React.FC<DeckInspectorDrawerProps> = ({
  deck,
  notes,
  isOpen,
  onClose,
  onUpdateTemplate,
  onOpenInStudio,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplateType>('CLASSIC');
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(false);

  // Sync state if deck changes
  useEffect(() => {
    if (deck) {
      setSelectedTemplate(deck.templateId);
      setIsPreviewFlipped(false);
    }
  }, [deck?.id, deck?.templateId]);

  if (!isOpen || !deck) return null;

  // SRS Breakdown
  const srsMastered = notes.filter((n) => n.srsState === 'mastered').length;
  const srsReview = notes.filter((n) => n.srsState === 'review').length;
  const srsLearning = notes.filter((n) => n.srsState === 'learning').length;
  const srsNew = notes.filter((n) => n.srsState === 'new').length;
  const totalNotes = notes.length || 1;

  const sampleNote = notes[0] || {
    word: 'agenda',
    phonetic: '/əˈdʒen.də/',
    partOfSpeech: 'noun',
    cefr: 'B1',
    definitionVi: 'chương trình nghị sự cuộc họp',
    exampleEn: 'The first item on the agenda is the financial review.',
  };

  const handleSaveTemplate = () => {
    if (onUpdateTemplate && deck) {
      onUpdateTemplate(deck.id, selectedTemplate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-surface border-l border-border shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{deck.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-text tracking-tight">
                  {deck.title}
                </h2>
                {deck.isRecommended && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-reward-light text-[#9A7000] border border-reward/20">
                    Đề Xuất
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted">{deck.titleVi}</div>
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

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Deck Metadata & Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-subtle border border-border">
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Quy Mô
              </div>
              <div className="text-base font-extrabold text-text font-mono mt-0.5">
                {deck.noteCount} <span className="text-xs font-normal text-text-muted">thẻ</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Người Đang Học
              </div>
              <div className="text-base font-extrabold text-text font-mono mt-0.5">
                {deck.activeLearners.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Tỷ Lệ Hoàn Thành
              </div>
              <div className="text-base font-extrabold text-primary font-mono mt-0.5">
                {deck.completionRate}%
              </div>
            </div>
          </div>

          {/* Section 1: Template Management & Rules */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                <Settings2 size={14} className="text-primary" />
                <span>Card Template Gán Cho Deck</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                1 Deck = 1 Template
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as CardTemplateType)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text font-medium focus:outline-none focus:border-primary"
              >
                <option value="CLASSIC">CLASSIC — Thẻ từ vựng truyền thống chuẩn</option>
                <option value="LISTENING">LISTENING — Ưu tiên phát âm & Phản xạ nghe</option>
                <option value="VISUAL_IMAGE">VISUAL_IMAGE — Hình ảnh trực quan (AI Scan)</option>
                <option value="CLOZE_TYPING">CLOZE_TYPING — Điền khuyết & Gõ từ vựng</option>
                <option value="MINIMAL">MINIMAL — Tối giản tối đa (Zen Mode)</option>
              </select>

              {selectedTemplate !== deck.templateId && (
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  Lưu Đổi
                </button>
              )}
            </div>

            <p className="text-[11px] text-text-muted italic leading-relaxed">
              Theo quy tắc kiến trúc <strong>FR-05.04</strong>: Khi đổi Card Template của bộ bài,
              toàn bộ Card và lịch sử ôn tập SRS (Stability, Retrievability) đều được bảo toàn.
            </p>
          </div>

          {/* Section 2: Live Flashcard Template Layout Preview */}
          <div className="p-3.5 rounded-xl border border-border bg-surface-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text">
                Xem Trước Template ({selectedTemplate})
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewFlipped(!isPreviewFlipped)}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                {isPreviewFlipped ? '← Xem Mặt Trước' : '🔄 Lật Mặt Sau →'}
              </button>
            </div>

            {/* Template Container */}
            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs min-h-[160px] flex flex-col justify-center items-center text-center transition-all">
              {!isPreviewFlipped ? (
                // Front Side
                <div className="space-y-2 w-full">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {sampleNote.cefr} • {sampleNote.partOfSpeech}
                  </span>

                  {selectedTemplate === 'VISUAL_IMAGE' && (
                    <div className="w-20 h-20 rounded-xl bg-snapy-light border border-snapy/30 mx-auto flex items-center justify-center text-2xl">
                      📸
                    </div>
                  )}

                  {selectedTemplate === 'LISTENING' ? (
                    <div className="py-2">
                      <div className="w-12 h-12 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center cursor-pointer shadow-xs animate-bounce">
                        <Volume2 size={20} />
                      </div>
                      <div className="text-[11px] text-text-muted mt-2">
                        [Âm thanh tự động phát — Ẩn chữ để luyện nghe]
                      </div>
                    </div>
                  ) : selectedTemplate === 'CLOZE_TYPING' ? (
                    <div className="space-y-2 py-1">
                      <div className="text-sm text-text font-medium">
                        "The first item on the <span className="font-bold underline text-primary">[ ...... ]</span> is the financial review."
                      </div>
                      <div className="text-[11px] text-text-muted">
                        (Nhập từ vựng tiếng Anh vào ô trống)
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-2xl font-black text-text tracking-tight">
                        {sampleNote.word}
                      </div>
                      <div className="text-xs font-mono text-text-muted">
                        {sampleNote.phonetic}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Back Side
                <div className="space-y-2 w-full">
                  <div className="text-sm font-bold text-text">
                    {sampleNote.word}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {sampleNote.definitionVi}
                  </div>
                  <div className="text-xs text-text-muted italic max-w-xs mx-auto">
                    "{sampleNote.exampleEn}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: SRS Distribution Breakdown */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-text">
              <span>Phân Bổ Tiến Độ Thuộc Thẻ (SRS States)</span>
              <span className="font-mono text-text-muted">{notes.length} thẻ ghi nhận</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="h-3 w-full rounded-full bg-surface-subtle overflow-hidden flex border border-border/50">
              <div
                style={{ width: `${(srsMastered / totalNotes) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Mastered: ${srsMastered}`}
              />
              <div
                style={{ width: `${(srsReview / totalNotes) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Review: ${srsReview}`}
              />
              <div
                style={{ width: `${(srsLearning / totalNotes) * 100}%` }}
                className="bg-blue-500 h-full"
                title={`Learning: ${srsLearning}`}
              />
              <div
                style={{ width: `${(srsNew / totalNotes) * 100}%` }}
                className="bg-slate-300 h-full"
                title={`New: ${srsNew}`}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-4 gap-1 text-[11px] text-text-muted pt-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Thuộc ({srsMastered})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Cần ôn ({srsReview})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Đang học ({srsLearning})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Mới ({srsNew})</span>
              </div>
            </div>
          </div>

          {/* Section 4: Notes List in this Deck */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text">
              <span>Danh Sách Thẻ Trong Bộ Bài ({notes.length})</span>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl bg-surface overflow-hidden text-xs">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 flex items-center justify-between hover:bg-surface-subtle/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-text">{note.word}</span>
                      <span className="text-[10px] font-mono text-text-muted">
                        {note.phonetic}
                      </span>
                      <span className="text-[9px] px-1 rounded bg-surface-subtle font-mono text-text-muted">
                        {note.cefr}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight">
                      {note.definitionVi}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                        note.srsState === 'mastered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : note.srsState === 'review'
                          ? 'bg-amber-50 text-amber-700'
                          : note.srsState === 'learning'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {note.srsState.toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenInStudio && onOpenInStudio(note.word)}
                      className="p-1 text-text-muted hover:text-primary rounded hover:bg-surface-subtle"
                      title="Mở trong Content Studio"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="p-4 text-center text-xs text-text-muted">
                  Bộ bài chưa có thẻ học nào.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-border bg-surface flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text shadow-xs"
          >
            Đóng Khung Soát Thẻ
          </button>
        </div>
      </div>
    </div>
  );
};
