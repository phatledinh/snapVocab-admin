import React, { useState, useEffect } from 'react';
import { Topic, SystemDeck, CardTemplateType } from '../../../domains/topics/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import { X, Layers, CheckCircle } from 'lucide-react';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDeck: (deckData: Partial<SystemDeck>) => void;
  topics: Topic[];
  editingDeck?: SystemDeck | null;
  prefilledTopic?: Topic | null;
}

export const DeckModal: React.FC<DeckModalProps> = ({
  isOpen,
  onClose,
  onSaveDeck,
  topics,
  editingDeck,
  prefilledTopic,
}) => {
  const [title, setTitle] = useState('');
  const [titleVi, setTitleVi] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📦');
  const [templateId, setTemplateId] = useState<CardTemplateType>('CLASSIC');
  const [targetCefr, setTargetCefr] = useState<CEFRLevel>('B1');
  const [sourceTopicId, setSourceTopicId] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState(true);
  const [isSystemDefault, setIsSystemDefault] = useState(false);

  useEffect(() => {
    if (editingDeck) {
      setTitle(editingDeck.title);
      setTitleVi(editingDeck.titleVi);
      setDescription(editingDeck.description);
      setIcon(editingDeck.icon);
      setTemplateId(editingDeck.templateId);
      setTargetCefr(editingDeck.targetCefr);
      setSourceTopicId(editingDeck.sourceTopicId || '');
      setIsRecommended(editingDeck.isRecommended);
      setIsSystemDefault(editingDeck.isSystemDefault);
    } else if (prefilledTopic) {
      setTitle(`${prefilledTopic.name} Starter Deck`);
      setTitleVi(`Bộ Bài Khởi Động ${prefilledTopic.nameVi}`);
      setDescription(`Bộ thẻ rèn luyện từ vựng nền tảng thuộc chủ đề ${prefilledTopic.name}.`);
      setIcon(prefilledTopic.icon || '📦');
      setTemplateId('CLASSIC');
      setTargetCefr(prefilledTopic.targetCefr);
      setSourceTopicId(prefilledTopic.id);
      setIsRecommended(true);
      setIsSystemDefault(false);
    } else {
      setTitle('');
      setTitleVi('');
      setDescription('');
      setIcon('📦');
      setTemplateId('CLASSIC');
      setTargetCefr('B1');
      setSourceTopicId(topics[0]?.id || '');
      setIsRecommended(true);
      setIsSystemDefault(false);
    }
  }, [editingDeck, prefilledTopic, topics, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên bộ bài.');
      return;
    }

    const selectedTopic = topics.find((t) => t.id === sourceTopicId);

    const templateNames: Record<CardTemplateType, string> = {
      CLASSIC: 'Classic Flashcard Layout',
      LISTENING: 'Audio-First Listening Focus',
      VISUAL_IMAGE: 'Visual Image Hero Layout',
      CLOZE_TYPING: 'Cloze Deletion & Typing Practice',
      MINIMAL: 'Minimal Zen Reader',
    };

    onSaveDeck({
      id: editingDeck?.id,
      title,
      titleVi: titleVi || title,
      description,
      icon,
      templateId,
      templateName: templateNames[templateId],
      targetCefr,
      sourceTopicId,
      sourceTopicName: selectedTopic?.name,
      sourceCollectionId: selectedTopic?.collectionId,
      sourceCollectionName: selectedTopic?.collectionName,
      isRecommended,
      isSystemDefault,
      status: 'published',
      noteCount: editingDeck?.noteCount || (selectedTopic ? selectedTopic.wordCount : 25),
      activeLearners: editingDeck?.activeLearners || 0,
      completionRate: editingDeck?.completionRate || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-modal overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-reward-light text-[#9A7000] flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text">
                {editingDeck ? 'Chỉnh Sửa Starter Deck' : 'Tạo Bộ Bài Mẫu Mới (Curated Deck)'}
              </h2>
              <div className="text-[11px] text-text-muted">
                Gán Card Template và liên kết nguồn dữ liệu theo Canonical model
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
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Deck Title EN & VI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Tên Bộ Bài (EN) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: TOEIC 600 Core Starter Deck"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Tên Tiếng Việt (VI)</label>
              <input
                type="text"
                value={titleVi}
                onChange={(e) => setTitleVi(e.target.value)}
                placeholder="VD: Bộ Bài Khởi Động TOEIC 600"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Card Template Selection */}
          <div className="space-y-1">
            <label className="font-bold text-text flex items-center justify-between">
              <span>Card Template Áp Dụng Cho Bộ Bài</span>
              <span className="font-mono text-primary text-[10px]">1 Deck = 1 Template</span>
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as CardTemplateType)}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-text font-medium focus:outline-none focus:border-primary"
            >
              <option value="CLASSIC">CLASSIC — Thẻ lật từ vựng tiêu chuẩn</option>
              <option value="LISTENING">LISTENING — Ưu tiên phát âm & Phản xạ nghe</option>
              <option value="VISUAL_IMAGE">VISUAL_IMAGE — Trực quan hình ảnh AI</option>
              <option value="CLOZE_TYPING">CLOZE_TYPING — Điền khuyết & Gõ từ</option>
              <option value="MINIMAL">MINIMAL — Đọc tối giản kiểu Zen</option>
            </select>
          </div>

          {/* Source Topic & CEFR */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Liên Kết Chủ Đề Nguồn</label>
              <select
                value={sourceTopicId}
                onChange={(e) => setSourceTopicId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="">(Không liên kết chủ đề cụ thể)</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Target CEFR</label>
              <select
                value={targetCefr}
                onChange={(e) => setTargetCefr(e.target.value as CEFRLevel)}
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          {/* Description & Icon */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="font-bold text-text">Biểu Tượng</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📦"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text text-center focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-3 space-y-1">
              <label className="font-bold text-text">Mô Tả Bộ Bài</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mục đích học tập, đối tượng phù hợp..."
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-semibold text-text">Gợi ý cho người mới (Recommended)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSystemDefault}
                onChange={(e) => setIsSystemDefault(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-semibold text-text">Bộ bài mặc định hệ thống</span>
            </label>
          </div>

          {/* Action buttons */}
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
              {editingDeck ? 'Cập Nhật Bộ Bài' : 'Tạo Starter Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
