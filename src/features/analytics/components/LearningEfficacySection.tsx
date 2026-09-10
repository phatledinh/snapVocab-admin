import React from 'react';
import { AnalyticsViewModel } from '../../../domains/analytics/types';
import { BarChart, BarChartItem } from '../../../components/charts/BarChart';
import { BookOpen, ExternalLink, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

interface LearningEfficacySectionProps {
  viewModel: AnalyticsViewModel;
  onSelectWordToEdit?: (word: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LearningEfficacySection: React.FC<LearningEfficacySectionProps> = ({
  viewModel,
  onSelectWordToEdit,
  onNavigateTab,
}) => {
  const { leitnerBoxes, cefrAccuracy, hardestWords } = viewModel;

  // Prepare data for Leitner BarChart
  const leitnerBarData: BarChartItem[] = leitnerBoxes.map((b) => ({
    label: `Hộp ${b.box}`,
    value: b.wordCount,
    subLabel: `${b.percentage}%`,
    color: b.color,
  }));

  const handleOpenInStudio = (word: string) => {
    if (onSelectWordToEdit) {
      onSelectWordToEdit(word);
    }
    if (onNavigateTab) {
      onNavigateTab('content-studio');
    }
  };

  return (
    <div className="space-y-4">
      {/* Layer 1: Leitner Memory Boxes + CEFR Accuracy Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 cols: Leitner Memory Boxes */}
        <div className="lg:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <Layers size={15} className="text-info" />
                  <span>Phân Bổ Thang Hộp Trí Nhớ Leitner (5 SRS Boxes)</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Chu kỳ giãn cách củng cố trí nhớ dài hạn (Spaced Repetition System)
                </p>
              </div>
              <span className="text-xs font-bold text-info bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                SRS Engine
              </span>
            </div>

            {/* Bar Chart */}
            <div className="py-2">
              <BarChart data={leitnerBarData} height={130} />
            </div>

            {/* Detailed box descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 mt-2">
              {leitnerBoxes.map((box) => (
                <div
                  key={box.box}
                  className="p-2 rounded-lg bg-surface-subtle border border-border/70 text-center flex flex-col justify-between"
                >
                  <div className="text-[10px] font-bold text-text truncate">Hộp {box.box}</div>
                  <div className="text-xs font-black font-mono my-0.5" style={{ color: box.color }}>
                    {box.wordCount} từ
                  </div>
                  <div className="text-[9px] text-text-muted font-medium">{box.intervalDays}</div>
                  <div className="mt-1 pt-1 border-t border-border/60 text-[9px] font-mono text-text-muted">
                    Đúng {box.accuracyRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>
              💡 <strong>Hộp 5 (Thành thạo):</strong> Chiếm <strong>9%</strong> kho từ vựng cá nhân, đạt độ chuẩn xác 98.6%.
            </span>
            <span className="text-[11px] font-mono">Tổng: 3,420 Từ</span>
          </div>
        </div>

        {/* Right 6 cols: CEFR Level Accuracy Table */}
        <div className="lg:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <BookOpen size={15} className="text-primary" />
                  <span>Độ Chính Xác & Tỷ Lệ Ghi Nhớ Theo CEFR</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Đo lường mức độ tiếp thu từ vựng từ cơ bản (A1) đến nâng cao (C2)
                </p>
              </div>
            </div>

            {/* High-density CEFR Table */}
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-subtle text-[10px] text-text-muted uppercase font-bold border-b border-border">
                  <tr>
                    <th className="py-2 px-2.5">Cấp Độ</th>
                    <th className="py-2 px-2 text-center">Tổng Từ</th>
                    <th className="py-2 px-2 text-center">Thành Thạo</th>
                    <th className="py-2 px-2.5">Độ Chính Xác</th>
                    <th className="py-2 px-2 text-right">Ngày / Từ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {cefrAccuracy.map((c) => (
                    <tr key={c.level} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-1.5 px-2.5 font-bold">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                          style={{
                            backgroundColor: `${c.color}15`,
                            color: c.color,
                            borderColor: `${c.color}35`,
                          }}
                        >
                          {c.level}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono text-text-muted">
                        {c.totalWords}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono font-medium text-emerald-600">
                        {c.masteredWords}
                      </td>
                      <td className="py-1.5 px-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${c.accuracyRate}%`, backgroundColor: c.color }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-text">
                            {c.accuracyRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono text-text-muted">
                        ~{c.avgMasteryDays} ngày
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border text-xs text-text-muted flex items-center justify-between">
            <span>
              🎯 Cấp độ <strong>C1 và C2</strong> cần trung bình 38 - 45 ngày để người học thành thục.
            </span>
            <span className="font-medium text-text">SRS Benchmark</span>
          </div>
        </div>
      </div>

      {/* Layer 2: Hardest / Bottleneck Vocabulary Table */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-danger" />
                <span>Bảng Xếp Hạng Từ Vựng Khó Nhất & Bị Quên Nhiều Nhất (Bottleneck Vocabulary)</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                Failure Rate &gt; 30%
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Danh sách các từ vựng gây tỉ lệ sai cao trong quá trình ôn tập Flashcard — Cần biên tập lại ví dụ hoặc audio phát âm
            </p>
          </div>

          <span className="text-[11px] font-mono text-text-muted self-start sm:self-auto">
            Top {hardestWords.length} Từ Thử Thách
          </span>
        </div>

        {/* High-density Table */}
        <div className="w-full overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-surface-subtle text-[11px] text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Từ Vựng</th>
                <th className="py-2.5 px-2 text-center">Cấp Độ</th>
                <th className="py-2.5 px-3">Định Nghĩa Tiếng Việt</th>
                <th className="py-2.5 px-2 text-center">Lượt Ôn</th>
                <th className="py-2.5 px-2.5">Tỷ Lệ Sai (% Failure)</th>
                <th className="py-2.5 px-2 text-center">Chuỗi Lỗi</th>
                <th className="py-2.5 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {hardestWords.map((hw) => {
                let cefrBadgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                if (hw.cefr === 'C2') cefrBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                if (hw.cefr === 'B2') cefrBadgeClass = 'bg-orange-50 text-orange-700 border-orange-200';

                return (
                  <tr key={hw.id} className="hover:bg-surface-subtle/50 transition-colors">
                    {/* Word & POS */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text text-sm">{hw.word}</span>
                        <span className="text-[10px] text-text-muted italic">({hw.partOfSpeech})</span>
                      </div>
                    </td>

                    {/* CEFR */}
                    <td className="py-2.5 px-2 text-center">
                      <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] border ${cefrBadgeClass}`}>
                        {hw.cefr}
                      </span>
                    </td>

                    {/* Meaning */}
                    <td className="py-2.5 px-3 text-text-muted max-w-[220px] truncate">
                      {hw.meaningVi}
                    </td>

                    {/* Total Reviews */}
                    <td className="py-2.5 px-2 text-center font-mono text-text-muted">
                      {hw.totalReviews.toLocaleString('vi-VN')}
                    </td>

                    {/* Failure Rate */}
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-danger"
                            style={{ width: `${hw.failureRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-danger">
                          {hw.failureRate}%
                        </span>
                      </div>
                    </td>

                    {/* Error Streak */}
                    <td className="py-2.5 px-2 text-center">
                      <span className="font-mono font-bold text-rose-600 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-[10px]">
                        x{hw.errorStreak}
                      </span>
                    </td>

                    {/* Action Deep Link */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenInStudio(hw.word)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface hover:bg-surface-subtle border border-border text-text hover:text-primary text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
                        title={`Mở từ ${hw.word} trong Content Studio để soát nội dung`}
                      >
                        <span>Soát Trong Studio</span>
                        <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-primary" />
            <span>
              Bấm nút <strong>"Soát Trong Studio"</strong> sẽ mở trình biên tập split-screen cho từ vựng đó kèm giả lập Mobile Simulator.
            </span>
          </span>
          <span className="text-[11px] font-mono">Deep-Link Integration Ready</span>
        </div>
      </div>
    </div>
  );
};
