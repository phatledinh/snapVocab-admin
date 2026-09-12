import React, { useState, useEffect, useMemo } from 'react';
import {
  Season,
  LeagueConfig,
  SeasonTierRewardMatrix,
  LeaderboardStandingEntry,
  CohortGroup,
  AnomalyViolation,
  SeasonsTabNavId,
  SeasonStatus,
} from '../../domains/seasons/types';
import {
  INITIAL_SEASONS,
  INITIAL_LEAGUES,
  INITIAL_REWARD_MATRICES,
  INITIAL_COHORTS,
  INITIAL_STANDINGS,
  INITIAL_ANOMALIES,
} from '../../domains/seasons/mock-data';
import {
  computeSeasonsRibbonMetrics,
  computeEconomicForecast,
} from '../../domains/seasons/selectors';
import { SeasonsMetricsRibbon } from './components/SeasonsMetricsRibbon';
import { SeasonsTabNav } from './components/SeasonsTabNav';
import { SeasonScheduleTab } from './components/SeasonScheduleTab';
import { LeaguesTiersTab } from './components/LeaguesTiersTab';
import { SeasonRewardsTab } from './components/SeasonRewardsTab';
import { StandingsAntiCheatTab } from './components/StandingsAntiCheatTab';
import { SeasonFormModal } from './components/SeasonFormModal';
import { LeagueEditModal } from './components/LeagueEditModal';
import { AuditReasonModal } from './components/AuditReasonModal';
import { MobileLeaderboardSimulator } from './components/MobileLeaderboardSimulator';
import {
  Calendar,
  RotateCw,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LeaderboardSeasonsPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (wordName: string) => void;
}

