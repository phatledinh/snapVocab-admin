import React from 'react';
import { AnalyticsViewModel } from '../../../domains/analytics/types';
import { Camera, Sparkles, Cpu, Clock, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface AIScanAnalyticsSectionProps {
  viewModel: AnalyticsViewModel;
  onNavigateTab?: (navId: string) => void;
}

export const AIScanAnalyticsSection: React.FC<AIScanAnalyticsSectionProps> = ({
  viewModel,
  onNavigateTab,
}) => {
  const { scanFunnel, confidenceTiers, confusionMatrix, aiPerformance } = viewModel;

  return (
    <div className="space-y-4">
      {/* Layer 1: Scan-to-Study Conversion Funnel */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <Camera size={15} className="text-snapy" />
                <span>Phễu Chuyển Đổi Scan-to-Study (Camera Scan Conversion Funnel)</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-snapy-light text-snapy text-[10px] font-bold border border-snapy/20 font-mono">
                Active Learning Loop
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Hành trình chuyển hóa từ thao tác chụp ảnh thực tế sang thẻ từ vựng hoàn tất chu trình học
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-text-muted self-start sm:self-auto">
            <span>Tỷ lệ hoàn tất phễu:</span>
            <span className="text-primary font-bold text-sm">56.4%</span>
          </div>
        </div>

        {/* 5-Step Funnel Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {scanFunnel.map((step, idx) => {
            const isLast = idx === scanFunnel.length - 1;
            return (
              <div
                key={step.id}
                className="p-3 rounded-xl border border-border bg-surface-subtle/50 flex flex-col justify-between hover:bg-surface-subtle transition-all relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Bước {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface border border-border/80 text-text">
                      {step.conversionFromStart}%
                    </span>
                  </div>

                  <div className="text-xs font-bold text-text mb-1">{step.step}</div>

                  <div className="text-base font-black font-display text-text my-0.5" style={{ color: step.color }}>
                    {step.count.toLocaleString('vi-VN')}
                  </div>

                  <p className="text-[10px] text-text-muted leading-tight mt-1 line-clamp-2">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-border/70 flex items-center justify-between text-[10px] font-mono">
                  {idx === 0 ? (
                    <span className="text-text-light">Điểm xuất phát</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">
                      +{step.conversionFromPrev}% bước trước
                    </span>
                  )}

                  {step.dropOffRate > 0 && (
                    <span className="text-danger font-semibold">
                      -{step.dropOffRate}%
                    </span>
                  )}
                </div>

                {!isLast && (
                  <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface border border-border text-text-light items-center justify-center z-10 shadow-2xs">
                    <ArrowRight size={10} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>
            💡 <strong>Tối ưu hóa:</strong> Bước 4 (Thêm thẻ vào Deck) có tỷ lệ rớt <strong>21.6%</strong> khi AI đưa ra từ vựng ở cấp độ quá cao so với trình độ hiện tại của người học.
          </span>
          <span className="text-[11px] font-mono">15.2k Lượt Kích Hoạt</span>
        </div>
      </div>

      {/* Layer 2: AI Confidence Tiers & Latency Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 cols: Confidence Tiers */}
        <div className="lg:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <Sparkles size={15} className="text-snapy" />
                  <span>Phân Bố Ngưỡng Tin Cậy AI (Confidence Tiers)</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Quy tắc phân loại tự động của Florence-2 & Gemini Vision
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {confidenceTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className="p-3 rounded-xl border border-border bg-surface-subtle/50 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="text-xs font-bold text-text">{tier.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono font-semibold ${tier.badgeClass}`}>
                      Ngưỡng {tier.thresholdText}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-2/3 bg-surface rounded-full h-2 overflow-hidden border border-border/60">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-text mr-2">{tier.percentage}%</span>
                      <span className="font-mono text-[11px] text-text-muted">({tier.count.toLocaleString('vi-VN')} scans)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>
              Tỷ lệ cần duyệt thủ công trong Review Queue chỉ chiếm <strong>2.6%</strong>.
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('ai-queue')}
              className="text-snapy hover:text-snapy-hover font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Xem Review Queue (18)</span>
              <ExternalLink size={11} />
            </button>
          </div>
        </div>

        {/* Right 6 cols: AI Latency & Worker Infrastructure */}
        <div className="lg:col-span-6 bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                  <Cpu size={15} className="text-primary" />
                  <span>Độ Trễ Phục Vụ & Hạ Tầng Worker AI</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Giám sát SLA xử lý nhận diện thời gian thực (SS-17 Service)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                GPU Online
              </span>
            </div>

            {/* Latency Cards Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-surface-subtle border border-border text-center">
                <div className="text-[10px] text-text-muted font-semibold flex items-center justify-center gap-1">
                  <Clock size={11} />
                  <span>p50 (Median)</span>
                </div>
                <div className="text-lg font-black text-primary font-display my-0.5">
                  {aiPerformance.p50LatencyMs}ms
                </div>
                <div className="text-[9px] text-text-light">Phản hồi siêu tốc</div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-subtle border border-border text-center">
                <div className="text-[10px] text-text-muted font-semibold flex items-center justify-center gap-1">
                  <Clock size={11} />
                  <span>p95 Latency</span>
                </div>
                <div className="text-lg font-black text-amber-600 font-display my-0.5">
                  {aiPerformance.p95LatencyMs}ms
                </div>
                <div className="text-[9px] text-text-light">Tiêu chuẩn trần SLA</div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-subtle border border-border text-center">
                <div className="text-[10px] text-text-muted font-semibold flex items-center justify-center gap-1">
                  <Clock size={11} />
                  <span>p99 Peak</span>
                </div>
                <div className="text-lg font-black text-rose-600 font-display my-0.5">
                  {aiPerformance.p99LatencyMs}ms
                </div>
                <div className="text-[9px] text-text-light">Ảnh dung lượng lớn</div>
              </div>
            </div>

            {/* Quota & Worker Info */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/70">
                <span className="text-text-muted">Cụm GPU Worker AI:</span>
                <span className="font-bold text-text font-mono">{aiPerformance.gpuWorkerCount} Workers (Auto-scale)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/70">
                <span className="text-text-muted">Tỷ lệ Timeout (&gt;60s):</span>
                <span className="font-bold text-emerald-600 font-mono">{aiPerformance.timeoutRatePercent}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/70">
                <span className="text-text-muted">Lượt scan vượt hạn mức (Quota 20/ngày):</span>
                <span className="font-bold text-amber-600 font-mono">{aiPerformance.quotaExceededToday} lượt</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border text-xs text-text-muted flex items-center justify-between">
            <span>SLA đảm bảo 99.96% request dưới 1.5s</span>
            <span className="font-medium text-text">Cloudflare R2 + Gemini Vision</span>
          </div>
        </div>
      </div>

      {/* Layer 3: Top Misidentified Object Categories */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-danger" />
                <span>Bảng Thống Kê Các Cặp Vật Thể Dễ Nhận Diện Nhầm Nhất (AI Confusion Categories)</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 font-mono">
                Active Learning Dataset
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Các trường hợp người học gửi báo lỗi scan — Nguồn dữ liệu quý giá phục vụ tinh chỉnh Prompt & Fine-tuning
            </p>
          </div>

          <span className="text-[11px] font-mono text-text-muted self-start sm:self-auto">
            Top 5 Cặp Nhầm Lẫn
          </span>
        </div>

        {/* Confusion Table */}
        <div className="w-full overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left min-w-[720px]">
            <thead className="bg-surface-subtle text-[11px] text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Vật Thể Thực Tế (Ground Truth)</th>
                <th className="py-2.5 px-3">AI Nhận Diện Nhầm Thành</th>
                <th className="py-2.5 px-2 text-center">Số Lần Báo Lỗi</th>
                <th className="py-2.5 px-2 text-center">Tỷ Lệ Tự Sửa</th>
                <th className="py-2.5 px-3">Hành Động Khuyến Nghị Cho Kỹ Sư AI</th>
                <th className="py-2.5 px-2 text-center">Mức Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {confusionMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-text">
                    {item.realObject}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-danger">
                    {item.predictedLabel}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-text">
                    {item.occurrences}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-emerald-600 font-semibold">
                    {item.autoFixRate}%
                  </td>
                  <td className="py-2.5 px-3 text-text-muted max-w-[280px]">
                    {item.suggestedAction}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border uppercase ${
                        item.severity === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.severity === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>
            Dữ liệu từ bảng này được tự động xuất sang file JSONL phục vụ tinh chỉnh Vision API định kỳ hàng tháng.
          </span>
          <span className="font-semibold text-text">Feedback Loop Active</span>
        </div>
      </div>
    </div>
  );
};
