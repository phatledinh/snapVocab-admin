import React from 'react';
import { AnalyticsViewModel } from '../../../domains/analytics/types';
import { LineChart } from '../../../components/charts/LineChart';
import { ShoppingBag, Coins, TrendingUp, AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface LiveOpsEconomySectionProps {
  viewModel: AnalyticsViewModel;
}

export const LiveOpsEconomySection: React.FC<LiveOpsEconomySectionProps> = ({ viewModel }) => {
  const { economyTrend, coinFaucets, coinSinks, shopVelocity, inflation } = viewModel;

  // Prepare data for dual-line chart
  const trendLabels = economyTrend.map((t) => t.date);
  const trendSeries = [
    {
      name: 'Coins Thưởng Ra (Faucet)',
      color: '#58CC02',
      data: economyTrend.map((t) => t.coinFaucet),
    },
    {
      name: 'Coins Thu Hồi (Sink)',
      color: '#FFC42E',
      data: economyTrend.map((t) => t.coinSink),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Layer 1: Currency Inflation Indicator & Dual-Line Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 4 cols: Inflation & Economic Health Gauge */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <Coins size={15} className="text-[#9A7000]" />
                <span>Chỉ Số Lạm Phát Tiền Tệ</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                25% LiveOps
              </span>
            </div>

            {/* Faucet/Sink Ratio Indicator */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80 text-center mb-3">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Tỷ Lệ Bơm / Hút (Faucet / Sink Ratio)
              </div>
              <div className="text-3xl font-black text-[#9A7000] font-display my-1">
                {inflation.faucetSinkRatio.toFixed(2)}x
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-semibold">
                <AlertCircle size={13} />
                <span>Mức độ: Tích lũy thặng dư (Caution)</span>
              </div>
              <div className="text-[10px] text-text-light mt-1">
                Ngưỡng lý tưởng bền vững: 1.10x – 1.25x
              </div>
            </div>

            {/* Diagnosis and Action */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-subtle/70 border border-border/60">
                <div className="font-bold text-text text-[11px] mb-0.5">Chẩn đoán:</div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {inflation.diagnosis}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                <div className="font-bold text-emerald-800 text-[11px] mb-0.5">Khuyến nghị vận hành:</div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  {inflation.actionRecommendation}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
            <span>Coins Đang Lưu Hành:</span>
            <strong className="text-text">~3.92M Coins</strong>
          </div>
        </div>

        {/* Right 8 cols: Faucet vs Sink 30d Dual-Line Chart */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-primary" />
                  <span>Xu Hướng Bơm & Hút Tiền Tệ (Coins Faucet vs. Sink 30 Ngày)</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Đối soát dòng tiền hàng ngày giữa điểm thưởng bài học và điểm chi tiêu tại Shop
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-text-muted font-medium">Bơm ra (Faucet)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-reward" />
                  <span className="text-text-muted font-medium">Thu hồi (Sink)</span>
                </div>
              </div>
            </div>

            <div className="py-1">
              <LineChart
                labels={trendLabels}
                series={trendSeries}
                height={200}
                showLegend={false}
              />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>
              💡 <strong>Điểm nhấn:</strong> Ngày 06 và 07/09 ghi nhận mức chi tiêu tăng vọt nhờ mở bán bộ thẻ chủ đề thương mại mới.
            </span>
            <span className="text-[11px] font-mono">Tổng Faucet: +1.28M / Sink: -892k</span>
          </div>
        </div>
      </div>

      {/* Layer 2: Faucets & Sinks Breakdown Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Faucet Sources */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Cơ Cấu Nguồn Bơm Tiền Thưởng (Faucets)</span>
            </h4>
            <span className="font-mono text-xs font-bold text-primary">+1,284,500 Coins</span>
          </div>

          <div className="space-y-2">
            {coinFaucets.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted">{item.amount.toLocaleString('vi-VN')}</span>
                    <span className="font-mono font-bold text-text w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sink Destinations */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC42E]" />
              <span>Cơ Cấu Điểm Hút Thu Hồi (Sinks)</span>
            </h4>
            <span className="font-mono text-xs font-bold text-[#9A7000]">-892,100 Coins</span>
          </div>

          <div className="space-y-2">
            {coinSinks.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted">{item.amount.toLocaleString('vi-VN')}</span>
                    <span className="font-mono font-bold text-text w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 3: Shop Item Velocity Table */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-[#9A7000]" />
                <span>Bảng Xếp Hạng Doanh Thu Vật Phẩm Shop (Shop Item Velocity)</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-reward-light text-[#9A7000] text-[10px] font-bold border border-reward/20 font-mono">
                Store Catalog Performance
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Xếp hạng các vật phẩm mang lại lượng thu hồi tiền tệ cao nhất cho hệ thống
            </p>
          </div>

          <span className="text-[11px] font-mono text-text-muted self-start sm:self-auto">
            {shopVelocity.length} Vật Phẩm Hoạt Động
          </span>
        </div>

        <div className="w-full overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-surface-subtle text-[11px] text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Tên Vật Phẩm Shop</th>
                <th className="py-2.5 px-2 text-center">Phân Loại</th>
                <th className="py-2.5 px-2.5 text-right">Đơn Giá</th>
                <th className="py-2.5 px-2.5 text-center">Số Lượt Mua</th>
                <th className="py-2.5 px-3 text-right">Tổng Khối Lượng</th>
                <th className="py-2.5 px-2.5 text-center">Đóng Góp Hút (% Sink)</th>
                <th className="py-2.5 px-2 text-center">Xu Hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {shopVelocity.map((item) => (
                <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-text">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-1.5 py-0.2 rounded font-mono text-[10px] uppercase bg-surface-subtle border border-border text-text-muted">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-bold text-text">
                    {item.price}{' '}
                    <span className="text-[10px] font-normal text-text-muted">
                      {item.currency === 'coins' ? 'Coins' : 'Gems'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-center font-mono text-text-muted">
                    {item.unitsSold.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">
                    {item.totalVolume.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-2.5 text-center font-mono font-bold text-text">
                    {item.sinkContributionPercent}%
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.trend === 'up' && (
                      <span className="inline-flex items-center text-emerald-600 font-bold text-[10px]">
                        <ArrowUp size={12} /> Tăng
                      </span>
                    )}
                    {item.trend === 'down' && (
                      <span className="inline-flex items-center text-rose-600 font-bold text-[10px]">
                        <ArrowDown size={12} /> Giảm
                      </span>
                    )}
                    {item.trend === 'stable' && (
                      <span className="inline-flex items-center text-text-muted font-medium text-[10px]">
                        <Minus size={12} /> Ổn định
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>
            <strong>Vật phẩm cốt lõi:</strong> Lá chắn <strong>Streak Freeze Shield</strong> chiếm đến <strong>48%</strong> tổng lượng Coin tiêu thụ toàn hệ thống.
          </span>
          <span className="font-semibold text-text">Shop Economics Healthy</span>
        </div>
      </div>
    </div>
  );
};
