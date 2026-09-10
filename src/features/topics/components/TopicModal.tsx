import React, { useState, useEffect } from 'react';
import { Collection, Topic } from '../../../domains/topics/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import { X, FolderTree, CheckCircle } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTopic: (topicData: Partial<Topic>) => void;
  collections: Collection[];
  topics: Topic[];
  editingTopic?: Topic | null;
  defaultParentId?: string;
  defaultCollectionId?: string;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  onSaveTopic,
  collections,
  topics,
  editingTopic,
  defaultParentId,
  defaultCollectionId,
}) => {
  const [name, setName] = useState('');
  const [nameVi, setNameVi] = useState('');
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '');
  const [parentId, setParentId] = useState<string>('');
  const [targetCefr, setTargetCefr] = useState<CEFRLevel>('B1');
  const [icon, setIcon] = useState('📁');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    if (editingTopic) {
      setName(editingTopic.name);
      setNameVi(editingTopic.nameVi);
      setCollectionId(editingTopic.collectionId);
      setParentId(editingTopic.parentId || '');
      setTargetCefr(editingTopic.targetCefr);
      setIcon(editingTopic.icon);
      setDescription(editingTopic.description);
      setStatus(editingTopic.status === 'published' ? 'published' : 'draft');
    } else {
      setName('');
      setNameVi('');
      setCollectionId(defaultCollectionId || collections[0]?.id || '');
      setParentId(defaultParentId || '');
      setTargetCefr('B1');
      setIcon('📁');
      setDescription('');
      setStatus('published');
    }
  }, [editingTopic, defaultParentId, defaultCollectionId, collections, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên chủ đề (tiếng Anh).');
      return;
    }

    const selectedCol = collections.find((c) => c.id === collectionId);

    onSaveTopic({
      id: editingTopic?.id,
      name,
      nameVi: nameVi || name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      collectionId,
      collectionName: selectedCol?.name || 'Collection',
      parentId: parentId || undefined,
      targetCefr,
      icon,
      description,
      status,
    });
    onClose();
  };

  // Filter possible parent topics (cannot be itself)
  const availableParents = topics.filter(
    (t) => t.collectionId === collectionId && (!editingTopic || t.id !== editingTopic.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-modal overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <FolderTree size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text">
                {editingTopic ? 'Chỉnh Sửa Chủ Đề (Edit Topic)' : 'Tạo Chủ Đề Mới (New Topic)'}
              </h2>
              <div className="text-[11px] text-text-muted">
                Cấu hình phân cấp cây và đối tượng CEFR mục tiêu
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
          {/* Collection Select */}
          <div className="space-y-1">
            <label className="font-bold text-text">Thuộc Bộ Sưu Tập (Collection)</label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name} ({c.nameVi})
                </option>
              ))}
            </select>
          </div>

          {/* Parent Topic Select (Hierarchical Tree) */}
          <div className="space-y-1">
            <label className="font-bold text-text">
              Chủ Đề Cha (Parent Topic) — <span className="font-normal text-text-muted">Để trống nếu là chủ đề gốc</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
            >
              <option value="">(Không có — Đây là Chủ đề Cấp 1)</option>
              {availableParents.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name} (Cấp 1)
                </option>
              ))}
            </select>
          </div>

          {/* Topic Title EN & VI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Tên Chủ Đề (EN) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Meetings & Presentations"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Tên Tiếng Việt (VI)</label>
              <input
                type="text"
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
                placeholder="VD: Họp hành & Thuyết trình"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Icon & CEFR & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text">Biểu Tượng (Icon)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="VD: 🏢, ☕, 💼"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text">Target CEFR</label>
              <select
                value={targetCefr}
                onChange={(e) => setTargetCefr(e.target.value as CEFRLevel)}
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
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="w-full px-2 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="published">Xuất bản (Live)</option>
                <option value="draft">Bản nháp (Draft)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-text">Mô Tả Chủ Đề</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt ngắn gọn các nội dung trọng tâm của chủ đề này..."
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
              {editingTopic ? 'Cập Nhật Chủ Đề' : 'Tạo Chủ Đề'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
