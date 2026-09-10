import React, { useState } from 'react';
import { DashboardTimeRange } from '../../domains/dashboard/types';
import { projectDashboardViewModel } from '../../domains/dashboard/selectors';
import { INITIAL_VOCABULARY } from '../../domains/vocabulary/mock-data';
import { MOCK_AI_SCAN_HEALTH } from '../../domains/ai-scan/mock-data';
import { MOCK_ECONOMY_STATE } from '../../domains/economy/mock-data';
import { MetricRibbon } from './components/MetricRibbon';
import { ContentPipelineWidget } from './components/ContentPipelineWidget';
import { AIScanMonitorWidget } from './components/AIScanMonitorWidget';
import { LearnerActivityWidget } from './components/LearnerActivityWidget';
import { LiveOpsEconomyWidget } from './components/LiveOpsEconomyWidget';
import { AuditActivityWidget } from './components/AuditActivityWidget';
import { RotateCw } from 'lucide-react';

interface DashboardPageProps {
  onNavigate?: (navId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('7d');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Compute clean projection ViewModel from raw domain states
  const viewModel = projectDashboardViewModel(
    timeRange,
    INITIAL_VOCABULARY,
    MOCK_AI_SCAN_HEALTH,
    MOCK_ECONOMY_STATE
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((prev) => prev + 1);
    }, 450);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4 space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-text tracking-tight">
              Dashboard Quản Trị & Vận Hành Hệ Thống
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold border border-primary/20">
              LiveOps Console
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Hình chiếu tổng hợp từ Content Studio, AI Scan Engine và Hệ sinh thái Gamification
          </p>
        </div>

        {/* Status controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text-muted shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium font-mono">{viewModel.lastUpdated}</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-all shadow-xs ${
              isRefreshing ? 'animate-spin text-primary' : ''
            }`}
            title="Làm mới dữ liệu thống kê"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* Layer 1: High-Density Metric Ribbon */}
      <section>
        <MetricRibbon cards={viewModel.metrics} onNavigate={onNavigate} />
      </section>

      {/* Layer 2: Content & AI (Left) + Learner Activity (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Content Pipeline & AI Scan */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <ContentPipelineWidget
            pipeline={viewModel.contentPipeline}
            onNavigate={onNavigate}
          />
          <AIScanMonitorWidget
            aiScan={viewModel.aiScan}
            onNavigate={onNavigate}
          />
        </div>

        {/* Right Column: Learning Growth & Flashcard Activity */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <LearnerActivityWidget
            activity={viewModel.learnerActivity}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* Layer 3: LiveOps Console & Virtual Economy (Coins / Gems / Streak) */}
      <section>
        <LiveOpsEconomyWidget
          liveops={viewModel.liveops}
          onNavigate={onNavigate}
        />
      </section>

      {/* Layer 4: Audit Trail & SS-17 Infrastructure Services */}
      <section>
        <AuditActivityWidget
          auditTrail={viewModel.auditTrail}
          infraServices={viewModel.infraServices}
          r2Storage={viewModel.r2Storage}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
};
