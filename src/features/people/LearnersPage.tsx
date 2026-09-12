import React, { useState, useMemo } from 'react';
import {
  LearnerProfile,
  StreakRecoveryRequest,
  LearnerAuditLogEntry,
  LearnersTabNavId,
  LearnerFilterState,
  StreakLossReason,
} from '../../domains/learners/types';
import {
  INITIAL_LEARNERS,
  INITIAL_STREAK_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from '../../domains/learners/mock-data';
import {
  computeLearnersRibbonMetrics,
  filterLearners,
} from '../../domains/learners/selectors';
import { LearnersMetricsRibbon } from './components/LearnersMetricsRibbon';
import { LearnersTabNav } from './components/LearnersTabNav';
import { LearnerDirectoryTab } from './components/LearnerDirectoryTab';
import { StreakRecoveryDeskTab } from './components/StreakRecoveryDeskTab';
import { FsrsAnalyticsTab } from './components/FsrsAnalyticsTab';
import { LearnerAuditLedgerTab } from './components/LearnerAuditLedgerTab';
import { Learner360Drawer } from './components/Learner360Drawer';
import { StreakRecoveryModal } from './components/StreakRecoveryModal';
import { AccountBanModal } from './components/AccountBanModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { LiveOpsGrantModal } from './components/LiveOpsGrantModal';
import { MobileLearnerSimulator } from './components/MobileLearnerSimulator';
import {
  Users,
  CheckCircle2,
} from 'lucide-react';

interface LearnersPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (wordName: string) => void;
}

const DEFAULT_FILTERS: LearnerFilterState = {
  searchQuery: '',
  status: 'ALL',
  cefr: 'ALL',
  league: 'ALL',
  streakTier: 'ALL',
  sortBy: 'lastActive',
  sortDirection: 'desc',
};

