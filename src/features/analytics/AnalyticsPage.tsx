import React, { useState } from 'react';
import {
  AnalyticsFilter,
  AnalyticsTab,
} from '../../domains/analytics/types';
import { projectAnalyticsViewModel } from '../../domains/analytics/selectors';
import { AnalyticsToolbar } from './components/AnalyticsToolbar';
import { AnalyticsTabNav } from './components/AnalyticsTabNav';
import { OverviewSection } from './components/OverviewSection';
import { LearnerRetentionSection } from './components/LearnerRetentionSection';
import { LearningEfficacySection } from './components/LearningEfficacySection';
import { AIScanAnalyticsSection } from './components/AIScanAnalyticsSection';
import { LiveOpsEconomySection } from './components/LiveOpsEconomySection';

interface AnalyticsPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (word: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate, onWordChange }) => {
  const [filter, setFilter] = useState<AnalyticsFilter>({
    timeRange: '30d',
    cefrLevel: 'all',
    segment: 'all',
  });

  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [, setRefreshKey] = useState<number>(0);

  // Compute clean ViewModel projection
  const viewModel = projectAnalyticsViewModel(filter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((prev) => prev + 1);
    }, 450);
  };

  // Export CSV Report Functionality
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'retention') {
      csvContent += 'Cohort Week,New Users,Week 0,Week 1,Week 2,Week 3,Week 4,Week 5,Week 6,Week 7\n';
      viewModel.cohortMatrix.forEach((row) => {
        csvContent += `"${row.cohortWeek}",${row.newUsersCount},${row.retentionRates.join(',')}\n`;
      });
    } else if (activeTab === 'efficacy') {
      csvContent += 'Word,CEFR,Part of Speech,Vietnamese Meaning,Total Reviews,Failure Rate (%),Error Streak\n';
      viewModel.hardestWords.forEach((hw) => {
        csvContent += `"${hw.word}","${hw.cefr}","${hw.partOfSpeech}","${hw.meaningVi}",${hw.totalReviews},${hw.failureRate},${hw.errorStreak}\n`;
      });
    } else if (activeTab === 'ai-scan') {
      csvContent += 'Real Object,AI Predicted Label,Report Count,Auto-Fix Rate (%),Suggested Action,Severity\n';
      viewModel.confusionMatrix.forEach((cm) => {
        csvContent += `"${cm.realObject}","${cm.predictedLabel}",${cm.occurrences},${cm.autoFixRate}%,"${cm.suggestedAction}","${cm.severity}"\n`;
      });
    } else if (activeTab === 'economy') {
      csvContent += 'Shop Item Name,Category,Price,Currency,Units Sold,Total Volume,Sink Contribution (%)\n';
      viewModel.shopVelocity.forEach((sv) => {
        csvContent += `"${sv.name}","${sv.category}",${sv.price},"${sv.currency}",${sv.unitsSold},${sv.totalVolume},${sv.sinkContributionPercent}%\n`;
      });
    } else {
      // Default Overview Summary
      csvContent += 'Macro Metric,Current Value,Benchmark,Period Trend\n';
      viewModel.macroMetrics.forEach((m) => {
        csvContent += `"${m.title}","${m.value}","${m.benchmarkText}","${m.changeText}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `snapvocab_analytics_${activeTab}_${filter.timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectWord = (word: string) => {
    if (onWordChange) {
      onWordChange(word);
    }
    if (onNavigate) {
      onNavigate('content-studio');
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4 space-y-4">
      {/* Top Header & Context Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-text tracking-tight">
              Phân Tích Nghiệp Vụ Chuyên Sâu (Deep-Dive Analytics)
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              Business Intelligence
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Phân tích tỷ lệ giữ chân Cohort, hiệu quả ghi nhớ SRS, chất lượng nhận diện thị giác AI và cân bằng kinh tế ảo LiveOps
          </p>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <section>
        <AnalyticsToolbar
          filter={filter}
          onFilterChange={setFilter}
          onExportCsv={handleExportCsv}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastUpdated={viewModel.lastUpdated}
        />
      </section>

      {/* Sub-Tab Navigation Bar */}
      <section>
        <AnalyticsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </section>

      {/* Dynamic Tab Panes */}
      <main className="space-y-4">
        {activeTab === 'overview' && (
          <OverviewSection
            viewModel={viewModel}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'retention' && (
          <LearnerRetentionSection viewModel={viewModel} />
        )}

        {activeTab === 'efficacy' && (
          <LearningEfficacySection
            viewModel={viewModel}
            onSelectWordToEdit={handleSelectWord}
            onNavigateTab={onNavigate}
          />
        )}

        {activeTab === 'ai-scan' && (
          <AIScanAnalyticsSection
            viewModel={viewModel}
            onNavigateTab={onNavigate}
          />
        )}

        {activeTab === 'economy' && (
          <LiveOpsEconomySection viewModel={viewModel} />
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;
