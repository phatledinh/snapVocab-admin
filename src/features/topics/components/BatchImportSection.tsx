import React, { useState } from 'react';
import { Topic, TopicItem, BatchImportRow } from '../../../domains/topics/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface BatchImportSectionProps {
  topics: Topic[];
  existingItems: TopicItem[];
  selectedTopicId?: string;
  onCommitImport: (topicId: string, validRows: BatchImportRow[]) => void;
}

const SAMPLE_CSV = `word,phonetic,pos,cefr,definition_vi,example_en,example_vi
delegate,/ˈdel.ɪ.ɡeɪt/,verb,B2,giao phó hoặc ủy quyền nhiệm vụ cho người khác,A good leader knows how to delegate tasks effectively.,Một người lãnh đạo tốt biết cách giao phó nhiệm vụ hiệu quả.
incentive,/ɪnˈsen.tɪv/,noun,B2,động lực hoặc phần thưởng khuyến khích hành động,The company offered cash incentives for achieving quarterly sales targets.,Công ty đưa ra các khoản tiền thưởng khuyến khích khi đạt mục tiêu doanh số quý.
agenda,/əˈdʒen.də/,noun,B1,chương trình nghị sự cuộc họp,The agenda has already been sent to all participants.,Lịch trình họp đã được gửi cho mọi người tham gia.
invalid_word_example,,noun,X9,,No example sentence provided.,
benchmark,/ˈbentʃ.mɑːk/,noun,C1,tiêu chuẩn hoặc điểm chuẩn để đánh giá chất lượng,Their product set a new benchmark for software security.,Sản phẩm của họ đã thiết lập một tiêu chuẩn mới về an toàn phần mềm.`;

