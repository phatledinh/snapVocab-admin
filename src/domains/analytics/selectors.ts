import {
  AnalyticsFilter,
  AnalyticsViewModel,
  MacroMetricCard,
} from './types';
import {
  MOCK_LEARNING_SOURCES,
  MOCK_COHORT_MATRIX,
  MOCK_STREAK_SURVIVAL,
  MOCK_AT_RISK_SEGMENTS,
  MOCK_LEITNER_BOXES,
  MOCK_CEFR_ACCURACY,
  MOCK_HARDEST_WORDS,
  MOCK_SCAN_FUNNEL,
  MOCK_CONFIDENCE_TIERS,
  MOCK_CONFUSION_ITEMS,
  MOCK_AI_PERFORMANCE,
  MOCK_ECONOMY_TREND,
  MOCK_COIN_FAUCETS,
  MOCK_COIN_SINKS,
  MOCK_SHOP_VELOCITY,
  MOCK_INFLATION_STATUS,
} from './mock-data';
import { AreaChartDataPoint } from '../../components/charts/AreaChart';

export function projectAnalyticsViewModel(filter: AnalyticsFilter): AnalyticsViewModel {
  const { timeRange, cefrLevel, segment } = filter;

  // 1. Compute Multi-period Multipliers
  let periodMultiplier = 1;
  let dateLabels: string[] = [];

  switch (timeRange) {
    case '7d':
      periodMultiplier = 0.25;
      dateLabels = ['T4 (04/09)', 'T5 (05/09)', 'T6 (06/09)', 'T7 (07/09)', 'CN (08/09)', 'T2 (09/09)', 'T3 (10/09)'];
      break;
    case '30d':
      periodMultiplier = 1;
      dateLabels = [
        '11/08', '14/08', '17/08', '20/08', '23/08', '26/08', '29/08',
        '01/09', '04/09', '07/09', '10/09'
      ];
      break;
    case '90d':
      periodMultiplier = 2.8;
      dateLabels = ['Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'];
      break;
    case '12m':
      periodMultiplier = 11.2;
      dateLabels = ['Q4/25', 'Q1/26', 'Q2/26', 'Q3/26'];
      break;
  }

  // 2. Macro Metric Cards
  const macroMetrics: MacroMetricCard[] = [
    {
      id: 'metric-stickiness',
      title: 'TỶ LỆ GẮN KẾT (STICKINESS DAU/MAU)',
      value: '17.15%',
      subValue: 'DAU: 14.8k / MAU: 86.4k',
      benchmarkText: 'Ngưỡng EdTech Top 10%: >16%',
      changeText: '+1.8% so với kỳ trước',
      changePositive: true,
      statusTheme: 'primary',
      sparkline: [14.2, 14.8, 15.3, 15.1, 16.2, 16.8, 17.15],
    },
    {
      id: 'metric-retention-d30',
      title: 'TỶ LỆ GIỮ CHÂN D30 (DAY 30 RETENTION)',
      value: '28.4%',
      subValue: 'D1: 82.5% | D7: 44.0%',
      benchmarkText: 'Benchmark thị trường: 18 - 24%',
      changeText: '+4.3% nhờ cơ chế Streak Shield',
      changePositive: true,
      statusTheme: 'info',
      sparkline: [22.1, 23.5, 24.8, 25.4, 26.9, 27.8, 28.4],
    },
    {
      id: 'metric-srs-completion',
      title: 'TỶ LỆ HOÀN THÀNH ÔN TẬP SRS (DAILY DUE)',
      value: '82.6%',
      subValue: `${Math.round(42850 * periodMultiplier).toLocaleString('vi-VN')} lượt ôn trong kỳ`,
      benchmarkText: 'Mục tiêu giữ nhịp học: ≥80%',
      changeText: '+2.1% tuần này',
      changePositive: true,
      statusTheme: 'snapy',
      sparkline: [76.5, 78.2, 79.4, 80.1, 81.5, 82.0, 82.6],
    },
    {
      id: 'metric-ai-accuracy',
      title: 'ĐỘ CHÍNH XÁC NHẬN DIỆN THỊ GIÁC AI',
      value: '94.2%',
      subValue: 'Độ trễ trung bình: 340ms (p50)',
      benchmarkText: 'Tiêu chuẩn phê duyệt: ≥92%',
      changeText: 'Báo lỗi scan giảm còn 1.8%',
      changePositive: true,
      statusTheme: 'reward',
      sparkline: [91.2, 91.8, 92.5, 93.1, 93.4, 93.9, 94.2],
    },
  ];

  // 3. Learning Velocity Composite Series
  const baseValues = [
    { baseFlashcards: 28400, baseScans: 8900 },
    { baseFlashcards: 31200, baseScans: 9400 },
    { baseFlashcards: 34500, baseScans: 10200 },
    { baseFlashcards: 36800, baseScans: 11100 },
    { baseFlashcards: 39400, baseScans: 11800 },
    { baseFlashcards: 41200, baseScans: 12100 },
    { baseFlashcards: 42850, baseScans: 12450 },
  ];

  const learningVelocitySeries: AreaChartDataPoint[] = dateLabels.map((lbl, idx) => {
    const sample = baseValues[idx % baseValues.length];
    const val = Math.round((sample.baseFlashcards + sample.baseScans) * (0.85 + (idx / dateLabels.length) * 0.3));
    return {
      label: lbl,
      value: val,
      subValue: `Flashcards: ${Math.round(val * 0.72).toLocaleString('vi-VN')} · Scan: ${Math.round(val * 0.28).toLocaleString('vi-VN')}`,
    };
  });

  // 4. Hardest Words filtering by CEFR if specified
  let hardestWords = MOCK_HARDEST_WORDS;
  if (cefrLevel && cefrLevel !== 'all') {
    hardestWords = MOCK_HARDEST_WORDS.filter((w) => w.cefr === cefrLevel);
    // If none match exactly in mock list, fall back to mock without breaking
    if (hardestWords.length === 0) {
      hardestWords = MOCK_HARDEST_WORDS;
    }
  }

  // 5. At-Risk Segments filtering if segment specified
  let atRiskSegments = MOCK_AT_RISK_SEGMENTS;
  if (segment === 'at-risk') {
    atRiskSegments = MOCK_AT_RISK_SEGMENTS.filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high');
  } else if (segment === 'streak-active') {
    atRiskSegments = MOCK_AT_RISK_SEGMENTS.filter((s) => s.id === 'risk-01');
  } else if (segment === 'new-learners') {
    atRiskSegments = MOCK_AT_RISK_SEGMENTS.filter((s) => s.id === 'risk-02');
  }

  return {
    filter,
    lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    macroMetrics,
    learningVelocitySeries,
    learningSources: MOCK_LEARNING_SOURCES,
    cohortMatrix: MOCK_COHORT_MATRIX,
    streakSurvival: MOCK_STREAK_SURVIVAL,
    atRiskSegments,
    leitnerBoxes: MOCK_LEITNER_BOXES,
    cefrAccuracy: MOCK_CEFR_ACCURACY,
    hardestWords,
    scanFunnel: MOCK_SCAN_FUNNEL,
    confidenceTiers: MOCK_CONFIDENCE_TIERS,
    confusionMatrix: MOCK_CONFUSION_ITEMS,
    aiPerformance: MOCK_AI_PERFORMANCE,
    economyTrend: MOCK_ECONOMY_TREND,
    coinFaucets: MOCK_COIN_FAUCETS,
    coinSinks: MOCK_COIN_SINKS,
    shopVelocity: MOCK_SHOP_VELOCITY,
    inflation: MOCK_INFLATION_STATUS,
  };
}