export const LeaderboardSeasonsPage: React.FC<LeaderboardSeasonsPageProps> = ({
  onNavigate,
  onWordChange,
}) => {
  // 1. Navigation & UI States
  const [activeTab, setActiveTab] = useState<SeasonsTabNavId>('seasons-schedule');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulatorVisible, setIsSimulatorVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Domain Data States
  const [seasons, setSeasons] = useState<Season[]>(INITIAL_SEASONS);
  const [leagues, setLeagues] = useState<LeagueConfig[]>(INITIAL_LEAGUES);
  const [rewardMatrices, setRewardMatrices] = useState<SeasonTierRewardMatrix[]>(
    INITIAL_REWARD_MATRICES
  );
  const [cohorts, setCohorts] = useState<CohortGroup[]>(INITIAL_COHORTS);
  const [standings, setStandings] =
    useState<LeaderboardStandingEntry[]>(INITIAL_STANDINGS);
  const [anomalies, setAnomalies] =
    useState<AnomalyViolation[]>(INITIAL_ANOMALIES);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('COHORT-DIA-08');

  // 3. Modals & Audit Dialog States
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<LeagueConfig | null>(null);

  const [auditConfig, setAuditConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDangerous: boolean;
    actionLabel: string;
    onConfirmCallback?: (reason: string, ticketId: string) => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    isDangerous: false,
    actionLabel: 'Xác Nhận',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Realtime Clock Tick for metrics ribbon countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Ribbon Metrics & Economic Forecast
  const ribbonMetrics = useMemo(() => {
    return computeSeasonsRibbonMetrics(seasons, standings, anomalies, rewardMatrices);
  }, [seasons, standings, anomalies, rewardMatrices]);

  const activeSeason = seasons.find((s) => s.status === 'active') || seasons[0];

  const economicForecast = useMemo(() => {
    return computeEconomicForecast(activeSeason?.totalCohorts || 494, rewardMatrices);
  }, [activeSeason, rewardMatrices]);

  // Refresh data simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Đã làm mới dữ liệu bảng xếp hạng và trạng thái mùa giải');
    }, 500);
  };

  // Season status update (active, frozen, completed)
  const handleUpdateSeasonStatus = (
    seasonId: string,
    status: SeasonStatus,
    reason?: string
  ) => {
    setSeasons((prev) =>
      prev.map((s) =>
        s.id === seasonId
          ? {
              ...s,
              status,
              isFrozen: status === 'frozen',
              freezeReason: status === 'frozen' ? reason : undefined,
              lastSettledAt:
                status === 'completed'
                  ? new Date().toISOString()
                  : s.lastSettledAt,
              auditNotes: reason ? `Cập nhật: ${reason}` : s.auditNotes,
            }
          : s
      )
    );
  };

  // Create or edit season submit
  const handleSaveSeason = (seasonData: Partial<Season>) => {
    if (editingSeason) {
      setSeasons((prev) =>
        prev.map((s) =>
          s.id === editingSeason.id ? ({ ...s, ...seasonData } as Season) : s
        )
      );
      showToast(`Đã cập nhật mùa giải: ${seasonData.name}`);
    } else {
      const newSeason: Season = {
        id: `sea-${Date.now()}`,
        code: seasonData.code || 'SEASON_NEW',
        name: seasonData.name || 'Mùa Giải Mới',
        description: seasonData.description || '',
        cycleType: seasonData.cycleType || 'weekly',
        theme: seasonData.theme || 'Snapy Mascot',
        status: seasonData.status || 'upcoming',
        startDate: seasonData.startDate || new Date().toISOString(),
        endDate: seasonData.endDate || new Date().toISOString(),
        timeZone: seasonData.timeZone || 'Asia/Ho_Chi_Minh (GMT+7)',
        totalParticipants: 0,
        totalCohorts: 0,
        totalXpAccumulated: 0,
        createdBy: 'Operator (Web Admin)',
      };
      setSeasons((prev) => [newSeason, ...prev]);
      showToast(`Đã khởi tạo thành công mùa giải mới: ${newSeason.name}`);
    }
    setEditingSeason(null);
  };

  // League config save
  const handleSaveLeague = (updatedLeague: LeagueConfig) => {
    setLeagues((prev) =>
      prev.map((l) => (l.id === updatedLeague.id ? updatedLeague : l))
    );
    showToast(`Đã lưu cấu hình phân hạng cho: ${updatedLeague.name}`);
  };

  // Anti-cheat: Deduct Exploit XP
  const handleDeductXp = (entry: LeaderboardStandingEntry) => {
    setAuditConfig({
      isOpen: true,
      title: `Trừ Điểm XP Gian Lận: ${entry.learner.name}`,
      description: `Học viên ${entry.learner.name} (Email: ${entry.learner.email}) sẽ bị trừ 2,000 Weekly XP và gỡ khỏi danh sách nhận thưởng tuần. Bắt buộc nhập lý do xử phạt và mã Ticket bảo mật.`,
      isDangerous: true,
      actionLabel: 'Trừ Điểm Gian Lận',
      onConfirmCallback: (reason, ticketId) => {
        setStandings((prev) =>
          prev.map((s) => {
            if (s.id === entry.id) {
              const newXp = Math.max(0, s.weeklyXp - 2000);
              return {
                ...s,
                weeklyXp: newXp,
                status: 'demotion',
                anomalyFlag: undefined,
              };
            }
            return s;
          })
        );
        setAnomalies((prev) =>
          prev.map((a) =>
            a.learnerId === entry.learner.id
              ? {
                  ...a,
                  status: 'deducted',
                  actionTaken: 'Đã trừ 2,000 XP gian lận',
                  actionBy: 'Operator (Web Admin)',
                  actionAt: new Date().toISOString(),
                  auditReason: `${reason} (Ticket: ${ticketId || 'N/A'})`,
                }
              : a
          )
        );
        showToast(
          `Đã trừ 2,000 XP của ${entry.learner.name} và ghi nhật ký kiểm toán.`
        );
      },
    });
  };

  // Anti-cheat: Disqualify learner
  const handleDisqualifyLearner = (entry: LeaderboardStandingEntry) => {
    setAuditConfig({
      isOpen: true,
      title: `Truất Quyền Thi Đấu: ${entry.learner.name}`,
      description: `Học viên ${entry.learner.name} sẽ bị loại khỏi bảng xếp hạng Mùa 37 và khóa quyền nhận thưởng giải đấu trong 14 ngày. Bắt buộc nhập biên bản kiểm toán.`,
      isDangerous: true,
      actionLabel: 'Truất Quyền Thi Đấu',
      onConfirmCallback: (reason, ticketId) => {
        setStandings((prev) => prev.filter((s) => s.id !== entry.id));
        setAnomalies((prev) =>
          prev.map((a) =>
            a.learnerId === entry.learner.id
              ? {
                  ...a,
                  status: 'disqualified',
                  actionTaken: 'Đã truất quyền thi đấu mùa giải',
                  actionBy: 'Super Admin',
                  actionAt: new Date().toISOString(),
                  auditReason: `${reason} (Ticket: ${ticketId || 'N/A'})`,
                }
              : a
          )
        );
        showToast(`Đã truất quyền thi đấu mùa giải đối với ${entry.learner.name}.`);
      },
    });
  };

  // Dismiss anomaly flag
  const handleDismissAnomaly = (anomalyId: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomalyId ? { ...a, status: 'dismissed' } : a))
    );
    showToast('Đã bỏ qua cảnh báo dị thường');
  };

  return (
    <div className="min-h-full bg-background flex flex-col select-none">
      {/* 1. Header Toolbar */}
      <div className="bg-surface border-b border-border px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-snapy-light text-snapy flex items-center justify-center border border-snapy/20 shadow-xs">
            <Calendar size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-text tracking-tight">
                Leaderboard Seasons
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold">
                LiveOps Console
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Quản trị vòng đời mùa giải, 6 hạng đấu (Leagues), ma trận phần thưởng
              và bảng xếp hạng chống gian lận
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsSimulatorVisible(!isSimulatorVisible)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isSimulatorVisible
                ? 'bg-snapy-light border-snapy/30 text-snapy font-bold'
                : 'bg-surface border-border text-text-muted hover:text-text'
            }`}
          >
            <Smartphone size={14} />
            <span>
              {isSimulatorVisible ? 'Ẩn Simulator' : 'Hiện Simulator'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-surface hover:bg-canvas border border-border text-text-muted hover:text-text transition-all shadow-xs"
            title="Làm mới dữ liệu"
          >
            <RotateCw
              size={15}
              className={isRefreshing ? 'animate-spin text-primary' : ''}
            />
          </button>
        </div>
      </div>

      {/* 2. Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-primary text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-xs transition-all animate-in fade-in">
          <CheckCircle2 size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Workspace */}
      <div className="flex-1 p-5 space-y-4 max-w-[1600px] w-full mx-auto">
        {/* Top KPI Metrics Ribbon */}
        <SeasonsMetricsRibbon
          metrics={ribbonMetrics}
          onJumpToAnomaly={() => setActiveTab('standings-anticheat')}
        />

        {/* Tab Navigation */}
        <div className="rounded-xl overflow-hidden shadow-card border border-border bg-surface">
          <SeasonsTabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingAnomaliesCount={ribbonMetrics.pendingAnomalyCount}
          />

          {/* Tab Content + Mobile Simulator Layout */}
          <div className="p-4 bg-background/50">
            <div className="flex flex-col lg:flex-row items-start gap-4">
              {/* Left Column: Active Tab Content */}
              <div className="flex-1 w-full min-w-0">
                {activeTab === 'seasons-schedule' && (
                  <SeasonScheduleTab
                    seasons={seasons}
                    onOpenCreateModal={() => {
                      setEditingSeason(null);
                      setIsSeasonModalOpen(true);
                    }}
                    onTriggerAuditAction={(cfg) => {
                      setAuditConfig({
                        isOpen: true,
                        title: cfg.title,
                        description: cfg.description,
                        isDangerous: cfg.isDangerous,
                        actionLabel: cfg.actionLabel,
                        onConfirmCallback: (reason) => cfg.onConfirm(reason),
                      });
                    }}
                    onUpdateSeasonStatus={handleUpdateSeasonStatus}
                    onToast={showToast}
                  />
                )}

                {activeTab === 'leagues-tiers' && (
                  <LeaguesTiersTab
                    leagues={leagues}
                    onOpenEditLeagueModal={(league) => {
                      setEditingLeague(league);
                      setIsLeagueModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'season-rewards' && (
                  <SeasonRewardsTab
                    rewardMatrices={rewardMatrices}
                    leagues={leagues}
                    economicForecast={economicForecast}
                    totalCohorts={activeSeason?.totalCohorts || 494}
                  />
                )}

                {activeTab === 'standings-anticheat' && (
                  <StandingsAntiCheatTab
                    standings={standings}
                    cohorts={cohorts}
                    anomalies={anomalies}
                    selectedCohortId={selectedCohortId}
                    onSelectCohortId={setSelectedCohortId}
                    onDeductXp={handleDeductXp}
                    onDisqualifyLearner={handleDisqualifyLearner}
                    onDismissAnomaly={handleDismissAnomaly}
                  />
                )}
              </div>

              {/* Right Column: Persistent Mobile Simulator */}
              {isSimulatorVisible && (
                <div className="shrink-0 w-full lg:w-auto flex justify-center">
                  <MobileLeaderboardSimulator
                    leagues={leagues}
                    standings={standings}
                    currentSeason={activeSeason}
                    onClose={() => setIsSimulatorVisible(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Modals */}
      {/* Season Form Modal */}
      <SeasonFormModal
        isOpen={isSeasonModalOpen}
        onClose={() => {
          setIsSeasonModalOpen(false);
          setEditingSeason(null);
        }}
        onSubmit={handleSaveSeason}
        initialData={editingSeason}
      />

      {/* League Edit Modal */}
      <LeagueEditModal
        isOpen={isLeagueModalOpen}
        onClose={() => {
          setIsLeagueModalOpen(false);
          setEditingLeague(null);
        }}
        league={editingLeague}
        onSave={handleSaveLeague}
      />

      {/* Audit Reason Modal */}
      <AuditReasonModal
        isOpen={auditConfig.isOpen}
        onClose={() => setAuditConfig((prev) => ({ ...prev, isOpen: false }))}
        title={auditConfig.title}
        description={auditConfig.description}
        actionLabel={auditConfig.actionLabel}
        isDangerous={auditConfig.isDangerous}
        onConfirm={(reason, ticketId) => {
          if (auditConfig.onConfirmCallback) {
            auditConfig.onConfirmCallback(reason, ticketId);
          }
        }}
      />
    </div>
  );
};
