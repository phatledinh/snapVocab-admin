import React, { useState } from 'react';
import {
  AIScanQueueItem,
  ReviewQueueFilter,
} from '../../../domains/ai-scan/types';
import { filterQueueItems, getConfidenceBadge } from '../../../domains/ai-scan/selectors';
import { InspectionCorrectionPanel } from './InspectionCorrectionPanel';
import { CEFRLevel } from '../../../domains/flashcard/types';
import {
  Search,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Inbox,
} from 'lucide-react';

interface ReviewQueueTabProps {
  queueItems: AIScanQueueItem[];
  onApproveItem: (itemId: string) => void;
  onRejectItem: (itemId: string) => void;
  onApplyCorrection: (
    itemId: string,
    correctedWord: string,
    cefr: CEFRLevel,
    meaningVi: string,
    reason: string
  ) => void;
  onNavigateToContentStudio?: (wordName: string) => void;
}

export const ReviewQueueTab: React.FC<ReviewQueueTabProps> = ({
  queueItems,
  onApproveItem,
  onRejectItem,
  onApplyCorrection,
  onNavigateToContentStudio,
}) => {
  // Filters
  const [filter, setFilter] = useState<ReviewQueueFilter>({
    priority: 'all',
    status: 'all',
    search: '',
  });

  // Selected item for Inspection Panel
  const [selectedItemId, setSelectedItemId] = useState<string>(
    queueItems[0]?.id || ''
  );

  const filteredItems = filterQueueItems(queueItems, filter);
  const selectedItem =
    queueItems.find((q) => q.id === selectedItemId) || filteredItems[0] || queueItems[0];

  const p1Count = queueItems.filter((q) => q.priority === 'P1' && q.status === 'pending').length;
  const p2Count = queueItems.filter((q) => q.priority === 'P2' && q.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-250px)] min-h-[580px] select-none">
      {/* Left Column: Queue List (4 cols) */}
      <div className="lg:col-span-4 bg-surface border border-border rounded-xl shadow-xs flex flex-col overflow-hidden">
        {/* Search & Priority Pills */}
        <div className="p-3 border-b border-border bg-surface-subtle/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <span>Danh Sách Hàng Đợi</span>
              <span className="px-1.5 py-0.2 rounded-full bg-snapy-light text-snapy font-mono text-[10px] font-bold">
                {filteredItems.length}
              </span>
            </h3>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text-muted">Lọc trạng thái:</span>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value as any })
                }
                className="text-[11px] font-medium bg-surface border border-border rounded px-1.5 py-0.5 focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tất cả ({queueItems.length})</option>
                <option value="pending">Chờ xử lý</option>
                <option value="corrected">Đã sửa</option>
                <option value="rejected">Đã loại</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Tìm theo nhãn, ID, hoặc ghi chú..."
              className="w-full pl-7 pr-3 py-1 rounded-lg bg-surface border border-border text-xs focus:ring-1 focus:ring-primary"
            />
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>

          {/* Priority Filter Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setFilter({ ...filter, priority: 'all' })}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                filter.priority === 'all'
                  ? 'bg-text text-white border-text'
                  : 'bg-surface hover:bg-surface-subtle border-border text-text-muted'
              }`}
            >
              Tất cả ({queueItems.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter({ ...filter, priority: 'P1' })}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                filter.priority === 'P1'
                  ? 'bg-danger text-white border-danger shadow-xs font-bold'
                  : 'bg-surface hover:bg-danger-light/50 border-danger/30 text-danger'
              }`}
            >
              <AlertTriangle size={11} />
              <span>P1 Báo lỗi ({p1Count})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter({ ...filter, priority: 'P2' })}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                filter.priority === 'P2'
                  ? 'bg-snapy text-white border-snapy shadow-xs font-bold'
                  : 'bg-surface hover:bg-snapy-light/50 border-snapy/30 text-snapy'
              }`}
            >
              <Sparkles size={11} />
              <span>P2 Low-Conf ({p2Count})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const conf = getConfidenceBadge(item.confidence);
              const isP1 = item.priority === 'P1';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3 flex items-start gap-2.5 cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-primary-light/40 border-l-4 border-l-primary'
                      : 'hover:bg-surface-subtle'
                  }`}
                >
                  {/* Thumbnail with BBox hint */}
                  <div className="w-13 h-13 rounded-lg overflow-hidden bg-black/10 border border-border shrink-0 relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.predictedLabel}
                      className="w-full h-full object-cover"
                    />
                    {isP1 && (
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-text truncate">
                        {item.predictedLabel}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${conf.badgeClass}`}
                      >
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
                      <span
                        className={`font-mono font-bold px-1 py-0.2 rounded text-[9px] ${
                          isP1
                            ? 'bg-danger text-white'
                            : 'bg-snapy-light text-snapy border border-snapy/20'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        {item.requestId || item.id}
                      </span>
                    </div>

                    {/* Learner Note snippet */}
                    {item.learnerNote && (
                      <p className="text-[10px] text-text-muted line-clamp-1 italic">
                        {item.learnerNote}
                      </p>
                    )}

                    {/* If corrected */}
                    {item.correctedWord && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-mono">
                        <CheckCircle2 size={10} />
                        <span>Đã sửa thành: {item.correctedWord}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight
                    size={13}
                    className={`text-text-light self-center transition-transform ${
                      isSelected ? 'text-primary translate-x-0.5' : ''
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-text-muted flex flex-col items-center justify-center">
              <Inbox size={28} className="text-text-light mb-2" />
              <div className="text-xs font-semibold">Không tìm thấy ảnh phù hợp</div>
              <div className="text-[10px] mt-0.5">Thử đổi bộ lọc hoặc từ khóa tìm kiếm</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Visual Inspection & Correction Panel (8 cols) */}
      <div className="lg:col-span-8 h-full">
        {selectedItem ? (
          <InspectionCorrectionPanel
            item={selectedItem}
            onApprove={onApproveItem}
            onReject={onRejectItem}
            onApplyCorrection={onApplyCorrection}
            onNavigateToContentStudio={onNavigateToContentStudio}
          />
        ) : (
          <div className="h-full rounded-xl bg-surface border border-border flex items-center justify-center p-8 text-center text-text-muted">
            Chọn một ảnh từ hàng đợi bên trái để bắt đầu đối soát
          </div>
        )}
      </div>
    </div>
  );
};