export const BatchImportSection: React.FC<BatchImportSectionProps> = ({
  topics,
  existingItems,
  selectedTopicId,
  onCommitImport,
}) => {
  const [targetTopicId, setTargetTopicId] = useState<string>(
    selectedTopicId || topics[0]?.id || ''
  );
  const [rawText, setRawText] = useState<string>(SAMPLE_CSV);
  const [parsedRows, setParsedRows] = useState<BatchImportRow[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [commitSuccess, setCommitSuccess] = useState<string | null>(null);

  // Validate and detect duplicates
  const handleValidate = () => {
    setCommitSuccess(null);
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      alert('Vui lòng nhập ít nhất một dòng dữ liệu sau dòng tiêu đề CSV.');
      return;
    }

    // Skip header line
    const dataLines = lines.slice(1);
    const existingWords = new Set(
      existingItems
        .filter((item) => item.topicId === targetTopicId)
        .map((item) => item.word.toLowerCase())
    );

    const rows: BatchImportRow[] = dataLines.map((line, idx) => {
      // Basic CSV parser handling commas
      const parts = line.split(',').map((p) => p.trim());
      const word = parts[0] || '';
      const phonetic = parts[1] || '';
      const pos = parts[2] || 'noun';
      const cefrRaw = (parts[3] || 'B1').toUpperCase() as CEFRLevel;
      const defVi = parts[4] || '';
      const exEn = parts[5] || '';
      const exVi = parts[6] || '';

      const validCefr = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cefrRaw)
        ? cefrRaw
        : 'B1';

      // Validation logic
      if (!word || !defVi) {
        return {
          id: `imp-${idx}`,
          word: word || '(Trống)',
          partOfSpeech: pos,
          cefr: validCefr,
          definitionVi: defVi || '(Thiếu định nghĩa)',
          exampleEn: exEn,
          exampleVi: exVi,
          status: 'invalid',
          validationMessage: 'Thiếu từ vựng hoặc định nghĩa tiếng Việt',
        };
      }

      if (existingWords.has(word.toLowerCase())) {
        return {
          id: `imp-${idx}`,
          word,
          phonetic,
          partOfSpeech: pos,
          cefr: validCefr,
          definitionVi: defVi,
          exampleEn: exEn,
          exampleVi: exVi,
          status: 'duplicate',
          validationMessage: `Từ "${word}" đã tồn tại trong chủ đề này (quy tắc FR-14)`,
        };
      }

      return {
        id: `imp-${idx}`,
        word,
        phonetic,
        partOfSpeech: pos,
        cefr: validCefr,
        definitionVi: defVi,
        exampleEn: exEn,
        exampleVi: exVi,
        status: 'valid',
      };
    });

    setParsedRows(rows);
    setIsValidated(true);
  };

  const handleCommit = () => {
    const validRows = parsedRows.filter((r) => r.status === 'valid');
    if (validRows.length === 0) {
      alert('Không có từ vựng hợp lệ nào để nhập.');
      return;
    }

    onCommitImport(targetTopicId, validRows);
    setCommitSuccess(
      `Đã nạp thành công ${validRows.length} từ vựng vào chủ đề được chọn!`
    );
    setParsedRows([]);
    setIsValidated(false);
  };

  const validCount = parsedRows.filter((r) => r.status === 'valid').length;
  const duplicateCount = parsedRows.filter((r) => r.status === 'duplicate').length;
  const invalidCount = parsedRows.filter((r) => r.status === 'invalid').length;

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-y-auto p-4 space-y-4 select-none">
      {/* Header Banner */}
      <div className="p-4 bg-surface border border-border rounded-xl shadow-xs space-y-1">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-primary" />
          <h1 className="text-base font-extrabold text-text tracking-tight">
            Nhập Liệu Từ Vựng Hàng Loạt & Kiểm Soát Trùng Lặp (Batch EAV Import)
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
            Rule FR-14 & FR-04
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Hỗ trợ Operator đưa danh sách từ vựng theo định dạng CSV vào hệ thống.
          Tự động phát hiện trùng lặp từ trong cùng một chủ đề (Canonical Topic Unique Rule) trước khi lưu.
        </p>
      </div>

      {commitSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{commitSuccess}</span>
        </div>
      )}

      {/* Configuration & Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Target Topic & Editor */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-4 bg-surface border border-border rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Chủ Đề Đích Tiếp Nhận Dữ Liệu
              </label>
              <span className="text-[11px] text-text-muted font-mono">
                {topics.length} chủ đề khả dụng
              </span>
            </div>

            <select
              value={targetTopicId}
              onChange={(e) => {
                setTargetTopicId(e.target.value);
                setIsValidated(false);
              }}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-text font-medium focus:outline-none focus:border-primary"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name} ({t.collectionName})
                </option>
              ))}
            </select>

            {/* CSV Textarea */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">
                  Dán Dữ Liệu CSV
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRawText(SAMPLE_CSV);
                    setIsValidated(false);
                  }}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Nạp Dữ Liệu Mẫu
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setIsValidated(false);
                }}
                rows={9}
                placeholder="word,phonetic,pos,cefr,definition_vi,example_en,example_vi"
                className="w-full p-2.5 rounded-lg bg-surface-subtle border border-border text-xs font-mono text-text focus:outline-none focus:border-primary focus:bg-surface transition-all leading-relaxed"
              />

              <div className="text-[10px] text-text-muted">
                Định dạng chuẩn: <code>word, phonetic, pos, cefr, definition_vi, example_en, example_vi</code>
              </div>
            </div>

            {/* Validation Action Button */}
            <button
              type="button"
              onClick={handleValidate}
              className="w-full py-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border hover:border-primary/40 text-xs font-bold text-text flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <RefreshCw size={13} className="text-primary" />
              <span>Kiểm Tra Cú Pháp & Phát Hiện Trùng Lặp</span>
            </button>
          </div>
        </div>

        {/* Right Col: Validation Summary & Actions */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-4 bg-surface border border-border rounded-xl space-y-3 shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-bold text-text">
                Kết Quả Phân Tích & Xác Thực (Validation Audit)
              </div>

              {!isValidated ? (
                <div className="p-8 text-center text-text-muted text-xs bg-surface-subtle/50 rounded-xl border border-dashed border-border">
                  Nhấp vào nút <strong>"Kiểm Tra Cú Pháp"</strong> bên cạnh để kiểm tra dữ liệu trước khi nạp.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Status Badges */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                      <div className="text-emerald-700 font-bold text-lg font-mono">
                        {validCount}
                      </div>
                      <div className="text-[10px] text-emerald-800 uppercase font-semibold">
                        Hợp Lệ
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
                      <div className="text-amber-700 font-bold text-lg font-mono">
                        {duplicateCount}
                      </div>
                      <div className="text-[10px] text-amber-800 uppercase font-semibold">
                        Trùng Lặp
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
                      <div className="text-rose-700 font-bold text-lg font-mono">
                        {invalidCount}
                      </div>
                      <div className="text-[10px] text-rose-800 uppercase font-semibold">
                        Lỗi Định Dạng
                      </div>
                    </div>
                  </div>

                  {/* Duplicate & Error details */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                    {parsedRows.map((row) => (
                      <div
                        key={row.id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                          row.status === 'valid'
                            ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                            : row.status === 'duplicate'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-rose-50/70 border-rose-200 text-rose-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {row.status === 'valid' && (
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          )}
                          {row.status === 'duplicate' && (
                            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                          )}
                          {row.status === 'invalid' && (
                            <XCircle size={13} className="text-rose-600 shrink-0" />
                          )}
                          <span className="font-bold">{row.word}</span>
                          <span className="text-text-muted font-mono text-[11px]">
                            ({row.partOfSpeech})
                          </span>
                        </div>

                        <span className="text-[10px] font-mono shrink-0 ml-2">
                          {row.validationMessage || 'OK'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Commit Action */}
            <div className="pt-3 border-t border-border">
              <button
                type="button"
                disabled={!isValidated || validCount === 0}
                onClick={handleCommit}
                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-surface-subtle disabled:text-text-light text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <CheckCircle2 size={14} />
                <span>
                  Lưu & Xuất Bản {validCount} Từ Hợp Lệ Vào Chủ Đề
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
