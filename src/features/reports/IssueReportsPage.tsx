import React, { useState, useMemo } from 'react';
import {
  IssueReportItem,
  IssueFilterState,
  IssueTabNavId,
  IssueResolutionAction,
} from '../../domains/issue-reports/types';
import { CEFRLevel } from '../../domains/flashcard/types';
import { INITIAL_ISSUE_REPORTS } from '../../domains/issue-reports/mock-data';
import {
  computeIssueRibbonMetrics,
  filterIssueReports,
} from '../../domains/issue-reports/selectors';
import { IssueReportsMetricsRibbon } from './components/IssueReportsMetricsRibbon';
import { IssueReportsTabNav } from './components/IssueReportsTabNav';
import { MasterIssueQueueTab } from './components/MasterIssueQueueTab';
import { AiScanIssuesTab } from './components/AiScanIssuesTab';
import { DictionaryCorrectionsTab } from './components/DictionaryCorrectionsTab';
import { ResolutionAuditLedgerTab } from './components/ResolutionAuditLedgerTab';
import { IssueDetailDrawer } from './components/IssueDetailDrawer';
import { QuickResolveModal } from './components/QuickResolveModal';
import { MobileIssueSimulator } from './components/MobileIssueSimulator';
import {
  AlertTriangle,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface IssueReportsPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (wordName: string) => void;
}

const DEFAULT_FILTERS: IssueFilterState = {
  searchQuery: '',
  category: 'ALL',
  priority: 'ALL',
  status: 'ALL',
  platform: 'ALL',
  sortBy: 'reportedAt',
  sortDirection: 'desc',
};

