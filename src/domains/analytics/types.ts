import { CEFRLevel } from '../flashcard/types';
import { AreaChartDataPoint } from '../../components/charts/AreaChart';

export type AnalyticsTimeRange = '7d' | '30d' | '90d' | '12m';

export type AnalyticsTab = 'overview' | 'retention' | 'efficacy' | 'ai-scan' | 'economy';

export type LearnerSegment = 'all' | 'streak-active' | 'new-learners' | 'at-risk';

export interface AnalyticsFilter {
  timeRange: AnalyticsTimeRange;
  cefrLevel: CEFRLevel | 'all';
  segment: LearnerSegment;
}

// 1. Executive Overview Models
export interface MacroMetricCard {
  id: string;
  title: string;
  value: string;
  subValue?: string;
  benchmarkText: string;
  changeText: string;
  changePositive: boolean;
  statusTheme: 'primary' | 'snapy' | 'reward' | 'info' | 'danger';
  sparkline: number[];
}

export interface LearningSourceBreakdown {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

// 2. Retention & Cohorts Models
export interface CohortRow {
  id: string;
  cohortWeek: string;
  startDate: string;
  newUsersCount: number;
  retentionRates: number[]; // index 0: W0 (100%), index 1: W1, etc.
}

export interface StreakSurvivalPoint {
  day: number;
  retentionPercent: number;
  dropRatePercent: number;
  learnerCount: number;
  isMilestone?: boolean;
  annotation?: string;
}

export interface AtRiskSegment {
  id: string;
  segmentName: string;
  userCount: number;
  riskLevel: 'critical' | 'high' | 'medium';
  primaryCause: string;
  recommendedIntervention: string;
  potentialRecoveryRate: number;
}

// 3. Learning Efficacy & SRS Models
export interface LeitnerBoxMetric {
  box: number;
  title: string;
  intervalDays: string;
  wordCount: number;
  percentage: number;
  color: string;
  accuracyRate: number;
}

export interface CefrAccuracyMetric {
  level: CEFRLevel;
  totalWords: number;
  masteredWords: number;
  accuracyRate: number;
  avgMasteryDays: number;
  reviewVolume: number;
  color: string;
}

export interface HardestWordMetric {
  id: string;
  word: string;
  partOfSpeech: string;
  cefr: CEFRLevel;
  meaningVi: string;
  totalReviews: number;
  failureRate: number; // e.g. 44.2%
  retentionScore: number;
  errorStreak: number;
  lastTested: string;
}

// 4. AI Vision & Scan Quality Models
export interface ScanFunnelStep {
  id: string;
  step: string;
  count: number;
  conversionFromStart: number;
  conversionFromPrev: number;
  dropOffRate: number;
  color: string;
  description: string;
}

export interface AIConfidenceTier {
  tier: 'high' | 'medium' | 'low';
  label: string;
  count: number;
  percentage: number;
  thresholdText: string;
  badgeClass: string;
  color: string;
}

export interface AIConfusionItem {
  id: string;
  realObject: string;
  predictedLabel: string;
  occurrences: number;
  autoFixRate: number;
  suggestedAction: string;
  cefr: CEFRLevel;
  severity: 'high' | 'medium' | 'low';
}

export interface AIScanPerformance {
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  timeoutRatePercent: number;
  quotaExceededToday: number;
  gpuWorkerCount: number;
}

// 5. LiveOps Virtual Economy Models
export interface EconomyTrendPoint {
  date: string;
  coinFaucet: number;
  coinSink: number;
  gemFaucet: number;
  gemSink: number;
}

export interface CurrencySourceSinkItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ShopItemVelocity {
  id: string;
  name: string;
  category: 'boost' | 'cosmetic' | 'deck' | 'chest';
  currency: 'coins' | 'gems';
  price: number;
  unitsSold: number;
  totalVolume: number;
  sinkContributionPercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface InflationStatus {
  faucetSinkRatio: number;
  status: 'healthy' | 'caution' | 'critical';
  circulationCoins: number;
  velocityIndex: number;
  diagnosis: string;
  actionRecommendation: string;
}

// Comprehensive ViewModel
export interface AnalyticsViewModel {
  filter: AnalyticsFilter;
  lastUpdated: string;
  macroMetrics: MacroMetricCard[];
  learningVelocitySeries: AreaChartDataPoint[];
  learningSources: LearningSourceBreakdown[];
  cohortMatrix: CohortRow[];
  streakSurvival: StreakSurvivalPoint[];
  atRiskSegments: AtRiskSegment[];
  leitnerBoxes: LeitnerBoxMetric[];
  cefrAccuracy: CefrAccuracyMetric[];
  hardestWords: HardestWordMetric[];
  scanFunnel: ScanFunnelStep[];
  confidenceTiers: AIConfidenceTier[];
  confusionMatrix: AIConfusionItem[];
  aiPerformance: AIScanPerformance;
  economyTrend: EconomyTrendPoint[];
  coinFaucets: CurrencySourceSinkItem[];
  coinSinks: CurrencySourceSinkItem[];
  shopVelocity: ShopItemVelocity[];
  inflation: InflationStatus;
}
