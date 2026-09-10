import React, { useState } from 'react';
import {
  Save,
  Send,
  CheckCircle,
  Archive,
  History,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Tag,
  BookOpen,
} from 'lucide-react';
import {
  CardViewModel,
  VocabStatus,
  CEFRLevel,
  CardSource,
  CardMeaning,
  CardExample,
} from '../../domains/flashcard/types';
import { AudioPreviewTester } from './AudioPreviewTester';
import { AuditModal } from './AuditModal';

interface WordEditorProps {
  card: CardViewModel;
  onUpdateCard: (updated: CardViewModel) => void;
  onStatusTransition: (newStatus: VocabStatus, reason: string) => void;
}

const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'idiom',
  'phrase',
];

const CEFR_OPTIONS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SOURCE_OPTIONS: CardSource[] = ['DICT', 'SCAN', 'TOPIC', 'AI'];

export const WordEditor: React.FC<WordEditorProps> = ({
  card,
  onUpdateCard,
  onStatusTransition,
}) => {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<VocabStatus>(card.status);
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  // Field change helpers
  const handleFieldChange = <K extends keyof CardViewModel>(
    field: K,
    value: CardViewModel[K]
  ) => {
    onUpdateCard({
      ...card,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleMeaningChange = (index: number, updatedMeaning: CardMeaning) => {
    const updatedMeanings = [...card.meanings];
    updatedMeanings[index] = updatedMeaning;
    handleFieldChange('meanings', updatedMeanings);
  };

  const handleAddExample = (meaningIndex: number) => {
    const meaning = card.meanings[meaningIndex];
    if (!meaning) return;

    const newEx: CardExample = {
      id: `ex-${Date.now()}`,
      en: '',
      vi: '',
    };

    handleMeaningChange(meaningIndex, {
      ...meaning,
      examples: [...meaning.examples, newEx],
    });
  };

  const handleRemoveExample = (meaningIndex: number, exIndex: number) => {
    const meaning = card.meanings[meaningIndex];
    if (!meaning) return;

    const updatedExamples = meaning.examples.filter((_, idx) => idx !== exIndex);
    handleMeaningChange(meaningIndex, {
      ...meaning,
      examples: updatedExamples,
    });
  };

  const handleInitiateStatusChange = (next: VocabStatus) => {
    setTargetStatus(next);
    setShowAuditModal(true);
  };

  const handleConfirmAudit = (reason: string) => {
    setShowAuditModal(false);
    onStatusTransition(targetStatus, reason);
  };

  const primaryMeaning = card.meanings[0] || {
    id: 'm-default',
    partOfSpeech: card.partOfSpeech || 'noun',
    definitionVi: '',
    definitionEn: '',
    examples: [],
  };

  return (
    <div className="h-full flex flex-col bg-surface select-none">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-text font-mono tracking-tight">
                {card.word || 'Từ mới'}
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                  card.status === 'published'
                    ? 'bg-primary-light text-primary'
                    : card.status === 'review'
                    ? 'bg-info-light text-info'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {card.status}
              </span>
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              ID: <span className="font-mono">{card.id}</span> · Cập nhật:{' '}
              {new Date(card.lastUpdated).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* Audit History Toggle */}
        <button
          type="button"
          onClick={() => setShowAuditHistory(!showAuditHistory)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            showAuditHistory
              ? 'bg-primary-light text-primary border-primary/30 font-bold'
              : 'border-border text-text-muted hover:bg-surface-subtle hover:text-text'
          }`}
        >
          <History size={14} />
          <span>Audit Log ({card.auditHistory?.length || 0})</span>
        </button>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Audit History Drawer if open */}
        {showAuditHistory && (
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border space-y-2.5 mb-2">
            <div className="text-xs font-bold text-text flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              <span>Nhật ký kiểm toán (Audit Trail)</span>
            </div>
            {card.auditHistory && card.auditHistory.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {card.auditHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2 bg-surface rounded-lg border border-border/80 text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-text-muted">
                      <span className="font-semibold text-text">{rec.changedBy}</span>
                      <span className="font-mono">
                        {new Date(rec.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-text font-medium italic">"{rec.reason}"</p>
                    <div className="text-[10px] text-text-muted">
                      Hành động: <span className="font-mono font-bold text-primary">{rec.action}</span>
                      {rec.previousStatus && rec.nextStatus && (
                        <span> ({rec.previousStatus} ➔ {rec.nextStatus})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">Chưa có bản ghi kiểm toán nào.</p>
            )}
          </div>
        )}

        {/* Section 1: Basic Identity */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-text">Từ vựng (Word Name) *</label>
            <input
              type="text"
              value={card.word}
              onChange={(e) => handleFieldChange('word', e.target.value)}
              placeholder="e.g. resilient"
              className="w-full text-sm font-semibold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Từ loại (Part of Speech)</label>
            <select
              value={card.partOfSpeech}
              onChange={(e) => handleFieldChange('partOfSpeech', e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PARTS_OF_SPEECH.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Trình độ (CEFR)</label>
            <select
              value={card.cefr}
              onChange={(e) => handleFieldChange('cefr', e.target.value as CEFRLevel)}
              className="w-full text-xs font-mono font-bold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CEFR_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Phonetic & Source */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-text">Phiên âm IPA (Phonetic)</label>
            <input
              type="text"
              value={card.phonetic}
              onChange={(e) => handleFieldChange('phonetic', e.target.value)}
              placeholder="/rɪˈzɪl.jənt/"
              className="w-full text-xs font-mono p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Nguồn dữ liệu (Source)</label>
            <select
              value={card.source}
              onChange={(e) => handleFieldChange('source', e.target.value as CardSource)}
              className="w-full text-xs font-semibold p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: Audio Tester Component */}
        <AudioPreviewTester
          word={card.word}
          config={card.audio}
          onChange={(newAudio) => handleFieldChange('audio', newAudio)}
        />

        {/* Section 4: Image Media URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text flex items-center justify-between">
            <span>Ảnh minh họa (Illustration / Object Image URL)</span>
            <span className="text-[11px] text-text-muted">Unsplash hoặc CDN SnapVocab</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={card.media?.imageUrl || ''}
              onChange={(e) =>
                handleFieldChange('media', {
                  ...card.media,
                  imageUrl: e.target.value,
                })
              }
              placeholder="https://images.unsplash.com/..."
              className="flex-1 text-xs p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {card.media?.imageUrl && (
              <a
                href={card.media.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-subtle"
                title="Mở ảnh gốc"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Section 5: Meanings & Definitions */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-primary" />
              <span>Định nghĩa & Diễn giải</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Nghĩa tiếng Việt *</label>
            <textarea
              rows={2}
              value={primaryMeaning.definitionVi}
              onChange={(e) =>
                handleMeaningChange(0, {
                  ...primaryMeaning,
                  definitionVi: e.target.value,
                })
              }
              placeholder="Định nghĩa tiếng Việt dễ hiểu cho người học..."
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Định nghĩa tiếng Anh (English Definition)</label>
            <textarea
              rows={2}
              value={primaryMeaning.definitionEn || ''}
              onChange={(e) =>
                handleMeaningChange(0, {
                  ...primaryMeaning,
                  definitionEn: e.target.value,
                })
              }
              placeholder="English dictionary definition..."
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Bilingual Examples */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text">
                Câu ví dụ ngữ cảnh ({primaryMeaning.examples.length})
              </label>
              <button
                type="button"
                onClick={() => handleAddExample(0)}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover"
              >
                <Plus size={12} />
                <span>Thêm câu ví dụ</span>
              </button>
            </div>

            {primaryMeaning.examples.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className="p-2.5 bg-surface-subtle/70 rounded-lg border border-border space-y-1.5 relative group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-text-muted">
                    #{exIdx + 1} EN:
                  </span>
                  <input
                    type="text"
                    value={ex.en}
                    onChange={(e) => {
                      const updated = [...primaryMeaning.examples];
                      updated[exIdx] = { ...ex, en: e.target.value };
                      handleMeaningChange(0, { ...primaryMeaning, examples: updated });
                    }}
                    placeholder="Sentence in English..."
                    className="flex-1 text-xs p-1.5 rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExample(0, exIdx)}
                    className="text-text-muted hover:text-danger p-1 rounded hover:bg-surface"
                    title="Xóa câu ví dụ"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-text-muted">
                    #{exIdx + 1} VI:
                  </span>
                  <input
                    type="text"
                    value={ex.vi}
                    onChange={(e) => {
                      const updated = [...primaryMeaning.examples];
                      updated[exIdx] = { ...ex, vi: e.target.value };
                      handleMeaningChange(0, { ...primaryMeaning, examples: updated });
                    }}
                    placeholder="Dịch nghĩa tiếng Việt..."
                    className="flex-1 text-xs p-1.5 rounded bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Tags & Metadata */}
        <div className="space-y-1 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-text flex items-center gap-1.5">
            <Tag size={13} className="text-text-muted" />
            <span>Thẻ từ khóa (Tags - phân tách bằng dấu phẩy)</span>
          </label>
          <input
            type="text"
            value={card.tags.join(', ')}
            onChange={(e) =>
              handleFieldChange(
                'tags',
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="toeic, business, daily, fruit..."
            className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Bottom Action / State Machine Bar */}
      <div className="p-3.5 border-t border-border bg-surface-subtle/50 flex items-center justify-between">
        <div className="text-xs text-text-muted flex items-center gap-2">
          <span>Quy trình vận hành:</span>
          <span className="font-mono text-[11px] font-bold text-text">
            {card.status === 'draft' && 'Draft ➔ In Review'}
            {card.status === 'review' && 'Review ➔ Published'}
            {card.status === 'published' && 'Published (Live)'}
            {card.status === 'archived' && 'Archived'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {card.status !== 'draft' && (
            <button
              type="button"
              onClick={() => handleInitiateStatusChange('draft')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-surface border border-border transition-all"
            >
              Về Bản nháp
            </button>
          )}

          {card.status === 'draft' && (
            <button
              type="button"
              onClick={() => handleInitiateStatusChange('review')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-info text-white hover:bg-info-hover shadow-sm transition-all"
            >
              <Send size={13} />
              <span>Gửi Kiểm duyệt (Review)</span>
            </button>
          )}

          {card.status === 'review' && (
            <button
              type="button"
              onClick={() => handleInitiateStatusChange('published')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all"
            >
              <CheckCircle size={14} />
              <span>Duyệt & Xuất bản (Publish)</span>
            </button>
          )}

          {card.status === 'published' && (
            <button
              type="button"
              onClick={() => handleInitiateStatusChange('archived')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger-light border border-danger/30 transition-all"
            >
              <Archive size={13} />
              <span>Lưu trữ (Archive)</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Reason Modal */}
      <AuditModal
        isOpen={showAuditModal}
        word={card.word}
        currentStatus={card.status}
        targetStatus={targetStatus}
        onConfirm={handleConfirmAudit}
        onCancel={() => setShowAuditModal(false)}
      />
    </div>
  );
};
