import React from 'react';
import { Collection, Topic, TopicItem, TopicFilterState } from '../../../domains/topics/types';
import { VocabStatus } from '../../../domains/flashcard/types';
import { TopicItemsTable } from './TopicItemsTable';
import {
  Folder,
  Layers,
  Plus,
  Edit,
  Download,
  Users,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

interface TopicDetailViewProps {
  currentCollection?: Collection;
  currentTopic?: Topic;
  parentTopic?: Topic;
  items: TopicItem[];
  filter: TopicFilterState;
  onFilterChange: (newFilter: Partial<TopicFilterState>) => void;
  onOpenInStudio?: (word: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onBulkStatusChange?: (itemIds: string[], newStatus: VocabStatus) => void;
  onBulkRemove?: (itemIds: string[]) => void;
  onOpenAddWordModal: () => void;
  onOpenEditTopicModal: (topic: Topic) => void;
  onOpenCreateDeckModal: (topic: Topic) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  currentCollection,
  currentTopic,
  parentTopic,
  items,
  filter,
  onFilterChange,
  onOpenInStudio,
  onRemoveItem,
  onBulkStatusChange,
  onBulkRemove,
  onOpenAddWordModal,
  onOpenEditTopicModal,
  onOpenCreateDeckModal,
}) => {
  // Export Topic Items to CSV
  const handleExportCsv = () => {
    if (!currentTopic || items.length === 0) return;

    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Word,Phonetic,Part of Speech,CEFR,Vietnamese Definition,English Example,Vietnamese Example,Status,Added At\n';

    items.forEach((item) => {
      const row = [
        `"${item.word}"`,
        `"${item.phonetic}"`,
        `"${item.partOfSpeech}"`,
        `"${item.cefr}"`,
        `"${item.definitionVi.replace(/"/g, '""')}"`,
        `"${item.exampleEn.replace(/"/g, '""')}"`,
        `"${item.exampleVi.replace(/"/g, '""')}"`,
        `"${item.status}"`,
        `"${item.addedAt}"`,
      ].join(',');
      csv += row + '\n';
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `snapvocab_topic_${currentTopic.slug || currentTopic.id}_words.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentTopic) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 text-center bg-surface text-text-muted select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto text-text-muted">
            <Folder size={24} />
          </div>
          <div className="text-sm font-bold text-text">Chưa Chọn Chủ Đề</div>
          <p className="text-xs text-text-muted">
            Vui lòng chọn một chủ đề từ cây thư mục bên trái để xem và quản trị danh sách từ vựng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-surface overflow-hidden">
      {/* Top Breadcrumb & Metadata Banner */}
      <div className="p-4 border-b border-border bg-surface select-none">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
          <span>{currentCollection?.icon || '📁'}</span>
          <span className="font-semibold text-text truncate max-w-[200px]">
            {currentCollection?.name || 'Bộ sưu tập'}
          </span>
          {parentTopic && (
            <>
              <ChevronRight size={12} className="text-text-light" />
              <span className="text-text-muted truncate max-w-[200px]">
                {parentTopic.name}
              </span>
            </>
          )}
          <ChevronRight size={12} className="text-text-light" />
          <span className="font-bold text-primary truncate max-w-[200px]">
            {currentTopic.name}
          </span>
        </div>

        {/* Title and Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{currentTopic.icon}</span>
              <h1 className="text-lg font-extrabold text-text tracking-tight">
                {currentTopic.name}
              </h1>
              <span className="text-xs font-semibold text-text-muted">
                ({currentTopic.nameVi})
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Target {currentTopic.targetCefr}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  currentTopic.status === 'published'
                    ? 'bg-primary-light text-primary border-primary/20'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {currentTopic.status === 'published' ? 'Đã Xuất Bản' : 'Bản Nháp'}
              </span>
            </div>

            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              {currentTopic.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 pt-1 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <BookOpen size={13} className="text-primary" />
                <span>
                  <strong className="text-text font-mono">{items.length}</strong> từ vựng
                </span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1">
                <Users size={13} className="text-blue-500" />
                <span>
                  <strong className="text-text font-mono">
                    {currentTopic.activeLearnersCount.toLocaleString()}
                  </strong>{' '}
                  người đang học
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
              title="Tải danh sách từ vựng dạng CSV"
            >
              <Download size={13} className="text-text-muted" />
              <span>Xuất CSV</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCreateDeckModal(currentTopic)}
              className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
              title="Tạo Starter Deck mẫu từ chủ đề này"
            >
              <Layers size={13} className="text-reward" />
              <span>Tạo Starter Deck</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenEditTopicModal(currentTopic)}
              className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Edit size={13} className="text-text-muted" />
              <span>Sửa Topic</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddWordModal}
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>+ Thêm Từ Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Data Table */}
      <div className="flex-1 overflow-hidden">
        <TopicItemsTable
          items={items}
          filter={filter}
          onFilterChange={onFilterChange}
          onOpenInStudio={onOpenInStudio}
          onRemoveItem={onRemoveItem}
          onBulkStatusChange={onBulkStatusChange}
          onBulkRemove={onBulkRemove}
          onAddNewWord={onOpenAddWordModal}
        />
      </div>
    </div>
  );
};