export const IssueReportsPage: React.FC<IssueReportsPageProps> = ({
  onNavigate,
  onWordChange,
}) => {
  // 1. UI & Navigation States
  const [activeTab, setActiveTab] = useState<IssueTabNavId>('master-queue');
  const [isSimulatorVisible, setIsSimulatorVisible] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Data States
  const [issues, setIssues] = useState<IssueReportItem[]>(INITIAL_ISSUE_REPORTS);
  const [filterState, setFilterState] = useState<IssueFilterState>(DEFAULT_FILTERS);
  const [selectedIssue, setSelectedIssue] = useState<IssueReportItem | null>(
    INITIAL_ISSUE_REPORTS[0] || null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [quickResolveIssue, setQuickResolveIssue] =
    useState<IssueReportItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics & Filtered list memoization
  const metrics = useMemo(() => computeIssueRibbonMetrics(issues), [issues]);
  const filteredIssues = useMemo(
    () => filterIssueReports(issues, filterState),
    [issues, filterState]
  );

  // Handlers
  const handleSelectIssue = (issue: IssueReportItem) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Đã làm mới dữ liệu sự cố và hàng đợi Active Learning!');
    }, 600);
  };

  // Jump to Content Studio with word loaded
  const handleOpenInContentStudio = (word: string) => {
    if (onWordChange) {
      onWordChange(word.toLowerCase());
    }
    if (onNavigate) {
      onNavigate('content-studio');
    }
  };

  // Jump to Learners 360 profile
  const handleNavigateToLearner = (_learnerId: string) => {
    if (onNavigate) {
      onNavigate('learners');
    }
  };

  // 1-Click Correction for AI Scan (Active Learning loop §7.2)
  const handleCorrectAiScan = (
    issueId: string,
    correctedWord: string,
    cefr: CEFRLevel,
    meaningVi: string,
    pushToDataset: boolean,
    rewardCoins: number,
    auditReason: string
  ) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updated: IssueReportItem = {
            ...item,
            status: 'RESOLVED',
            targetWord: correctedWord,
            suggestedWord: correctedWord,
            targetCefr: cefr,
            scanData: item.scanData
              ? {
                  ...item.scanData,
                  suggestedLabel: correctedWord,
                  pushedToFineTuning: pushToDataset,
                }
              : undefined,
            vocabData: {
              targetWord: correctedWord,
              currentMeaningVi: meaningVi,
              currentIpa: '/ˈθɜː.məs/',
            },
            resolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Admin Duyệt Viên',
              actionTaken: 'LABEL_CORRECTED_AND_DATASET_SAVED',
              resolutionNotes: auditReason,
              compensationCoins: rewardCoins,
              pushNotificationSent: true,
              notificationTitle: 'Báo cáo nhận diện AI đã được duyệt! 🦊',
              notificationBody: `Từ "${correctedWord}" đã được cập nhật. Bạn nhận được +${rewardCoins} Coins!`,
            },
          };
          setSelectedIssue(updated);
          return updated;
        }
        return item;
      })
    );

    showToast(
      `Đã duyệt nhãn "${correctedWord}" (${cefr}), xuất vào dataset Gemini Vision và tặng +${rewardCoins} Coins!`
    );
  };

  // Quick update for vocabulary
  const handleQuickUpdateVocab = (
    issueId: string,
    word: string,
    updatedMeaningVi: string,
    updatedIpa: string,
    rewardCoins: number,
    auditReason: string
  ) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updated: IssueReportItem = {
            ...item,
            status: 'RESOLVED',
            vocabData: item.vocabData
              ? {
                  ...item.vocabData,
                  currentMeaningVi: updatedMeaningVi,
                  currentIpa: updatedIpa,
                }
              : undefined,
            resolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Lead Content Admin',
              actionTaken: 'VOCABULARY_UPDATED_INLINE',
              resolutionNotes: auditReason,
              compensationCoins: rewardCoins,
              pushNotificationSent: true,
              notificationTitle: 'Nội dung từ vựng đã được cập nhật! 📚',
              notificationBody: `Góp ý cho từ "${word}" đã được áp dụng vào từ điển. Cảm ơn bạn!`,
            },
          };
          setSelectedIssue(updated);
          return updated;
        }
        return item;
      })
    );

    showToast(`Đã duyệt & cập nhật từ điển cho từ "${word}" thành công!`);
  };

  // Dismiss issue with reason
  const handleDismissIssue = (issueId: string, reason: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updated: IssueReportItem = {
            ...item,
            status: 'DISMISSED',
            resolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Admin Duyệt Viên',
              actionTaken: 'DISMISSED_INVALID',
              resolutionNotes: reason,
              pushNotificationSent: false,
            },
          };
          setSelectedIssue(updated);
          return updated;
        }
        return item;
      })
    );

    showToast(`Đã bác bỏ báo cáo sự cố (Mã: ${issueId}).`);
  };

  // Confirm quick resolve modal
  const handleConfirmResolveModal = (
    issueId: string,
    action: IssueResolutionAction,
    reason: string,
    coins: number,
    sendPush: boolean
  ) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updated: IssueReportItem = {
            ...item,
            status: 'RESOLVED',
            resolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Admin Duyệt Viên',
              actionTaken: action,
              resolutionNotes: reason,
              compensationCoins: coins,
              pushNotificationSent: sendPush,
              notificationTitle: 'Sự cố của bạn đã được giải quyết! 🦊',
              notificationBody: `Ban quản trị SnapVocab đã xử lý yêu cầu của bạn. Cảm ơn sự đồng hành!`,
            },
          };
          setSelectedIssue(updated);
          return updated;
        }
        return item;
      })
    );

    showToast(`Sự cố đã được giải quyết và lưu vào Sổ cái Kiểm toán!`);
  };

  // Bulk resolve
  const handleBulkResolve = (issueIds: string[]) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (issueIds.includes(item.id)) {
          return {
            ...item,
            status: 'RESOLVED',
            resolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Admin Duyệt Viên',
              actionTaken: 'VOCABULARY_UPDATED_INLINE',
              resolutionNotes: 'Giải quyết hàng loạt qua tác vụ Bulk Action.',
              compensationCoins: 10,
              pushNotificationSent: true,
            },
          };
        }
        return item;
      })
    );

    showToast(`Đã đánh dấu giải quyết hàng loạt ${issueIds.length} sự cố!`);
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvHeader =
      'TicketId,Priority,Category,Status,LearnerName,TargetWord,ReportedAt\n';
    const csvRows = issues
      .map(
        (i) =>
          `"${i.ticketId}","${i.priority}","${i.category}","${i.status}","${i.learner.fullName}","${i.targetWord || ''}","${i.reportedAt}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SnapVocab_Issue_Reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất danh sách sự cố dạng file CSV!');
  };

  return (
    <div className="h-full flex flex-col bg-background text-text overflow-hidden select-none">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-60 bg-text text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-surface border-b border-border px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium mb-0.5">
            <span>PEOPLE</span>
            <span>/</span>
            <span className="text-primary font-bold">Issue Reports</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-text tracking-tight flex items-center gap-2">
              <span>Báo Cáo Sự Cố & Active Learning Console</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger-light text-danger border border-danger/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              {metrics.urgentP1Count} P1 Khẩn Cấp
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Hàng đợi tiếp nhận lỗi nhận diện camera AI, khiếu nại nội dung từ điển và sự cố người học (§7.2 & MH-ADM-06).
          </p>
        </div>

        {/* Global Action Shortcut */}
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('learners')}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Users size={14} />
              <span>Quản Lý Người Học</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="p-4 pb-2 shrink-0">
        <IssueReportsMetricsRibbon
          metrics={metrics}
          onJumpToP1Scan={() => setActiveTab('ai-scan')}
          onJumpToDictionary={() => setActiveTab('dictionary')}
        />
      </div>

      {/* Sub-Tab Navigation */}
      <div className="shrink-0">
        <IssueReportsTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          urgentP1Count={metrics.urgentP1Count}
          vocabIssuesCount={metrics.dictionaryFixesCount}
          isSimulatorVisible={isSimulatorVisible}
          onToggleSimulator={() => setIsSimulatorVisible((prev) => !prev)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Main Workspace Area (Split View with Mobile Simulator) */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Active Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'master-queue' && (
            <MasterIssueQueueTab
              issues={filteredIssues}
              filterState={filterState}
              onFilterChange={(newF) =>
                setFilterState((prev) => ({ ...prev, ...newF }))
              }
              onResetFilters={() => setFilterState(DEFAULT_FILTERS)}
              onSelectIssue={handleSelectIssue}
              selectedIssueId={selectedIssue?.id}
              onOpenQuickResolveModal={(issue) => setQuickResolveIssue(issue)}
              onOpenInContentStudio={handleOpenInContentStudio}
              onBulkResolve={handleBulkResolve}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'ai-scan' && (
            <AiScanIssuesTab
              issues={issues}
              onCorrectAiScan={handleCorrectAiScan}
              onSelectIssue={handleSelectIssue}
            />
          )}

          {activeTab === 'dictionary' && (
            <DictionaryCorrectionsTab
              issues={issues}
              onQuickUpdateVocab={handleQuickUpdateVocab}
              onOpenInContentStudio={handleOpenInContentStudio}
              onDismissIssue={handleDismissIssue}
              onSelectIssue={handleSelectIssue}
            />
          )}

          {activeTab === 'resolution-ledger' && (
            <ResolutionAuditLedgerTab
              issues={issues}
              onSelectIssue={handleSelectIssue}
              onExportCsv={handleExportCsv}
            />
          )}
        </div>

        {/* Right Mobile iPhone Simulator Preview */}
        {isSimulatorVisible && (
          <div className="border-l border-border bg-surface/50 p-4 overflow-y-auto hidden xl:block shrink-0">
            <MobileIssueSimulator issue={selectedIssue} />
          </div>
        )}
      </div>

      {/* 360° Issue Detail Drawer */}
      <IssueDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        issue={selectedIssue}
        onOpenQuickResolveModal={(issue) => {
          setIsDrawerOpen(false);
          setQuickResolveIssue(issue);
        }}
        onOpenInContentStudio={handleOpenInContentStudio}
        onNavigateToLearner={handleNavigateToLearner}
      />

      {/* Quick Resolve Modal */}
      <QuickResolveModal
        isOpen={quickResolveIssue !== null}
        onClose={() => setQuickResolveIssue(null)}
        issue={quickResolveIssue}
        onConfirmResolve={handleConfirmResolveModal}
      />
    </div>
  );
};
