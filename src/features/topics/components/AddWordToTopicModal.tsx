import React, { useState } from 'react';
import { Topic, TopicItem } from '../../../domains/topics/types';
import { CEFRLevel, VocabStatus } from '../../../domains/flashcard/types';
import { X, BookOpen } from 'lucide-react';

interface AddWordToTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic?: Topic;
  onAddWord: (wordData: Omit<TopicItem, 'id' | 'addedAt' | 'orderIndex'>) => void;
}

export const AddWordToTopicModal: React.FC<AddWordToTopicModalProps> = ({
  isOpen,
  onClose,
  currentTopic,
  onAddWord,
}) => {
  const [word, setWord] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [cefr, setCefr] = useState<CEFRLevel>(currentTopic?.targetCefr || 'B1');
  const [definitionVi, setDefinitionVi] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleVi, setExampleVi] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<VocabStatus>('published');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !definitionVi.trim()) {
      alert('Vui lòng nhập từ vựng và định nghĩa tiếng Việt.');
      return;
    }

    onAddWord({
      topicId: currentTopic?.id || 'default',
      topicName: currentTopic?.name,
      word: word.trim(),
      phonetic: phonetic.trim() || `/${word.toLowerCase()}/`,
      partOfSpeech,
      cefr,
      definitionVi: definitionVi.trim(),
      exampleEn: exampleEn.trim(),
      exampleVi: exampleVi.trim(),
      status,
      source: 'TOPIC',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    });

    // Reset form
    setWord('');
    setPhonetic('');
    setDefinitionVi('');
    setExampleEn('');
    setExampleVi('');
    setTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-modal overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text">
                Thêm Từ Vựng Vào Chủ Đề
              </h2>
              <div className="text-[11px] text-text-muted">
                Đang thêm vào: <strong className="text-text">{currentTopic?.name || 'Chủ đề'}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          {/* Word & Phonetic */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Từ Vựng (English) *</label>
              <input
                type="text"
                required
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="VD: resilient"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Phiên Âm (IPA)</label>
              <input
                type="text"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="VD: /rɪˈzɪl.jənt/"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs font-mono text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Part of Speech & CEFR & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Từ Loại</label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="noun">Danh từ (noun)</option>
                <option value="verb">Động từ (verb)</option>
                <option value="adjective">Tính từ (adjective)</option>
                <option value="adverb">Trạng từ (adverb)</option>
                <option value="idiom">Thành ngữ (idiom)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Cấp Độ CEFR</label>
              <select
                value={cefr}
                onChange={(e) => setCefr(e.target.value as CEFRLevel)}
                className="w-full px-2 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Trạng Thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VocabStatus)}
                className="w-full px-2 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="published">Published</option>
                <option value="review">In Review</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-1">
            <label className="font-bold text-text">Định Nghĩa Tiếng Việt *</label>
            <textarea
              rows={2}
              required
              value={definitionVi}
              onChange={(e) => setDefinitionVi(e.target.value)}
              placeholder="Nhập nghĩa tiếng Việt dễ hiểu..."
              className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Context Example EN & VI */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="font-bold text-text">Ví Dụ Ngữ Cảnh (English)</label>
              <input
                type="text"
                value={exampleEn}
                onChange={(e) => setExampleEn(e.target.value)}
                placeholder="VD: Children are often remarkably resilient."
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Bản Dịch Ví Dụ (Vietnamese)</label>
              <input
                type="text"
                value={exampleVi}
                onChange={(e) => setExampleVi(e.target.value)}
                placeholder="VD: Trẻ em thường kiên cường một cách phi thường."
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-text">Tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="VD: mindset, advanced, psychology"
              className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
            >
              Lưu Từ Vựng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
