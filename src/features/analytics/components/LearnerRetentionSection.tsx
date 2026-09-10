import React from 'react';
import { AnalyticsViewModel } from '../../../domains/analytics/types';
import { CohortHeatmapTable } from './CohortHeatmapTable';
import { LineChart } from '../../../components/charts/LineChart';
import { Users, AlertCircle, ShieldAlert, Zap } from 'lucide-react';

interface LearnerRetentionSectionProps {
  viewModel: AnalyticsViewModel;
}

export const LearnerRetentionSection: React.FC<LearnerRetentionSectionProps> = ({ viewModel }) => {
  const { cohortMatrix, streakSurvival, atRiskSegments } = viewModel;

  // Prepare data for LineChart
  const survivalLabels = streakSurvival.map((p) => `Ngày ${p.day}`);
  const survivalSeries = [
    {
      name: 'Tỷ lệ Giữ Chuỗi (% Survival)',
      color: '#FF8A00',
      data: streakSurvival.map((p) => p.retentionPercent),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Weekly Cohort Heatmap Section */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <Users size={15} className="text-primary" />
                <span>Ma Trận Giữ Chân Tuần Đăng Ký (Cohort Heatmap 8 Tuần)</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 font-mono">
                40% Data / SaaS
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Tỷ lệ % học viên quay lại học flashcard qua từng tuần tính từ ngày tạo tài khoản
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-medium self-start sm:self-auto">
            <span className="text-text-muted">Mức giữ chân:</span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-800 font-bold">≥70%</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/12 text-emerald-700">50-69%</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/12 text-blue-700">40-49%</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/14 text-amber-800">30-39%</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700">&lt;30%</span>
            </div>
          </div>
        </div>

        {/* Heatmap Table Component */}
        <CohortHeatmapTable cohortRows={cohortMatrix} />

        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>
            📌 <strong>Quy luật Cohort:</strong> Các cohort gần đây (Tuần 6, 7) có tỷ lệ W1 tăng từ <strong>68.4% lên 74.8%</strong> nhờ bổ sung luồng hướng dẫn học thẻ ngày đầu (Onboarding Flashcard Guide).
          </span>
          <span className="text-[11px] font-mono">8 Cohorts · 24,470 Học viên Mẫu</span>
        </div>
      </div>

      {/* 2. Streak Survival & Drop-Off Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 cols: Streak Survival Curve */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <Zap size={15} className="text-snapy" />
                  <span>Đường Cong Sinh Tồn Chuỗi Học (Streak Survival Curve)</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Tỷ lệ học viên duy trì chuỗi Streak liên tục từ Ngày 1 đến Ngày 90
                </p>
              </div>
              <span className="text-xs font-bold text-snapy bg-snapy-light px-2 py-0.5 rounded-full border border-snapy/20">
                Streak Peak
              </span>
            </div>

            <div className="py-2">
              <LineChart
                labels={survivalLabels}
                series={survivalSeries}
                height={190}
                showLegend={false}
              />
            </div>

            {/* Milestones Badge Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-surface-subtle border border-border/80 text-center">
                <div className="text-[10px] text-text-muted font-semibold">Ngày 3 (Vực thẳm 1)</div>
                <div className="text-sm font-extrabold text-danger font-display">68.0%</div>
                <div className="text-[9px] text-text-light mt-0.5">Rớt -14.5%</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border/80 text-center">
                <div className="text-[10px] text-text-muted font-semibold">Ngày 7 (Mốc tuần 1)</div>
                <div className="text-sm font-extrabold text-amber-600 font-display">44.0%</div>
                <div className="text-[9px] text-text-light mt-0.5">Thưởng Freeze Shield</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border/80 text-center">
                <div className="text-[10px] text-text-muted font-semibold">Ngày 14 (Hình thành)</div>
                <div className="text-sm font-extrabold text-primary font-display">31.2%</div>
                <div className="text-[9px] text-text-light mt-0.5">Thói quen ổn định</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border/80 text-center">
                <div className="text-[10px] text-text-muted font-semibold">Ngày 30 (Loyal Core)</div>
                <div className="text-sm font-extrabold text-emerald-600 font-display">18.4%</div>
                <div className="text-[9px] text-text-light mt-0.5">Học viên trung thành</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border text-xs text-text-muted">
            ⚠️ <strong>Cảnh báo điểm rơi:</strong> Tỷ lệ đứt chuỗi cao nhất rơi vào <strong>Ngày 2 sang Ngày 3</strong> (mất 14.5% học viên). Cần gửi thông báo nhắc ôn tập lúc 19:30 kèm phần thưởng nhiệm vụ ngày.
          </div>
        </div>

        {/* Right 5 cols: At-Risk Churn Segments Table */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <ShieldAlert size={15} className="text-danger" />
                  <span>Phân Khúc Có Nguy Cơ Rời Bỏ (At-Risk)</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Các nhóm học viên cần can thiệp vận hành tức thời
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {atRiskSegments.map((seg) => {
                let badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                if (seg.riskLevel === 'critical') {
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
                } else if (seg.riskLevel === 'high') {
                  badgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
                }

                return (
                  <div
                    key={seg.id}
                    className="p-3 rounded-xl border border-border bg-surface-subtle/50 hover:bg-surface-subtle transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-text truncate max-w-[200px]">
                        {seg.segmentName}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${badgeClass} uppercase font-mono`}>
                        {seg.riskLevel}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted mb-1.5">
                      Quy mô: <strong className="text-text font-mono">{seg.userCount.toLocaleString('vi-VN')} học viên</strong>
                    </div>

                    <div className="text-[11px] text-text-muted/90 bg-surface p-2 rounded-lg border border-border/60 mb-2">
                      <span className="font-medium text-text">Nguyên nhân:</span> {seg.primaryCause}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-primary font-medium flex items-center gap-1">
                        <AlertCircle size={12} />
                        Khả năng cứu vãn: ~{seg.potentialRecoveryRate}%
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`Đã xếp hàng chiến dịch can thiệp cho phân khúc: ${seg.segmentName}`)}
                        className="text-[10px] font-bold text-text hover:text-primary underline cursor-pointer"
                      >
                        Kích hoạt Push
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border text-[11px] text-text-muted flex items-center justify-between">
            <span>Tổng số học viên rủi ro: ~3,047</span>
            <span className="font-semibold text-text">LiveOps Interventions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
