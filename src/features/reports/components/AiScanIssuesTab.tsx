import React, { useState } from 'react';
import { IssueReportItem } from '../../../domains/issue-reports/types';
import { CEFRLevel } from '../../../domains/flashcard/types';
import {
  Camera,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertTriangle,
  ZoomIn,
  Eye,
  Send,
  Coins,
} from 'lucide-react';

interface AiScanIssuesTabProps {
  issues: IssueReportItem[];
  onCorrectAiScan: (
    issueId: string,
    correctedWord: string,
    cefr: CEFRLevel,
    meaningVi: string,
    pushToDataset: boolean,
    rewardCoins: number,
    auditReason: string
  ) => void;
  onSelectIssue: (issue: IssueReportItem) => void;
}

export const AiScanIssuesTab: React.FC<AiScanIssuesTabProps> = ({
  issues,
  onCorrectAiScan,
  onSelectIssue,
}) => {
  const scanIssues = issues.filter((i) => i.category === 'AI_SCAN');

  const [activeScanId, setActiveScanId] = useState<string>(
    scanIssues[0]?.id || ''
  );

  const currentIssue =
    scanIssues.find((i) => i.id === activeScanId) || scanIssues[0];

  // Form State for 1-Click Correction
  const [correctedWord, setCorrectedWord] = useState<string>(
    currentIssue?.suggestedWord || currentIssue?.targetWord || ''
  );
  const [correctedCefr, setCorrectedCefr] = useState<CEFRLevel>(
    currentIssue?.targetCefr || 'B1'
  );
  const [correctedMeaningVi, setCorrectedMeaningVi] = useState<string>('bình giữ nhiệt (thermos)');
  const [pushToDataset, setPushToDataset] = useState<boolean>(true);
  const [rewardCoins, setRewardCoins] = useState<number>(20);
  const [auditReason, setAuditReason] = useState<string>(
    'Xác nhận ảnh thực tế: Đổi nhãn sang từ chuẩn xác và nạp vào fine-tuning Gemini Vision.'
  );

  // Sync state when active scan item changes
  const handleSelectScanItem = (issue: IssueReportItem) => {
    setActiveScanId(issue.id);
    setCorrectedWord(issue.suggestedWord || issue.targetWord || '');
    setCorrectedCefr(issue.targetCefr || 'B1');

    if (issue.targetWord === 'thermos') {
      setCorrectedMeaningVi('bình giữ nhiệt, bình chân không');
    } else if (issue.targetWord === 'workbook') {
      setCorrectedMeaningVi('sách bài tập thực hành ngữ pháp');
    } else if (issue.targetWord === 'eyeglasses' || issue.suggestedWord === 'reading glasses') {
      setCorrectedMeaningVi('kính đọc sách, kính cận thị');
    } else {
      setCorrectedMeaningVi('');
    }
  };

  const handleExecuteCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIssue) return;
    onCorrectAiScan(
      currentIssue.id,
      correctedWord,
      correctedCefr,
      correctedMeaningVi,
      pushToDataset,
      rewardCoins,
      auditReason
    );
  };

  if (scanIssues.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted select-none">
        <CheckCircle2 size={32} className="mx-auto text-primary mb-2" />
        <h3 className="font-bold text-text text-base">
          Hàng đợi Active Learning trống
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Không có sự cố nhận diện camera nào cần giải quyết tại thời điểm này.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 select-none">
      {/* 1. Left List: P1 Queue Cards (4 Cols) */}
      <div className="lg:col-span-4 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
            <Flame size={14} className="text-snapy" />
            <span>Hàng Đợi Scan Khẩn Cấp (P1)</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-danger-light text-danger text-[10px] font-bold border border-danger/30">
            {scanIssues.filter((i) => i.status === 'PENDING').length} Chờ duyệt
          </span>
        </div>

        <div className="space-y-2">
          {scanIssues.map((issue) => {
            const isSelected = currentIssue?.id === issue.id;
            const isResolved = issue.status === 'RESOLVED';

            return (
              <div
                key={issue.id}
                onClick={() => handleSelectScanItem(issue)}
                className={`p-3 rounded-xl border transition-all cursor-pointer shadow-card ${
                  isSelected
                    ? 'bg-surface border-primary ring-1 ring-primary'
                    : 'bg-surface border-border hover:border-border-strong hover:bg-canvas/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border bg-black/5">
                    <img
                      src={issue.scanData?.thumbnailUrl}
                      alt={issue.targetWord || 'scan'}
                      className="w-full h-full object-cover"
                    />
                    {isResolved && (
                      <div className="absolute inset-0 bg-primary/40 flex items-center justify-center text-white">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-text-muted">
                        {issue.ticketId}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          isResolved
                            ? 'bg-primary-light text-primary border border-primary/20'
                            : 'bg-danger-light text-danger border border-danger/20 animate-pulse'
                        }`}
                      >
                        {isResolved ? 'Đã giải quyết' : 'P1 · Cần xử lý'}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-text mt-0.5 truncate">
                      {issue.title}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-muted">
                      <span className="bg-surface-subtle px-1.5 py-0.2 rounded border border-border font-medium">
                        AI: <strong className="text-danger">{issue.scanData?.predictedLabel}</strong> (
                        {Math.round((issue.scanData?.confidence || 0) * 100)}%)
                      </span>
                      <span>➔</span>
                      <span className="bg-primary-light/60 text-primary font-bold px-1.5 py-0.2 rounded border border-primary/20">
                        {issue.suggestedWord || issue.targetWord}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Workspace: Active Learning Console & 1-Click Correction (8 Cols) */}
      {currentIssue && (
        <div className="lg:col-span-8 bg-surface border border-border rounded-xl shadow-card p-4 space-y-4">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20">
                  {currentIssue.ticketId}
                </span>
                <span className="text-xs font-bold text-text">
                  Bàn Phê Duyệt Active Learning Gemini Vision (§7.2)
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Người học <strong className="text-text">{currentIssue.learner.fullName}</strong> ({currentIssue.learner.cefrLevel}) báo cáo từ thiết bị {currentIssue.deviceInfo.deviceModel} lúc {new Date(currentIssue.reportedAt).toLocaleTimeString('vi-VN')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectIssue(currentIssue)}
              className="text-xs font-semibold text-text-muted hover:text-text px-2.5 py-1 rounded-lg border border-border bg-surface-subtle hover:bg-surface flex items-center gap-1 transition-all"
            >
              <Eye size={13} />
              <span>Xem Hồ Sơ Sự Cố</span>
            </button>
          </div>

          {/* Side-by-Side Visual Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left: Original Photo with Bounding Box Overlay */}
            <div className="bg-canvas rounded-xl p-3 border border-border flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 z-10">
                <Camera size={11} /> Ảnh Gốc Camera
              </span>

              <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden border border-border bg-black/10 flex items-center justify-center">
                <img
                  src={currentIssue.scanData?.originalImageUrl}
                  alt="Original Capture"
                  className="w-full h-full object-contain"
                />

                {/* Simulated Bounding Box */}
                <div
                  className="absolute border-2 border-danger bg-danger/10 rounded-xs pointer-events-none transition-all flex items-start justify-start p-1"
                  style={{
                    top: '25%',
                    left: '28%',
                    width: '45%',
                    height: '52%',
                  }}
                >
                  <span className="text-[9px] font-bold bg-danger text-white px-1 rounded shadow-xs">
                    AI: {currentIssue.scanData?.predictedLabel} (
                    {Math.round((currentIssue.scanData?.confidence || 0) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-text-muted flex items-center justify-between w-full px-1">
                <span>Confidence: <strong className="text-danger">{Math.round((currentIssue.scanData?.confidence || 0) * 100)}% (Low)</strong></span>
                <span>Clip Score: <strong className="font-mono text-text">{currentIssue.scanData?.clipScore || 0.25}</strong></span>
              </div>
            </div>

            {/* Right: User Feedback & Analysis */}
            <div className="bg-surface-subtle rounded-xl p-3.5 border border-border flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold text-text uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle size={13} className="text-snapy" />
                  <span>Nội Dung Phản Hồi Từ Học Viên</span>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-border text-xs text-text italic leading-relaxed">
                  "{currentIssue.description}"
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Nhãn AI nhận diện:</span>
                    <span className="font-semibold text-danger bg-danger-light px-2 py-0.2 rounded border border-danger/20">
                      {currentIssue.scanData?.predictedLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Nhãn người học đề xuất:</span>
                    <span className="font-bold text-primary bg-primary-light px-2 py-0.2 rounded border border-primary/20">
                      {currentIssue.suggestedWord || currentIssue.targetWord}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-muted">Độ ưu tiên SLA:</span>
                    <span className="font-semibold text-text">
                      P1 · Hoàn thành trong 2 giờ
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              {currentIssue.status === 'RESOLVED' ? (
                <div className="p-3 rounded-lg bg-primary-light border border-primary/30 text-primary text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>
                    Sự cố đã được giải quyết! Đã xuất mẫu vào tập dữ liệu Gemini Vision.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-snapy-light border border-snapy/30 text-snapy text-[11px] flex items-center gap-1.5">
                  <Sparkles size={14} className="shrink-0" />
                  <span>
                    1-Click Correction sẽ tự động cập nhật từ điển và thêm ảnh vào tập fine-tuning.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Action: 1-Click Correction Console */}
          {currentIssue.status !== 'RESOLVED' && (
            <form
              onSubmit={handleExecuteCorrection}
              className="p-3.5 bg-canvas rounded-xl border border-primary/30 space-y-3"
            >
              <div className="text-xs font-bold text-text flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                <span>Bàn Can Thiệp 1-Click Correction (Active Learning Engine)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Corrected Label */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Nhãn Từ Chuẩn Xác (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={correctedWord}
                    onChange={(e) => setCorrectedWord(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-bold text-text focus:outline-none focus:border-primary"
                    placeholder="e.g. thermos, workbook"
                  />
                </div>

                {/* 2. CEFR Level */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Cấp Độ CEFR *
                  </label>
                  <select
                    value={correctedCefr}
                    onChange={(e) =>
                      setCorrectedCefr(e.target.value as CEFRLevel)
                    }
                    className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-text focus:outline-none focus:border-primary"
                  >
                    <option value="A1">A1 · Sơ Cấp (Beginner)</option>
                    <option value="A2">A2 · Cơ Bản (Elementary)</option>
                    <option value="B1">B1 · Trung Cấp (Intermediate)</option>
                    <option value="B2">B2 · Trên Trung Cấp (Upper)</option>
                    <option value="C1">C1 · Cao Cấp (Advanced)</option>
                    <option value="C2">C2 · Thành Thạo (Mastery)</option>
                  </select>
                </div>

                {/* 3. Meaning */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Định Nghĩa Tiếng Việt *
                  </label>
                  <input
                    type="text"
                    required
                    value={correctedMeaningVi}
                    onChange={(e) => setCorrectedMeaningVi(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-text focus:outline-none focus:border-primary"
                    placeholder="e.g. bình giữ nhiệt, bình chân không"
                  />
                </div>
              </div>

              {/* Checkboxes: Dataset & Reward */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-text">
                    <input
                      type="checkbox"
                      checked={pushToDataset}
                      onChange={(e) => setPushToDataset(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium text-[11px]">
                      Đưa ảnh vào tập huấn luyện Gemini Vision Fine-tuning
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-text">
                    <input
                      type="checkbox"
                      checked={rewardCoins > 0}
                      onChange={(e) =>
                        setRewardCoins(e.target.checked ? 20 : 0)
                      }
                      className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium text-[11px] flex items-center gap-1">
                      <Coins size={12} className="text-reward" />
                      Tặng thưởng <strong className="text-primary font-bold">+20 Coins</strong> cho người học
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <CheckCircle2 size={15} />
                  <span>Duyệt Nhãn Chuẩn & Xuất Bản (1-Click)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
