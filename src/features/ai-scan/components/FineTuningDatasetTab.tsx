import React, { useState } from 'react';
import { FineTuneSample, ConfusionPair } from '../../../domains/ai-scan/types';
import {
  Database,
  Download,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FineTuningDatasetTabProps {
  samples: FineTuneSample[];
  confusionPairs: ConfusionPair[];
  onExportDataset: () => void;
}

export const FineTuningDatasetTab: React.FC<FineTuningDatasetTabProps> = ({
  samples,
  confusionPairs,
  onExportDataset,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'exported' | 'training'>('all');

  const filteredSamples =
    filterStatus === 'all'
      ? samples
      : samples.filter((s) => s.status === filterStatus);

  const readyCount = samples.filter((s) => s.status === 'ready').length;

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner: Active Learning Feedback Loop Explanation */}
      <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <Database size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-text">
                Active Learning Feedback Loop &amp; Fine-Tuning Pipeline
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-primary-light text-primary text-[10px] font-bold border border-primary/20">
                Design Spec §7.2
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed max-w-2xl">
              Khi Operator thực hiện <strong>1-Click Correction</strong> trên Review Queue, các cặp nhãn đúng và ảnh gốc có Bounding Box sẽ được tự động tích lũy vào tập dữ liệu này để tinh chỉnh lại mô hình Florence-2 và hiệu chỉnh ngưỡng CLIP.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExportDataset}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          <Download size={14} />
          <span>Xuất File COCO Dataset ({samples.length} Mẫu)</span>
        </button>
      </div>

      {/* Layer 1: Top Misclassification Pairs (Confusion Matrix Breakdown) */}
      <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-snapy" />
            <h4 className="text-xs font-bold text-text uppercase tracking-wider">
              Top Cặp Từ AI Hay Nhận Diện Sai (Label Confusion Pairs)
            </h4>
          </div>
          <span className="text-[11px] text-text-muted font-mono">
            Phát hiện từ phản hồi người học
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {confusionPairs.map((pair, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-subtle border border-border flex flex-col justify-between hover:border-border-strong transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-text-muted">
                    Xếp hạng #{idx + 1}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
                    {pair.occurrences} lần nhầm
                  </span>
                </div>

                {/* AI Label -> Actual Label comparison */}
                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 p-2 rounded bg-surface border border-border text-center">
                    <div className="text-[10px] text-text-muted">AI Đoán</div>
                    <div className="text-xs font-bold font-mono text-rose-600 line-through">
                      {pair.aiLabel}
                    </div>
                  </div>

                  <ArrowRight size={14} className="text-text-muted shrink-0" />

                  <div className="flex-1 p-2 rounded bg-surface border border-emerald-200 text-center">
                    <div className="text-[10px] text-emerald-700 font-semibold">Thực Tế</div>
                    <div className="text-xs font-bold font-mono text-emerald-600">
                      {pair.actualLabel}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                  💡 <strong>Khắc phục:</strong> {pair.resolution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2: Verified Samples Table */}
      <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-primary" />
            <h4 className="text-xs font-bold text-text uppercase tracking-wider">
              Danh Sách Mẫu Đã Kiểm Chuẩn (Ground-Truth Annotation Samples)
            </h4>
            <span className="px-2 py-0.2 rounded-full bg-primary-light text-primary text-[10px] font-mono font-bold">
              {readyCount} Sẵn sàng nạp
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted">Lọc trạng thái:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-xs font-semibold bg-surface border border-border rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary"
            >
              <option value="all">Tất cả ({samples.length})</option>
              <option value="ready">Sẵn sàng (Ready)</option>
              <option value="exported">Đã xuất (Exported)</option>
              <option value="training">Đang train (Training)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/80 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3">Mẫu &amp; BBox</th>
                <th className="p-3">Nhãn Gốc (AI)</th>
                <th className="p-3">Nhãn Chuẩn (Verified)</th>
                <th className="p-3">CEFR</th>
                <th className="p-3">Tọa Độ [ymin, xmin, ymax, xmax]</th>
                <th className="p-3">Operator Duyệt</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-surface-subtle/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/10 border border-border shrink-0">
                        <img
                          src={sample.imageUrl}
                          alt={sample.verifiedLabel}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-mono text-[11px] font-bold text-text">
                        {sample.scanRequestId}
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-text-muted line-through">
                    {sample.originalLabel}
                  </td>

                  <td className="p-3 font-mono font-bold text-emerald-600">
                    {sample.verifiedLabel}
                  </td>

                  <td className="p-3">
                    <span className="px-1.5 py-0.2 rounded bg-primary-light text-primary text-[10px] font-mono font-bold border border-primary/20">
                      {sample.cefr}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[11px] text-text-muted">
                    [{sample.boundingBox.join(', ')}]
                  </td>

                  <td className="p-3 text-[11px] text-text">
                    {sample.operator}
                  </td>

                  <td className="p-3 font-mono text-[11px] text-text-muted">
                    {new Date(sample.verifiedAt).toLocaleDateString('vi-VN')}
                  </td>

                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        sample.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : sample.status === 'exported'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {sample.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
