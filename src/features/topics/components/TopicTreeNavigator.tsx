import React, { useState } from 'react';
import { Collection, Topic } from '../../../domains/topics/types';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Layers,
  Edit2,
  Trash2,
} from 'lucide-react';

interface TopicTreeNavigatorProps {
  collections: Collection[];
  topics: Topic[];
  selectedTopicId?: string;
  onSelectTopic: (topicId: string) => void;
  onOpenCreateTopic: (parentId?: string, collectionId?: string) => void;
  onOpenCreateCollection: () => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
}

export const TopicTreeNavigator: React.FC<TopicTreeNavigatorProps> = ({
  collections,
  topics,
  selectedTopicId,
  onSelectTopic,
  onOpenCreateTopic,
  onOpenCreateCollection,
  onEditTopic,
  onDeleteTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'top-toeic-office': true,
    'top-daily-dining': true,
  });

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Filter collections
  const filteredCollections = collections.filter((c) => {
    if (selectedCollectionId !== 'all' && c.id !== selectedCollectionId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCol = c.name.toLowerCase().includes(q) || c.nameVi.toLowerCase().includes(q);
      const hasMatchingTopic = topics.some(
        (t) =>
          t.collectionId === c.id &&
          (t.name.toLowerCase().includes(q) || t.nameVi.toLowerCase().includes(q))
      );
      return matchCol || hasMatchingTopic;
    }
    return true;
  });

  // Render Topic Tree Node
  const renderTopicNode = (topic: Topic, depth = 0) => {
    const isSelected = selectedTopicId === topic.id;
    const isExpanded = !!expandedNodes[topic.id];
    const childTopics = topics.filter((t) => t.parentId === topic.id);
    const hasChildren = childTopics.length > 0;

    // Search query match check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchThis =
        topic.name.toLowerCase().includes(q) || topic.nameVi.toLowerCase().includes(q);
      const matchChild = childTopics.some(
        (c) => c.name.toLowerCase().includes(q) || c.nameVi.toLowerCase().includes(q)
      );
      if (!matchThis && !matchChild) {
        return null;
      }
    }

    return (
      <div key={topic.id} className="select-none">
        <div
          onClick={() => onSelectTopic(topic.id)}
          className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isSelected
              ? 'bg-primary-light text-primary font-bold shadow-xs'
              : 'text-text hover:bg-surface-subtle hover:text-text'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {/* Expand / Collapse Icon */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(topic.id, e)}
                className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-text shrink-0 rounded transition-colors"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : (
              <span className="w-4 h-4 shrink-0 flex items-center justify-center text-[10px] text-text-light">
                •
              </span>
            )}

            {/* Topic Icon */}
            <span className="text-sm shrink-0">{topic.icon}</span>

            {/* Topic Name */}
            <span className="truncate" title={`${topic.name} (${topic.nameVi})`}>
              {topic.name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {/* CEFR Badge */}
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                topic.targetCefr === 'A1' || topic.targetCefr === 'A2'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : topic.targetCefr === 'B1' || topic.targetCefr === 'B2'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              {topic.targetCefr}
            </span>

            {/* Word Count */}
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-surface border border-border text-text-muted">
              {topic.wordCount}
            </span>

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateTopic(topic.id, topic.collectionId);
                }}
                className="p-1 text-text-muted hover:text-primary rounded hover:bg-surface"
                title="Thêm chủ đề con"
              >
                <Plus size={12} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTopic(topic);
                }}
                className="p-1 text-text-muted hover:text-text rounded hover:bg-surface"
                title="Sửa chủ đề"
              >
                <Edit2 size={11} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTopic(topic.id);
                }}
                className="p-1 text-text-muted hover:text-danger rounded hover:bg-surface"
                title="Lưu trữ chủ đề"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Render child topics if expanded */}
        {hasChildren && (isExpanded || searchQuery.trim().length > 0) && (
          <div className="space-y-0.5 mt-0.5">
            {childTopics.map((child) => renderTopicNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-surface border-r border-border overflow-hidden select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FolderTree size={15} className="text-primary" />
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">
              Cây Chủ Đề (Tree)
            </h2>
          </div>
          <span className="text-[10px] text-text-muted font-mono">
            {topics.length} topics
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ đề, danh mục..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:bg-surface transition-all"
          />
        </div>

        {/* Collection Dropdown / Pill */}
        <div>
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-surface border border-border text-xs text-text font-medium focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả Bộ Sưu Tập ({collections.length})</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.icon} {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 p-2.5 overflow-y-auto space-y-3">
        {filteredCollections.map((col) => {
          const rootTopics = topics.filter(
            (t) => t.collectionId === col.id && !t.parentId
          );

          return (
            <div key={col.id} className="space-y-1">
              {/* Collection Header */}
              <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-text-muted uppercase tracking-wider bg-surface-subtle/70 rounded-md border border-border/40">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{col.icon}</span>
                  <span className="truncate">{col.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-text-muted font-mono font-normal">
                    {rootTopics.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCreateTopic(undefined, col.id)}
                    className="p-0.5 text-text-muted hover:text-primary rounded hover:bg-surface"
                    title={`Thêm chủ đề vào ${col.name}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Topics under this collection */}
              <div className="space-y-0.5 pl-1">
                {rootTopics.length > 0 ? (
                  rootTopics.map((topic) => renderTopicNode(topic, 0))
                ) : (
                  <div className="text-[11px] text-text-muted italic px-2 py-1">
                    Chưa có chủ đề nào.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredCollections.length === 0 && (
          <div className="p-4 text-center text-xs text-text-muted">
            Không tìm thấy bộ sưu tập hoặc chủ đề phù hợp.
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-2.5 border-t border-border bg-surface-subtle/40 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCreateCollection}
          className="flex-1 py-1.5 px-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Layers size={13} className="text-text-muted" />
          <span>+ Collection</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenCreateTopic()}
          className="flex-1 py-1.5 px-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Plus size={13} />
          <span>+ Thêm Topic</span>
        </button>
      </div>
    </div>
  );
};
