import React, { useState, useEffect } from 'react';
import { AIScanQueueItem, BoundingBox } from '../../../domains/ai-scan/types';
import { getConfidenceBadge } from '../../../domains/ai-scan/selectors';
import { INITIAL_VOCABULARY } from '../../../domains/vocabulary/mock-data';
import { CEFRLevel } from '../../../domains/flashcard/types';
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Tag,
  Clock,
  User,
} from 'lucide-react';

interface InspectionCorrectionPanelProps {
  item: AIScanQueueItem;
  onApprove: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onApplyCorrection: (
    itemId: string,
    correctedWord: string,
    cefr: CEFRLevel,
    meaningVi: string,
    reason: string
  ) => void;
  onNavigateToContentStudio?: (wordName: string) => void;
}

export const InspectionCorrectionPanel: React.FC<InspectionCorrectionPanelProps> = ({
  item,
  onApprove,
  onReject,
  onApplyCorrection,
  onNavigateToContentStudio,
}) => {
  // Visual Mode: 'original' | 'sam-mask' | 'crop'
  const [viewMode, setViewMode] = useState<'original' | 'sam-mask' | 'crop'>('original');

  // Correction Form State
  const [searchWordQuery, setSearchWordQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(item.correctedWord || item.predictedLabel);
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel>(item.suggestedCefr || 'A1');
  const [meaningVi, setMeaningVi] = useState(item.correctedMeaningVi || '');
  const [correctionReason, setCorrectionReason] = useState(
    item.correctionReason ||
      (item.priority === 'P1'
        ? 'Hiệu chỉnh theo phản hồi người học báo sai nhãn'
        : 'Hiệu chỉnh do độ tin cậy AI dưới 75%')
  );

  // Sync state when selected item changes
  useEffect(() => {
    setSelectedWord(item.correctedWord || item.predictedLabel);
    setSelectedCefr(item.correctedCefr || item.suggestedCefr || 'A1');
    setMeaningVi(item.correctedMeaningVi || '');
    setSearchWordQuery('');
    setViewMode('original');
    setCorrectionReason(
      item.correctionReason ||
        (item.priority === 'P1'
          ? 'Hiệu chỉnh theo phản hồi người học báo sai nhãn'
          : 'Hiệu chỉnh do độ tin cậy AI dưới 75%')
    );
  }, [item]);

  const confBadge = getConfidenceBadge(item.confidence);

  // Quick suggestions based on item
  const getSuggestions = () => {
    if (item.predictedLabel.includes('coffee') || item.predictedLabel.includes('cup')) {
      return ['thermos', 'travel mug', 'tumbler'];
    }
    if (item.predictedLabel.includes('textbook')) {
      return ['notebook', 'workbook', 'exercise book'];
    }
    if (item.predictedLabel.includes('sunglasses')) {
      return ['reading glasses', 'spectacles', 'eyewear'];
    }
    if (item.predictedLabel.includes('backpack')) {
      return ['school bag', 'rucksack', 'satchel'];
    }
    return ['bottle', 'cup', 'notebook', 'glasses'];
  };

  // Filter dictionary words
  const matchingVocab = INITIAL_VOCABULARY.filter(
    (v) =>
      v.word.toLowerCase().includes(searchWordQuery.toLowerCase().trim()) ||
      v.meanings.some((m) =>
        m.definitionVi.toLowerCase().includes(searchWordQuery.toLowerCase().trim())
      )
  );

  const handlePickDictionaryWord = (word: string, cefr: CEFRLevel, defVi: string) => {
    setSelectedWord(word);
    setSelectedCefr(cefr);
    setMeaningVi(defVi);
    setSearchWordQuery('');
  };

  const handleConfirmCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWord.trim()) return;
    onApplyCorrection(
      item.id,
      selectedWord.trim(),
      selectedCefr,
      meaningVi.trim(),
      correctionReason.trim()
    );
  };

  // Convert bounding box [ymin, xmin, ymax, xmax] (0-1000) to SVG percentage rect
  const bbox: BoundingBox = item.boundingBox || [200, 200, 800, 800];
  const [ymin, xmin, ymax, xmax] = bbox;
  const topPct = (ymin / 1000) * 100;
  const leftPct = (xmin / 1000) * 100;
  const widthPct = ((xmax - xmin) / 1000) * 100;
  const heightPct = ((ymax - ymin) / 1000) * 100;

  return (
    <div className="bg-surface border border-border rounded-xl shadow-xs flex flex-col h-full overflow-hidden select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20 shrink-0">
            <Camera size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-text">
                Đối Soát Ảnh Camera &amp; Studio Hiệu Chỉnh
              </h3>
              <span className="text-[10px] font-mono text-text-muted">
                [{item.requestId || item.id}]
              </span>
            </div>
            <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                <span>{new Date(item.capturedAt).toLocaleTimeString('vi-VN')}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <User size={11} />
                <span>{item.learnerId || 'user-mobile'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Priority and Status Badges */}
        <div className="flex items-center gap-2">
          {item.priority === 'P1' ? (
            <span className="px-2 py-0.5 rounded-full bg-danger text-white text-[10px] font-bold font-mono animate-pulse shadow-2xs">
              P1 · Báo lỗi người học
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-snapy-light text-snapy border border-snapy/30 text-[10px] font-bold font-mono">
              P2 · Low Confidence
            </span>
          )}

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
              item.status === 'corrected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.status === 'rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {item.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Content: Split 2 columns (Left: Visual Preview, Right: AI Diagnostics & 1-Click Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
        {/* Left 6 cols: Visual Preview */}
        <div className="lg:col-span-6 p-4 border-r border-border flex flex-col justify-between bg-surface-subtle/30">
          <div>
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Khung Hình Thực Nghiệm
              </span>
              <div className="flex items-center gap-1 bg-surface border border-border p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`px-2 py-0.5 rounded ${
                    viewMode === 'original'
                      ? 'bg-primary text-white font-bold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Ảnh Gốc + BBox
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('sam-mask')}
                  className={`px-2 py-0.5 rounded ${
                    viewMode === 'sam-mask'
                      ? 'bg-primary text-white font-bold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  SAM Mask
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('crop')}
                  className={`px-2 py-0.5 rounded ${
                    viewMode === 'crop'
                      ? 'bg-primary text-white font-bold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Flashcard Crop
                </button>
              </div>
            </div>

            {/* Image Stage Container */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/90 border border-border shadow-inner flex items-center justify-center group">
              {viewMode === 'original' && (
                <>
                  <img
                    src={item.originalImageUrl || item.thumbnailUrl}
                    alt={item.predictedLabel}
                    className="w-full h-full object-contain"
                  />
                  {/* SVG Bounding Box Overlay */}
                  <div
                    className="absolute border-2 border-snapy bg-snapy/10 rounded-sm pointer-events-none transition-all"
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-snapy text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shadow-xs flex items-center gap-1 whitespace-nowrap">
                      <span>{item.predictedLabel}</span>
                      <span>({Math.round(item.confidence * 100)}%)</span>
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'sam-mask' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={item.originalImageUrl || item.thumbnailUrl}
                    alt="SAM Mask"
                    className="w-full h-full object-contain opacity-50 grayscale"
                  />
                  {/* Simulated SAM segmentation mask overlay */}
                  <div
                    className="absolute border-2 border-emerald-400 bg-emerald-500/40 rounded-lg pointer-events-none"
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  >
                    <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-mono px-1 rounded">
                      SAM ViT-H Mask (IoU 0.94)
                    </span>
                  </div>
                </div>
              )}

              {viewMode === 'crop' && (
                <div className="relative w-full h-full flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                  <img
                    src={item.cropUrl || item.thumbnailUrl}
                    alt="Flashcard Crop"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                  <div className="absolute bottom-2 right-2 bg-surface/90 text-text-muted text-[10px] font-mono px-2 py-0.5 rounded border border-border">
                    R2 Asset (250x250 PNG Cutout)
                  </div>
                </div>
              )}
            </div>

            {/* Bounding Box Coordinates Table */}
            <div className="mt-3 p-2.5 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-muted flex items-center justify-between">
              <span className="text-text font-semibold flex items-center gap-1">
                <Tag size={12} className="text-snapy" />
                <span>Tọa độ Box:</span>
              </span>
              <span>
                [{ymin}, {xmin}, {ymax}, {xmax}] (0-1000 Scale)
              </span>
            </div>
          </div>

          {/* Learner Feedback Note if P1 */}
          {item.learnerNote && (
            <div
              className={`mt-3 p-3 rounded-lg border text-xs leading-relaxed ${
                item.priority === 'P1'
                  ? 'bg-danger-light/50 border-danger/30 text-danger-dark'
                  : 'bg-surface border-border text-text-muted'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle size={13} className={item.priority === 'P1' ? 'text-danger' : 'text-snapy'} />
                <span>Phản ánh từ Người Học:</span>
              </div>
              <p className="text-[11px] text-text italic">
                &ldquo;{item.learnerNote}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right 6 cols: AI Diagnostics & 1-Click Correction Studio */}
        <div className="lg:col-span-6 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* AI Diagnostics Card */}
            <div className="p-3 rounded-xl bg-surface-subtle/80 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Chẩn Đoán Mô Hình AI (Florence-2)
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${confBadge.badgeClass}`}
                >
                  {confBadge.text}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-text-muted">Nhãn Dự Đoán</div>
                  <div className="font-bold text-text font-mono text-sm mt-0.5">
                    {item.predictedLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted">Nguồn Nhận Diện</div>
                  <div className="font-semibold text-text font-mono mt-0.5">
                    {item.detectionSource || 'OD'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted">Điểm CLIP Score</div>
                  <div className="font-bold text-snapy font-mono mt-0.5">
                    {item.clipScore || 0.25} / 0.23 floor
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Pills */}
            <div>
              <div className="text-[11px] font-semibold text-text-muted mb-1.5 flex items-center justify-between">
                <span>Gợi ý gán nhãn nhanh (1-Click Suggestions):</span>
                <Sparkles size={12} className="text-snapy" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getSuggestions().map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setSelectedWord(sug);
                      const match = INITIAL_VOCABULARY.find(
                        (v) => v.word.toLowerCase() === sug.toLowerCase()
                      );
                      if (match) {
                        setSelectedCefr(match.cefr);
                        setMeaningVi(match.meanings[0]?.definitionVi || '');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      selectedWord.toLowerCase() === sug.toLowerCase()
                        ? 'bg-snapy text-white border-snapy shadow-xs'
                        : 'bg-surface hover:bg-surface-subtle border-border text-text'
                    }`}
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Dictionary Search */}
            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold text-text-muted">
                Tra Cứu Từ Điển SnapVocab &amp; Oxford:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchWordQuery}
                  onChange={(e) => setSearchWordQuery(e.target.value)}
                  placeholder="Tìm từ vựng hoặc nghĩa tiếng Việt..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>

              {/* Autocomplete Dropdown if query */}
              {searchWordQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                  {matchingVocab.length > 0 ? (
                    matchingVocab.map((v) => (
                      <div
                        key={v.id}
                        onClick={() =>
                          handlePickDictionaryWord(
                            v.word,
                            v.cefr,
                            v.meanings[0]?.definitionVi || ''
                          )
                        }
                        className="px-3 py-2 border-b border-border/60 hover:bg-surface-subtle cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-text">{v.word}</span>{' '}
                          <span className="text-[10px] text-text-muted font-mono">
                            {v.phonetic}
                          </span>
                          <div className="text-[11px] text-text-muted truncate max-w-xs">
                            {v.meanings[0]?.definitionVi}
                          </div>
                        </div>
                        <span className="px-1.5 py-0.2 rounded bg-primary-light text-primary text-[10px] font-bold font-mono">
                          {v.cefr}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-text-muted text-center">
                      Không tìm thấy từ trong từ điển mẫu. Bạn có thể nhập từ mới bên dưới.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Fields: Word, CEFR, Meaning */}
            <form onSubmit={handleConfirmCorrection} className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-text">
                    Từ Vựng Chuẩn Hóa:
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedWord}
                    onChange={(e) => setSelectedWord(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border font-mono font-bold text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text">Cấp Độ CEFR:</label>
                  <select
                    value={selectedCefr}
                    onChange={(e) => setSelectedCefr(e.target.value as CEFRLevel)}
                    className="w-full px-2 py-1.5 rounded-lg bg-surface border border-border font-mono font-bold text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text">
                  Định Nghĩa Tiếng Việt:
                </label>
                <input
                  type="text"
                  value={meaningVi}
                  onChange={(e) => setMeaningVi(e.target.value)}
                  placeholder="Ví dụ: bình giữ nhiệt chân không"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text">
                  Lý Do Hiệu Chỉnh (Ghi Audit Log):
                </label>
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-muted focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  className="px-3 py-2 rounded-lg bg-surface hover:bg-rose-50 border border-border hover:border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Ảnh hỏng hoặc không đạt yêu cầu"
                >
                  <XCircle size={14} />
                  <span>Loại Bỏ / Ảnh Lỗi</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(item.id)}
                    className="px-3 py-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-text text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Duyệt Nhãn AI</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Sparkles size={14} />
                    <span>Lưu &amp; Thêm Vào Dataset</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick link to Content Studio if word matches */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <BookOpen size={12} className="text-primary" />
              <span>Active Learning: Tự động gắn nhãn vào Mobile API</span>
            </span>
            {onNavigateToContentStudio && (
              <button
                type="button"
                onClick={() => onNavigateToContentStudio(selectedWord)}
                className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>Mở trong Content Studio</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