export const LearnersPage: React.FC<LearnersPageProps> = ({
  onNavigate: _onNavigate,
  onWordChange: _onWordChange,
}) => {
  // 1. Navigation & UI States
  const [activeTab, setActiveTab] = useState<LearnersTabNavId>('roster');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulatorVisible, setIsSimulatorVisible] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Domain Data States
  const [learners, setLearners] = useState<LearnerProfile[]>(INITIAL_LEARNERS);
  const [streakRequests, setStreakRequests] =
    useState<StreakRecoveryRequest[]>(INITIAL_STREAK_REQUESTS);
  const [auditLogs, setAuditLogs] =
    useState<LearnerAuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // 3. Selection & Filter States
  const [filterState, setFilterState] =
    useState<LearnerFilterState>(DEFAULT_FILTERS);
  const [selectedLearner, setSelectedLearner] =
    useState<LearnerProfile | null>(INITIAL_LEARNERS[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // 4. Modal States
  const [streakModalLearner, setStreakModalLearner] =
    useState<LearnerProfile | null>(null);
  const [banModalLearner, setBanModalLearner] =
    useState<LearnerProfile | null>(null);
  const [resetPassModalLearner, setResetPassModalLearner] =
    useState<LearnerProfile | null>(null);
  const [grantModalLearner, setGrantModalLearner] =
    useState<LearnerProfile | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selectors
  const ribbonMetrics = useMemo(
    () => computeLearnersRibbonMetrics(learners, streakRequests),
    [learners, streakRequests]
  );

  const filteredLearnersList = useMemo(
    () => filterLearners(learners, filterState),
    [learners, filterState]
  );

  // Handler Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Đã đồng bộ dữ liệu học viên mới nhất từ hệ thống.');
    }, 400);
  };

  // Handlers for Modals
  const handleConfirmStreakRecovery = (
    learnerId: string,
    targetStreak: number,
    ticketId: string,
    reason: string,
    category: StreakLossReason
  ) => {
    const target = learners.find((l) => l.id === learnerId);
    if (!target) return;

    const oldStreak = target.streak.currentStreak;

    // 1. Cập nhật Learner
    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === learnerId) {
          return {
            ...l,
            streak: {
              ...l.streak,
              currentStreak: targetStreak,
              maxStreak: Math.max(l.streak.maxStreak, targetStreak),
              isAtRisk: false,
              recoveredCount: l.streak.recoveredCount + 1,
            },
          };
        }
        return l;
      })
    );

    // 2. Thêm vào Audit Log
    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: target.id,
      learnerName: target.fullName,
      action: 'STREAK_RECOVERED',
      operatorName: 'Lead Admin Console',
      ticketId,
      timestamp: new Date().toISOString(),
      details: `Khôi phục chuỗi Streak từ ${oldStreak} ngày lên ${targetStreak} ngày (${category})`,
      previousValue: `${oldStreak} ngày`,
      newValue: `${targetStreak} ngày`,
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // 3. Nếu có ticket trùng mã trong queue, update thành approved
    setStreakRequests((prev) =>
      prev.map((r) => {
        if (r.ticketId.toLowerCase() === ticketId.toLowerCase()) {
          return {
            ...r,
            status: 'approved',
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'Lead Admin Console',
            resolutionReason: reason,
          };
        }
        return r;
      })
    );

    // Cập nhật selectedLearner nếu đang chọn
    if (selectedLearner?.id === learnerId) {
      setSelectedLearner((prev) =>
        prev
          ? {
              ...prev,
              streak: {
                ...prev.streak,
                currentStreak: targetStreak,
                maxStreak: Math.max(prev.streak.maxStreak, targetStreak),
                isAtRisk: false,
              },
            }
          : null
      );
    }

    showToast(`Đã khôi phục thành công chuỗi ${targetStreak} ngày cho ${target.fullName}!`);
  };

  const handleConfirmBan = (
    learnerId: string,
    duration: '24h' | '7d' | '30d' | 'permanent',
    reason: string,
    ticketId: string
  ) => {
    const target = learners.find((l) => l.id === learnerId);
    if (!target) return;

    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === learnerId) {
          return {
            ...l,
            status: 'suspended',
            banInfo: {
              bannedAt: new Date().toISOString(),
              bannedBy: 'Lead Admin Console',
              reason,
              banDuration: duration,
            },
          };
        }
        return l;
      })
    );

    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: target.id,
      learnerName: target.fullName,
      action: 'ACCOUNT_BANNED',
      operatorName: 'Lead Admin Console',
      ticketId,
      timestamp: new Date().toISOString(),
      details: `Khóa tài khoản thời hạn ${duration}`,
      previousValue: 'active',
      newValue: `suspended (${duration})`,
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Đã khóa tài khoản của ${target.fullName} (${duration}).`);
  };

  const handleConfirmUnban = (learnerId: string, reason: string, ticketId: string) => {
    const target = learners.find((l) => l.id === learnerId);
    if (!target) return;

    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === learnerId) {
          return {
            ...l,
            status: 'active',
            banInfo: undefined,
          };
        }
        return l;
      })
    );

    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: target.id,
      learnerName: target.fullName,
      action: 'ACCOUNT_UNBANNED',
      operatorName: 'Lead Admin Console',
      ticketId,
      timestamp: new Date().toISOString(),
      details: 'Mở khóa và khôi phục quyền truy cập bình thường',
      previousValue: 'suspended',
      newValue: 'active',
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Đã mở khóa tài khoản của ${target.fullName} thành công.`);
  };

  const handleConfirmResetPassword = (
    learnerId: string,
    resetType: 'email_link' | 'temp_password',
    tempPassword: string,
    reason: string,
    ticketId: string
  ) => {
    const target = learners.find((l) => l.id === learnerId);
    if (!target) return;

    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: target.id,
      learnerName: target.fullName,
      action: 'PASSWORD_RESET',
      operatorName: 'Lead Admin Console',
      ticketId,
      timestamp: new Date().toISOString(),
      details:
        resetType === 'email_link'
          ? `Gửi liên kết đổi mật khẩu tới ${target.email}`
          : `Tạo mật khẩu tạm thời (${tempPassword})`,
      previousValue: 'Mật khẩu cũ',
      newValue: resetType === 'email_link' ? 'Đã gửi link reset' : 'Đã cấp mật khẩu tạm',
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(
      resetType === 'email_link'
        ? `Đã gửi liên kết khôi phục mật khẩu tới ${target.email}.`
        : `Đã cấp mật khẩu tạm thành công cho ${target.fullName}!`
    );
  };

  const handleConfirmGrant = (
    learnerId: string,
    grantType: 'extra_scans' | 'currency_compensation',
    amount: number,
    currencyType: 'coins' | 'gems',
    reason: string,
    ticketId: string
  ) => {
    const target = learners.find((l) => l.id === learnerId);
    if (!target) return;

    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === learnerId) {
          if (grantType === 'extra_scans') {
            return {
              ...l,
              economy: {
                ...l.economy,
                dailyScanQuota: l.economy.dailyScanQuota + amount,
              },
            };
          } else {
            return {
              ...l,
              economy: {
                ...l.economy,
                coins: currencyType === 'coins' ? l.economy.coins + amount : l.economy.coins,
                gems: currencyType === 'gems' ? l.economy.gems + amount : l.economy.gems,
              },
            };
          }
        }
        return l;
      })
    );

    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: target.id,
      learnerName: target.fullName,
      action: grantType === 'extra_scans' ? 'QUOTA_ADJUSTED' : 'CURRENCY_COMPENSATED',
      operatorName: 'Lead Admin Console',
      ticketId,
      timestamp: new Date().toISOString(),
      details:
        grantType === 'extra_scans'
          ? `Tặng thêm +${amount} lượt AI Camera scan hôm nay`
          : `Cấp bù +${amount} ${currencyType}`,
      previousValue:
        grantType === 'extra_scans'
          ? `${target.economy.dailyScanQuota} lượt`
          : `${currencyType === 'coins' ? target.economy.coins : target.economy.gems}`,
      newValue:
        grantType === 'extra_scans'
          ? `${target.economy.dailyScanQuota + amount} lượt`
          : `${(currencyType === 'coins' ? target.economy.coins : target.economy.gems) + amount}`,
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(
      grantType === 'extra_scans'
        ? `Đã tặng +${amount} lượt AI scan hôm nay cho ${target.fullName}!`
        : `Đã cấp bù +${amount} ${currencyType} cho ${target.fullName}!`
    );
  };

  const handleBulkGrantQuota = (learnerIds: string[]) => {
    setLearners((prev) =>
      prev.map((l) => {
        if (learnerIds.includes(l.id)) {
          return {
            ...l,
            economy: {
              ...l.economy,
              dailyScanQuota: l.economy.dailyScanQuota + 5,
            },
          };
        }
        return l;
      })
    );

    const newLogs: LearnerAuditLogEntry[] = learnerIds.map((id) => {
      const item = learners.find((l) => l.id === id);
      return {
        id: `AUD-BULK-${id}-${Date.now()}`,
        learnerId: id,
        learnerName: item?.fullName || id,
        action: 'QUOTA_ADJUSTED',
        operatorName: 'Lead Admin Console',
        ticketId: 'TK-BULK-BOOST',
        timestamp: new Date().toISOString(),
        details: 'Cấp bù +5 lượt AI Scan theo thao tác hàng loạt (Bulk Action)',
        previousValue: '20 lượt',
        newValue: '25 lượt',
        reason: 'Chương trình LiveOps Boost diện rộng',
      };
    });
    setAuditLogs((prev) => [...newLogs, ...prev]);

    showToast(`Đã tặng +5 lượt AI Scan cho ${learnerIds.length} học viên được chọn!`);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Name,Email,CEFR,Status,Streak,MaxStreak,Coins,Gems,TotalCards,Mastered\n';
    const rows = filteredLearnersList
      .map(
        (l) =>
          `"${l.id}","${l.fullName}","${l.email}","${l.cefrLevel}","${l.status}",${l.streak.currentStreak},${l.streak.maxStreak},${l.economy.coins},${l.economy.gems},${l.fsrs.totalCards},${l.fsrs.cardsMastered}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `snapvocab-learners-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống tệp danh sách học viên định dạng CSV.');
  };

  // Streak recovery desk approvals
  const handleApproveStreakRequest = (req: StreakRecoveryRequest, reason: string) => {
    handleConfirmStreakRecovery(
      req.learnerId,
      req.targetStreakDays,
      req.ticketId,
      reason,
      req.lossReason
    );
  };

  const handleRejectStreakRequest = (req: StreakRecoveryRequest, reason: string) => {
    setStreakRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? {
              ...r,
              status: 'rejected',
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Lead Admin Console',
              resolutionReason: reason,
            }
          : r
      )
    );

    const newLog: LearnerAuditLogEntry = {
      id: `AUD-${Date.now()}`,
      learnerId: req.learnerId,
      learnerName: req.learnerName,
      action: 'STREAK_RECOVERED',
      operatorName: 'Lead Admin Console',
      ticketId: req.ticketId,
      timestamp: new Date().toISOString(),
      details: `Từ chối yêu cầu khôi phục chuỗi ${req.lostStreakDays} ngày`,
      previousValue: 'Chờ duyệt',
      newValue: 'Đã từ chối',
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Đã từ chối yêu cầu của ${req.learnerName} (Mã: ${req.ticketId}).`);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background select-none overflow-hidden">
      {/* 1. Page Header Bar */}
      <div className="p-4 border-b border-border/70 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-text tracking-tight flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span>Quản Lý Học Viên & Vận Hành LiveOps</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold border border-primary/20">
              PEOPLE &bull; DATA 40%
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Hồ sơ người học 360 độ, kiểm toán tiến độ trí nhớ FSRS và công cụ phục hồi chuỗi Streak (LiveOps Guardrails)
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-medium font-mono">
              LiveOps Session Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top High-Density Metrics Ribbon */}
      <div className="p-4 pb-2 shrink-0">
        <LearnersMetricsRibbon
          metrics={ribbonMetrics}
          onJumpToStreakDesk={() => setActiveTab('streak-desk')}
        />
      </div>

      {/* 3. Sub-Tab Navigation Bar */}
      <div className="shrink-0">
        <LearnersTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingStreakCount={ribbonMetrics.pendingStreakAppeals}
          isSimulatorVisible={isSimulatorVisible}
          onToggleSimulator={() => setIsSimulatorVisible((prev) => !prev)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* 4. Split-Screen Main Content View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Active Tab View (Full Flex) */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'roster' && (
            <LearnerDirectoryTab
              learners={filteredLearnersList}
              filterState={filterState}
              onFilterChange={(newFilters) =>
                setFilterState((prev) => ({ ...prev, ...newFilters }))
              }
              onResetFilters={() => setFilterState(DEFAULT_FILTERS)}
              onSelectLearner={(learner) => {
                setSelectedLearner(learner);
                setIsDrawerOpen(true);
              }}
              selectedLearnerId={selectedLearner?.id}
              onOpenStreakRecoveryModal={(l) => setStreakModalLearner(l)}
              onOpenBanModal={(l) => setBanModalLearner(l)}
              onOpenResetPassModal={(l) => setResetPassModalLearner(l)}
              onOpenGrantModal={(l) => setGrantModalLearner(l)}
              onBulkGrantQuota={handleBulkGrantQuota}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'streak-desk' && (
            <StreakRecoveryDeskTab
              requests={streakRequests}
              onApproveRequest={handleApproveStreakRequest}
              onRejectRequest={handleRejectStreakRequest}
              onOpenManualRecovery={() => {
                if (selectedLearner) setStreakModalLearner(selectedLearner);
                else if (learners.length > 0) setStreakModalLearner(learners[0]);
              }}
            />
          )}

          {activeTab === 'retention-fsrs' && (
            <FsrsAnalyticsTab learners={learners} />
          )}

          {activeTab === 'audit-log' && (
            <LearnerAuditLedgerTab auditLogs={auditLogs} />
          )}
        </div>

        {/* Right Side: Interactive Mobile Simulator Preview */}
        {isSimulatorVisible && activeTab === 'roster' && (
          <MobileLearnerSimulator
            learner={selectedLearner}
            onClose={() => setIsSimulatorVisible(false)}
          />
        )}
      </div>

      {/* 5. Modals & Sliding 360 Drawer */}
      <Learner360Drawer
        learner={selectedLearner}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenStreakRecovery={(l) => setStreakModalLearner(l)}
        onOpenBanModal={(l) => setBanModalLearner(l)}
        onOpenResetPass={(l) => setResetPassModalLearner(l)}
        onOpenGrantModal={(l) => setGrantModalLearner(l)}
      />

      <StreakRecoveryModal
        learner={streakModalLearner}
        isOpen={!!streakModalLearner}
        onClose={() => setStreakModalLearner(null)}
        onConfirm={handleConfirmStreakRecovery}
      />

      <AccountBanModal
        learner={banModalLearner}
        isOpen={!!banModalLearner}
        onClose={() => setBanModalLearner(null)}
        onConfirmBan={(id, duration, reason, ticket) =>
          handleConfirmBan(id, duration, reason, ticket)
        }
        onConfirmUnban={(id, reason, ticket) =>
          handleConfirmUnban(id, reason, ticket)
        }
      />

      <ResetPasswordModal
        learner={resetPassModalLearner}
        isOpen={!!resetPassModalLearner}
        onClose={() => setResetPassModalLearner(null)}
        onConfirm={handleConfirmResetPassword}
      />

      <LiveOpsGrantModal
        learner={grantModalLearner}
        isOpen={!!grantModalLearner}
        onClose={() => setGrantModalLearner(null)}
        onConfirmGrant={handleConfirmGrant}
      />

      {/* 6. Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <CheckCircle2 size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
