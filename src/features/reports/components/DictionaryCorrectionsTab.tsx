import React, { useState } from 'react';
import { IssueReportItem } from '../../../domains/issue-reports/types';
import {
  BookOpen,
  CheckCircle2,
  Volume2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Send,
  X,
  Plus,
} from 'lucide-react';

interface DictionaryCorrectionsTabProps {
  issues: IssueReportItem[];
  onQuickUpdateVocab: (
    issueId: string,
    word: string,
    updatedMeaningVi: string,
    updatedIpa: string,
    rewardCoins: number,
    auditReason: string
  ) => void;
  onOpenInContentStudio?: (word: string) => void;
  onDismissIssue: (issueId: string, reason: string) => void;
  onSelectIssue: (issue: IssueReportItem) => void;
}

export const DictionaryCorrectionsTab: React.FC<DictionaryCorrectionsTabProps> = ({
  issues,
  onQuickUpdateVocab,
  onOpenInContentStudio,
  onDismissIssue,
  onSelectIssue,
}) => {
  const vocabIssues = issues.filter((i) => i.category === 'VOCABULARY');

  const [activeVocabId, setActiveVocabId] = useState<string>(
    vocabIssues[0]?.id || ''
  );

  const currentIssue =
    vocabIssues.find((i) => i.id === activeVocabId) || vocabIssues[0];

  // Inline edit state
  const [editedMeaning, setEditedMeaning] = useState<string>(
    currentIssue?.vocabData?.suggestedMeaningVi ||
      currentIssue?.vocabData?.currentMeaningVi ||
      ''
  );
  const [editedIpa, setEditedIpa] = useState<string>(
    currentIssue?.vocabData?.suggestedIpa ||
      currentIssue?.vocabData?.currentIpa ||
      ''
  );
  const [rewardCoins, setRewardCoins] = useState<number>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Sync state when active issue changes
  const handleSelectIssue = (issue: IssueReportItem) => {
    setActiveVocabId(issue.id);
    setEditedMeaning(
      issue.vocabData?.suggestedMeaningVi ||
        issue.vocabData?.currentMeaningVi ||
        ''
    );
    setEditedIpa(
      issue.vocabData?.suggestedIpa || issue.vocabData?.currentIpa || ''
    );
  };

  // Play audio test with Web Speech Synthesis
  const handlePlayTTS = (wordText: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleApplyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIssue || !currentIssue.targetWord) return;
    onQuickUpdateVocab(
      currentIssue.id,
      currentIssue.targetWord,
      editedMeaning,
      editedIpa,
      rewardCoins,
      `Cập nhật nội dung từ vựng theo báo cáo học viên (Ticket: ${currentIssue.ticketId})`
    );
  };

  if (vocabIssues.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted select-none">
        <CheckCircle2 size={32} className="mx-auto text-primary mb-2" />
        <h3 className="font-bold text-text text-base">
          Không có khiếu nại từ vựng
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Toàn bộ các phản hồi về nghĩa, phiên âm và âm thanh đã được duyệt hoàn tất.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 select-none">
      {/* 1. Left List: Vocabulary Issues (4 Cols) */}
      <div className="lg:col-span-4 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={14} className="text-info" />
            <span>Danh Sách Báo Lỗi Từ Vựng</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-info-light text-info text-[10px] font-bold border border-info/30">
            {vocabIssues.filter((i) => i.status !== 'RESOLVED').length} Chờ duyệt
          </span>
        </div>

        <div className="space-y-2">
          {vocabIssues.map((issue) => {
            const isSelected = currentIssue?.id === issue.id;
            const isResolved = issue.status === 'RESOLVED';

            return (
              <div
                key={issue.id}
                onClick={() => handleSelectIssue(issue)}
                className={`p-3 rounded-xl border transition-all cursor-pointer shadow-card ${
                  isSelected
                    ? 'bg-surface border-info ring-1 ring-info'
                    : 'bg-surface border-border hover:border-border-strong hover:bg-canvas/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-info-light text-info font-bold text-xs flex items-center justify-center border border-info/20">
                      📖
                    </span>
                    <div>
                      <div className="font-mono text-[10px] text-text-muted font-bold">
                        {issue.ticketId}
                      </div>
                      <div className="font-bold text-xs text-text flex items-center gap-1.5">
                        <span className="text-primary">{issue.targetWord}</span>
                        {issue.targetCefr && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle border border-border">
                            {issue.targetCefr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isResolved
                        ? 'bg-primary-light text-primary border border-primary/20'
                        : 'bg-info-light text-info border border-info/20'
                    }`}
                  >
                    {isResolved ? 'Đã duyệt' : 'Cần xử lý'}
                  </span>
                </div>

                <div className="text-[11px] text-text-muted mt-2 truncate">
                  {issue.title}
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-text-muted">
                  <span>Báo bởi: {issue.learner.fullName}</span>
                  <span className="capitalize">{issue.subCategory.toLowerCase().replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Workspace: Side-by-Side Diff & Quick Edit (8 Cols) */}
      {currentIssue && (
        <div className="lg:col-span-8 bg-surface border border-border rounded-xl shadow-card p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-info bg-info-light px-2 py-0.5 rounded border border-info/20">
                  {currentIssue.ticketId}
                </span>
                <span className="font-extrabold text-sm text-text">
                  Từ Vựng: <strong className="text-primary font-black">"{currentIssue.targetWord}"</strong>
                </span>
                {currentIssue.targetCefr && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary-light text-primary border border-primary/20">
                    CEFR {currentIssue.targetCefr}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {currentIssue.title} • Báo cáo bởi {currentIssue.learner.fullName} ({currentIssue.learner.email})
              </p>
            </div>

            {/* Quick action jump to Content Studio */}
            {currentIssue.targetWord && onOpenInContentStudio && (
              <button
                type="button"
                onClick={() =>
                  onOpenInContentStudio(currentIssue.targetWord!)
                }
                className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary-light hover:bg-primary-light/80 text-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                title="Mở trong Content Studio để chỉnh sửa chuyên sâu"
              >
                <ExternalLink size={13} />
                <span>Mở trong Content Studio</span>
              </button>
            )}
          </div>

          {/* Side-by-Side Diff Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left: Dữ liệu hiện tại trong Từ Điển */}
            <div className="bg-canvas rounded-xl p-3.5 border border-border space-y-2.5">
              <div className="text-[11px] font-bold text-danger uppercase tracking-wider flex items-center justify-between">
                <span>Dữ Liệu Hiện Tại (Hệ Thống)</span>
                <span className="text-[10px] bg-danger-light text-danger px-1.5 py-0.2 rounded border border-danger/20 font-semibold">
                  Cần xem lại
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Phiên âm IPA:
                  </span>
                  <div className="font-mono text-xs font-bold text-text bg-surface p-1.5 rounded border border-border flex items-center justify-between">
                    <span>{currentIssue.vocabData?.currentIpa || '---'}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handlePlayTTS(currentIssue.targetWord || '')
                      }
                      className="text-text-muted hover:text-info"
                      title="Nghe phát âm"
                    >
                      <Volume2 size={14} className={isPlayingAudio ? 'animate-bounce text-info' : ''} />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Nghĩa Tiếng Việt:
                  </span>
                  <div className="text-xs text-text bg-surface p-2 rounded border border-border leading-relaxed">
                    {currentIssue.vocabData?.currentMeaningVi || 'Chưa có định nghĩa'}
                  </div>
                </div>

                {currentIssue.vocabData?.currentExampleEn && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted block">
                      Câu ví dụ hiện tại:
                    </span>
                    <div className="text-xs text-text bg-surface p-2 rounded border border-border">
                      <p className="font-medium text-text">
                        {currentIssue.vocabData.currentExampleEn}
                      </p>
                      <p className="text-text-muted text-[11px] mt-0.5 italic">
                        {currentIssue.vocabData.currentExampleVi || '---'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Gợi ý sửa đổi của Người Học */}
            <div className="bg-primary-light/10 rounded-xl p-3.5 border border-primary/30 space-y-2.5">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Đề Xuất Sửa Đổi (Learner Góp Ý)</span>
                <span className="text-[10px] bg-primary-light text-primary px-1.5 py-0.2 rounded border border-primary/20 font-semibold">
                  Góp ý chuẩn
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Đề xuất phiên âm IPA:
                  </span>
                  <div className="font-mono text-xs font-bold text-primary bg-surface p-1.5 rounded border border-primary/30">
                    {currentIssue.vocabData?.suggestedIpa ||
                      currentIssue.vocabData?.currentIpa ||
                      '---'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Đề xuất nghĩa tiếng Việt:
                  </span>
                  <div className="text-xs text-text bg-surface p-2 rounded border border-primary/30 leading-relaxed font-medium">
                    {currentIssue.vocabData?.suggestedMeaningVi ||
                      currentIssue.description}
                  </div>
                </div>

                {currentIssue.vocabData?.suggestedExampleVi && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted block">
                      Dịch ví dụ đề xuất:
                    </span>
                    <div className="text-xs text-primary bg-surface p-2 rounded border border-primary/30 font-medium">
                      {currentIssue.vocabData.suggestedExampleVi}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Edit & Publish Form */}
          {currentIssue.status !== 'RESOLVED' && (
            <form
              onSubmit={handleApplyUpdate}
              className="p-3.5 bg-canvas rounded-xl border border-border space-y-3"
            >
              <div className="text-xs font-bold text-text flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  <span>Biên Tập Nhanh & Cập Nhật Từ Điển (MH-ADM-06)</span>
                </span>
                <span className="text-[10px] text-text-muted">
                  Áp dụng tức thì vào cơ sở dữ liệu từ vựng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Edit IPA */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Phiên âm IPA chuẩn
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editedIpa}
                      onChange={(e) => setEditedIpa(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono font-bold text-text focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => handlePlayTTS(currentIssue.targetWord || '')}
                      className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-info transition-all"
                      title="Nghe thử âm thanh"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Edit Meaning */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Nghĩa tiếng Việt chuẩn
                  </label>
                  <input
                    type="text"
                    required
                    value={editedMeaning}
                    onChange={(e) => setEditedMeaning(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-text focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                <label className="flex items-center gap-1.5 text-xs text-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rewardCoins > 0}
                    onChange={(e) => setRewardCoins(e.target.checked ? 20 : 0)}
                    className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-medium">
                    Tặng <strong className="text-primary font-bold">+20 Coins</strong> tri ân người học đóng góp
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onDismissIssue(
                        currentIssue.id,
                        'Từ điển hệ thống đã được đối chiếu chuẩn Oxford/Cambridge.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-danger font-medium text-xs transition-all"
                  >
                    Bác bỏ báo cáo
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <CheckCircle2 size={14} />
                    <span>Duyệt & Lưu Vào Từ Điển</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
