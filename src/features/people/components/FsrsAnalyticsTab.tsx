import React from 'react';
import { LearnerProfile } from '../../../domains/learners/types';
import {
  computeFsrsDistribution,
  computeCefrRetentionBreakdown,
} from '../../../domains/learners/selectors';
import { DonutChart, BarChart } from '../../../components/charts';
import {
  BookOpen,
  Brain,
  TrendingUp,
  Info,
} from 'lucide-react';

interface FsrsAnalyticsTabProps {
  learners: LearnerProfile[];
}

export const FsrsAnalyticsTab: React.FC<FsrsAnalyticsTabProps> = ({
  learners,
}) => {
  const fsrsDist = computeFsrsDistribution(learners);
  const cefrDist = computeCefrRetentionBreakdown(learners);

  const totalCards =
    fsrsDist.newCards + fsrsDist.learning + fsrsDist.review + fsrsDist.mastered;

  const donutData = [
    { label: 'Thẻ mới (New)', value: fsrsDist.newCards, color: '#9CA3AF' },
    { label: 'Đang học (Learning)', value: fsrsDist.learning, color: '#1CB0F6' },
    { label: 'Ôn tập (Review)', value: fsrsDist.review, color: '#FF8A00' },
    { label: 'Đã thuộc (Mastered)', value: fsrsDist.mastered, color: '#58CC02' },
  ];

  const cefrBarData = cefrDist.map((item) => {
    const colors: Record<string, string> = {
      A1: '#10B981',
      A2: '#14B8A6',
      B1: '#F59E0B',
      B2: '#F97316',
      C1: '#8B5CF6',
      C2: '#F43F5E',
    };
    return {
      label: item.level,
      value: Math.round(item.avgRetention),
      subLabel: `${item.count} người`,
      color: colors[item.level] || '#58CC02',
    };
  });

  const totalDueToday = learners.reduce(
    (acc, l) => acc + l.fsrs.dueCardsToday,
    0
  );

  return (
    <div className="space-y-4 select-none">
      {/* 1. Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Tổng Thẻ Flashcard FSRS
          </span>
          <div className="text-xl font-extrabold text-text font-mono">
            {totalCards.toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Trong bộ nhớ của <strong>{learners.length}</strong> học viên
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Thẻ Đã Mastered (Vĩnh Viễn)
          </span>
          <div className="text-xl font-extrabold text-primary font-mono flex items-center gap-1.5">
            <span>{fsrsDist.mastered.toLocaleString('vi-VN')}</span>
            <span className="text-xs font-semibold text-primary">
              ({totalCards > 0 ? Math.round((fsrsDist.mastered / totalCards) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Độ bền trí nhớ &gt; 30 ngày (Mature)
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Tỷ Lệ Giữ Nhớ Hệ Thống
          </span>
          <div className="text-xl font-extrabold text-info font-mono">
            89.4%
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Mục tiêu FSRS chuẩn: 85% - 90%
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3.5 shadow-card">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Thẻ Cần Ôn Hôm Nay
          </span>
          <div className="text-xl font-extrabold text-snapy font-mono">
            {totalDueToday.toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Đến hạn chu kỳ Spaced Repetition
          </span>
        </div>
      </div>

      {/* 2. Charts Row: Donut Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: FSRS Stages Breakdown */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-info-light text-info flex items-center justify-center">
                <Brain size={14} />
              </div>
              <h3 className="text-xs font-bold text-text">Phân Bổ Vòng Đời Thẻ FSRS</h3>
            </div>
            <span className="text-[10px] text-text-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border">
              FSRS v4 Model
            </span>
          </div>

          <div className="py-4 flex items-center justify-center">
            <DonutChart
              data={donutData}
              size={170}
              strokeWidth={22}
              centerLabel="Tổng Thẻ"
              centerValue={totalCards.toLocaleString('vi-VN')}
              showLegend={true}
            />
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] text-text-muted flex items-center gap-1.5 bg-surface-subtle/50 p-2.5 rounded-lg">
            <Info size={14} className="text-info shrink-0" />
            <span>
              Thẻ được chuyển sang <strong>Mastered</strong> khi độ bền trí nhớ (Stability) vượt qua 30 ngày và xác suất recall đạt &ge; 90%.
            </span>
          </div>
        </div>

        {/* Right: Retention Rate by CEFR Level */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary-light text-primary flex items-center justify-center">
                <TrendingUp size={14} />
              </div>
              <h3 className="text-xs font-bold text-text">
                Tỷ Lệ Giữ Nhớ Trung Bình Theo Cấp Độ CEFR (%)
              </h3>
            </div>
            <span className="text-[10px] text-primary font-bold">
              Target &gt; 85%
            </span>
          </div>

          <div className="py-4">
            <BarChart
              data={cefrBarData}
              height={160}
              defaultColor="#58CC02"
              showValues={true}
            />
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] text-text-muted flex items-center justify-between">
            <span>Cấp độ C1 & C2 duy trì tỷ lệ recall cao nhất</span>
            <span className="font-mono text-primary font-bold">94.8% - 96.2%</span>
          </div>
        </div>
      </div>

      {/* 3. Recall Feedback Assessment Quality */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card select-none">
        <h3 className="text-xs font-bold text-text mb-2 flex items-center gap-2">
          <BookOpen size={14} className="text-primary" />
          <span>Thang Đánh Giá Nhớ Lại (Recall Ratings) Trong Ứng Dụng Mobile</span>
        </h3>
        <p className="text-xs text-text-muted mb-3">
          Khi người học lật thẻ ôn tập, họ chọn 1 trong 4 mức đánh giá FSRS. Thuật toán sẽ tự động điều chỉnh chu kỳ ôn tập tiếp theo:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-danger/20 bg-danger-light/30">
            <div className="flex items-center justify-between font-bold text-danger">
              <span>1. Again (Quên hẳn)</span>
              <span className="font-mono">12.4%</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Thẻ reset về trạng thái Learning. Lặp lại sau 10 phút.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40">
            <div className="flex items-center justify-between font-bold text-amber-800">
              <span>2. Hard (Nhớ khó khăn)</span>
              <span className="font-mono">18.6%</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Tăng khoảng thời gian nhỏ (1.2x). Cần củng cố thêm.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-info/20 bg-info-light/30">
            <div className="flex items-center justify-between font-bold text-info">
              <span>3. Good (Nhớ chuẩn)</span>
              <span className="font-mono">54.2%</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Khoảng thời gian tăng theo công thức FSRS tối ưu (2.5x).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-primary/20 bg-primary-light/30">
            <div className="flex items-center justify-between font-bold text-primary">
              <span>4. Easy (Quá dễ)</span>
              <span className="font-mono">14.8%</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Nhảy bước chu kỳ xa (3.5x). Tăng mạnh độ ổn định Stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
