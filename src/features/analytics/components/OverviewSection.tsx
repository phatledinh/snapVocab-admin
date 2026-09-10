import React from 'react';
import { AnalyticsViewModel } from '../../../domains/analytics/types';
import { AreaChart } from '../../../components/charts/AreaChart';
import { DonutChart } from '../../../components/charts/DonutChart';
import { TrendingUp, Sparkles, Award, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface OverviewSectionProps {
  viewModel: AnalyticsViewModel;
  onNavigateTab: (tab: 'retention' | 'efficacy' | 'ai-scan' | 'economy') => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ viewModel, onNavigateTab }) => {
  const { macroMetrics, learningVelocitySeries, learningSources } = viewModel;

  // Format donut data
  const donutData = learningSources.map((s) => ({
    label: s.label,
    value: s.value,
    color: s.color,
  }));

  const totalLearningEvents = learningSources.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="space-y-4">
      {/* Layer 1: 4 Macro Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {macroMetrics.map((card) => {
          let themeBorder = 'border-border';
          let themeBadge = 'bg-surface-subtle text-text-muted';
          let themeValColor = 'text-text';

          if (card.statusTheme === 'primary') {
            themeBorder = 'border-primary/30';
            themeBadge = 'bg-primary-light text-primary border-primary/20';
            themeValColor = 'text-primary';
          } else if (card.statusTheme === 'info') {
            themeBorder = 'border-info/30';
            themeBadge = 'bg-blue-50 text-blue-700 border-blue-200';
            themeValColor = 'text-info';
          } else if (card.statusTheme === 'snapy') {
            themeBorder = 'border-snapy/30';
            themeBadge = 'bg-snapy-light text-snapy border-snapy/20';
            themeValColor = 'text-snapy';
          } else if (card.statusTheme === 'reward') {
            themeBorder = 'border-reward/30';
            themeBadge = 'bg-reward-light text-[#9A7000] border-reward/20';
            themeValColor = 'text-[#9A7000]';
          }

          return (
            <div
              key={card.id}
              className={`bg-surface border rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all select-none ${themeBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
                    {card.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border font-mono ${themeBadge}`}>
                    {card.changeText}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl font-black tracking-tight font-display ${themeValColor}`}>
                    {card.value}
                  </span>
                </div>

                {card.subValue && (
                  <div className="text-[11px] text-text-muted font-mono font-medium">
                    {card.subValue}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-text-light italic flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-500" />
                  {card.benchmarkText}
                </span>

                {/* Mini SVG sparkline */}
                <svg width="64" height="18" className="overflow-visible shrink-0 opacity-80">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={themeValColor}
                    points={card.sparkline
                      .map((val, i) => {
                        const min = Math.min(...card.sparkline);
                        const max = Math.max(...card.sparkline);
                        const range = max - min || 1;
                        const x = (i / (card.sparkline.length - 1)) * 64;
                        const y = 16 - ((val - min) / range) * 14;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer 2: Main Area Chart & Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 cols: Composite Learning Velocity Area Chart */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                    <TrendingUp size={15} className="text-primary" />
                    <span>Vận Tốc Học Tập & Khối Lượng Tương Tác Kép</span>
                  </h3>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Active Growth
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Tổng hợp lượt ôn Flashcard SRS chuẩn giãn cách và thẻ từ mới tạo qua Camera AI Scan
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-3 text-[11px] self-start sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-text-muted font-medium">Flashcard SRS (72%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-snapy" />
                  <span className="text-text-muted font-medium">AI Camera Scan (28%)</span>
                </div>
              </div>
            </div>

            {/* AreaChart component */}
            <div className="mt-1">
              <AreaChart
                data={learningVelocitySeries}
                height={200}
                color="#58CC02"
                fillOpacity={0.18}
                showGrid={true}
                showDots={true}
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
            <span>
              💡 <strong>Nhận định:</strong> Lượng ôn tập đạt đỉnh vào khung giờ <strong>20:00 - 22:30</strong> mỗi tối khi người học hoàn thành nhiệm vụ giữ chuỗi Streak.
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('efficacy')}
              className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Xem phân bổ 5 Hộp SRS</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        {/* Right 4 cols: Sources Breakdown Donut */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <Sparkles size={15} className="text-snapy" />
                  <span>Cơ Cấu Nguồn Học Tập</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Tỷ trọng thẻ từ vựng nạp vào hệ thống</p>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="py-2 flex justify-center">
              <DonutChart
                data={donutData}
                size={135}
                strokeWidth={18}
                centerLabel="Tổng Lượt Thẻ"
                centerValue={`${(totalLearningEvents / 1000).toFixed(1)}k`}
                showLegend={false}
              />
            </div>

            {/* High-density breakdown list */}
            <div className="space-y-1.5 mt-2">
              {learningSources.map((source) => (
                <div
                  key={source.label}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-subtle transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium text-text truncate max-w-[150px]">
                      {source.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted text-[11px]">
                      {source.value.toLocaleString('vi-VN')}
                    </span>
                    <span className="font-bold text-text font-mono text-[11px] w-8 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
            <span className="text-[11px] text-text-muted">Kênh Scan dẫn đầu tỷ trọng</span>
            <button
              type="button"
              onClick={() => onNavigateTab('ai-scan')}
              className="text-snapy hover:text-snapy-hover font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Chi tiết AI Funnel</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer 3: Strategic Executive Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-text">D30 Retention Tăng Trưởng Vững Chắc</div>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              Tỷ lệ duy trì ngày 30 đạt <strong>28.4%</strong> (vượt benchmark 24% của EdTech). Cơ chế lá chắn Streak Freeze trong Shop đóng vai trò then chốt cứu vãn chuỗi ngày 3 và ngày 7.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-text">Tối Ưu Hoá Nhận Thức SRS Hộp 1</div>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              Có <strong>1,260 học viên mới</strong> đang bị dồn ứ thẻ tại Hộp Leitner 1 do scan quá nhiều đồ vật trong ngày đầu. Chế độ Micro-Review sắp được kích hoạt để giảm tải.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-reward-light border border-reward/20 text-[#9A7000] flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-text">Kinh Tế LiveOps Cần Thêm Điểm Tiêu</div>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              Tỷ lệ Faucet/Sink đạt <strong>1.43</strong> (1.28M Coins thưởng vs 892k tiêu thụ). Cần tung thêm các bộ thẻ chủ đề độc quyền để hấp thụ lượng coin thặng dư.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
