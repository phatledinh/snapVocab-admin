import React from 'react';
import {
  GPUWorkerNode,
  OperationalConfig,
  AIScanEngineHealth,
  AIScanRequest,
} from '../../../domains/ai-scan/types';
import {
  Cpu,
  Zap,
  Activity,
  Sliders,
  Server,
  Layers,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface LiveEngineMonitorTabProps {
  workers: GPUWorkerNode[];
  config: OperationalConfig;
  health?: AIScanEngineHealth;
  activeRequests: AIScanRequest[];
  onConfigChange: (newConfig: OperationalConfig) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const LiveEngineMonitorTab: React.FC<LiveEngineMonitorTabProps> = ({
  workers,
  config,
  activeRequests,
  onConfigChange,
  onRefresh,
  isRefreshing,
}) => {
  const toggleFastMode = () => {
    onConfigChange({
      ...config,
      fastModeEnabled: !config.fastModeEnabled,
    });
  };

  const handleQuotaChange = (newQuota: number) => {
    onConfigChange({
      ...config,
      dailyQuotaPerLearner: Math.max(5, Math.min(100, newQuota)),
    });
  };

  const handleClipFloorChange = (newFloor: number) => {
    onConfigChange({
      ...config,
      clipScoreFloor: +(newFloor.toFixed(2)),
    });
  };

  const handleQueueLimitChange = (newLimit: number) => {
    onConfigChange({
      ...config,
      maxQueueDepthPerWorker: Math.max(5, Math.min(50, newLimit)),
    });
  };

  return (
    <div className="space-y-4">
      {/* Fast Mode Operational Alert Banner if enabled */}
      {config.fastModeEnabled && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
              <Zap size={16} />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>CHẾ ĐỘ FAST MODE ĐANG KÍCH HOẠT</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono">
                  Demo & High-Load SLA
                </span>
              </div>
              <div className="text-[11px] text-amber-800/90 mt-0.5">
                Hệ thống tự động bỏ qua Tiled OD và SAM segmentation mask để ép độ trễ xử lý xuống dưới <strong>10s/ảnh</strong>.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFastMode}
            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            Tắt Fast Mode
          </button>
        </div>
      )}

      {/* Layer 1: GPU Worker Nodes Cluster Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: GPU Nodes & Live VRAM */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-primary" />
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                Cụm Máy Chủ GPU Worker (FastAPI Service)
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 font-mono">
                1 Worker / 1 GPU SLA
              </span>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              className={`p-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-muted transition-all ${
                isRefreshing ? 'animate-spin text-primary' : ''
              }`}
              title="Làm mới trạng thái worker"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workers.map((worker) => {
              const vramPercent = Math.round(
                (worker.vramUsedMb / worker.vramTotalMb) * 100
              );
              const isBusy = worker.status === 'busy';
              return (
                <div
                  key={worker.id}
                  className="p-4 rounded-xl bg-surface border border-border shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Worker Header */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div>
                        <div className="text-xs font-bold text-text flex items-center gap-1.5">
                          <span>{worker.name}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isBusy ? 'bg-snapy animate-pulse' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <div className="text-[11px] text-text-muted font-mono mt-0.5">
                          {worker.gpuModel}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border font-mono ${
                          isBusy
                            ? 'bg-snapy-light text-snapy border-snapy/30'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {worker.status}
                      </span>
                    </div>

                    {/* VRAM Gauge */}
                    <div className="space-y-1.5 my-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-text-muted flex items-center gap-1 text-[11px]">
                          <Cpu size={12} />
                          <span>VRAM Sử Dụng:</span>
                        </span>
                        <span className="font-bold text-text">
                          {(worker.vramUsedMb / 1024).toFixed(1)}GB / {(worker.vramTotalMb / 1024).toFixed(0)}GB ({vramPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden border border-border/80">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            vramPercent > 80
                              ? 'bg-snapy'
                              : vramPercent > 90
                              ? 'bg-danger'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${vramPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* GPU Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border text-center text-xs">
                      <div>
                        <div className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
                          <Thermometer size={10} />
                          <span>Nhiệt độ</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-text mt-0.5">
                          {worker.temperatureC}°C
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
                          <Zap size={10} />
                          <span>Công suất</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-text mt-0.5">
                          {worker.powerUsageWatts}W
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
                          <Activity size={10} />
                          <span>Hôm nay</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-text mt-0.5">
                          {worker.processedJobsToday.toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Job / Idle status */}
                  <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] font-mono">
                    {worker.activeJobId ? (
                      <div className="flex items-center gap-1.5 text-snapy font-medium truncate">
                        <Activity size={12} className="animate-spin shrink-0" />
                        <span className="truncate">Job: {worker.activeJobId}</span>
                        <span className="text-text-muted text-[10px]">
                          ({(worker.activeJobElapsedMs! / 1000).toFixed(1)}s)
                        </span>
                      </div>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Sẵn sàng nhận request mới</span>
                      </span>
                    )}

                    <span className="text-text-light text-[10px]">
                      CUDA {worker.cudaVersion}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* In-Process Queue Depth & Pipeline Diagram */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-snapy" />
                <h4 className="text-xs font-bold text-text">
                  In-Process Queue Slots & Mô Hình Pipeline Florence-2 (F2-v13)
                </h4>
              </div>

              <div className="text-[11px] font-mono text-text-muted">
                Hàng đợi in-process: <span className="text-text font-bold">1 / {config.maxQueueDepthPerWorker * workers.length} slots</span>
              </div>
            </div>

            {/* Pipeline Stage Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs mb-3">
              <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                <div className="text-[10px] text-text-muted">Giai đoạn 1</div>
                <div className="text-xs font-bold text-text mt-0.5">Florence-2 OD</div>
                <div className="text-[9px] text-text-light font-mono">&lt;OD&gt; Zero-shot</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                <div className="text-[10px] text-text-muted">Giai đoạn 2</div>
                <div className="text-xs font-bold text-text mt-0.5">WordNet Filter</div>
                <div className="text-[9px] text-text-light font-mono">Concrete nouns</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                <div className="text-[10px] text-text-muted">Giai đoạn 3</div>
                <div className="text-xs font-bold text-text mt-0.5">CLIP Verify</div>
                <div className="text-[9px] text-text-light font-mono">Floor: {config.clipScoreFloor}</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                <div className="text-[10px] text-text-muted">Giai đoạn 4</div>
                <div className="text-xs font-bold text-text mt-0.5">SAM Mask Crop</div>
                <div className="text-[9px] text-text-light font-mono">
                  {config.fastModeEnabled ? 'Bỏ qua (Fast Mode)' : 'Alpha PNG Cutout'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                <div className="text-[10px] text-text-muted">Giai đoạn 5</div>
                <div className="text-xs font-bold text-text mt-0.5">Dict Mapping</div>
                <div className="text-[9px] text-text-light font-mono">SS-04 Oxford</div>
              </div>
            </div>

            {/* Currently Processing Job Banner */}
            {activeRequests.length > 0 && (
              <div className="p-2.5 rounded-lg bg-surface-subtle/80 border border-border flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-snapy animate-ping" />
                  <span className="text-text font-bold">Request Đang Xử Lý: {activeRequests[0].id}</span>
                  <span className="text-text-muted">({activeRequests[0].learnerName})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-snapy font-bold">Nhãn dự đoán: {activeRequests[0].predictedLabel}</span>
                  <span className="text-text-muted">Thời gian chạy: {(activeRequests[0].processingTimeMs / 1000).toFixed(1)}s</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Operational Hot Controls */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-snapy" />
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              Bảng Điều Khiển Tham Số Nóng (Hot Ops)
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-4">
            {/* Control 1: Fast Mode Switch */}
            <div className="p-3 rounded-lg border border-border bg-surface-subtle flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text flex items-center gap-1.5">
                  <span>Fast Mode (Demo SLA)</span>
                  {config.fastModeEnabled && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Bỏ qua SAM & Tiled OD, ép độ trễ &lt; 10s
                </div>
              </div>

              <button
                type="button"
                onClick={toggleFastMode}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  config.fastModeEnabled ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    config.fastModeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Control 2: Daily Quota per Learner */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">Hạn ngạch Scan/Ngày (Learner):</span>
                <span className="font-mono font-bold text-primary">
                  {config.dailyQuotaPerLearner} lượt/ngày
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={config.dailyQuotaPerLearner}
                onChange={(e) => handleQuotaChange(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>5 lượt</span>
                <span>Mặc định: 20 lượt</span>
                <span>50 lượt</span>
              </div>
            </div>

            {/* Control 3: CLIP Score Floor Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">Ngưỡng Sàn CLIP Verify:</span>
                <span className="font-mono font-bold text-snapy">
                  {config.clipScoreFloor} (Biên độ ±0.02)
                </span>
              </div>
              <input
                type="range"
                min="0.18"
                max="0.32"
                step="0.01"
                value={config.clipScoreFloor}
                onChange={(e) => handleClipFloorChange(Number(e.target.value))}
                className="w-full accent-snapy cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>0.18 (Nới lỏng)</span>
                <span>0.23 (Chuẩn F2-v13)</span>
                <span>0.32 (Nghiêm ngặt)</span>
              </div>
            </div>

            {/* Control 4: Max Queue Depth per Worker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">Giới Hạn Queue Slot/Worker:</span>
                <span className="font-mono font-bold text-text">
                  {config.maxQueueDepthPerWorker} slots
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={config.maxQueueDepthPerWorker}
                onChange={(e) => handleQueueLimitChange(Number(e.target.value))}
                className="w-full accent-text cursor-pointer"
              />
              <p className="text-[10px] text-text-muted leading-relaxed">
                Vượt quá slot này backend sẽ trả ngay mã lỗi <code>AI_QUEUE_FULL</code> để bảo vệ VRAM.
              </p>
            </div>

            {/* Control 5: Auto-Archive Trash Scans */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text">Tự Động Dọn Dẹp Ảnh Tạm</div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Xóa crop ảnh sau 24h nếu Learner không lưu vào Deck
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.autoArchiveTrashScans}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    autoArchiveTrashScans: e.target.checked,
                  })
                }
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
            </div>

            {/* SLA & Guardrails Note */}
            <div className="p-2.5 rounded-lg bg-primary-light/40 border border-primary/20 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] mb-1">
                <Sparkles size={12} />
                <span>Quy Ước Bảo Vệ Hệ Thống</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Khi GPU T4 xử lý chậm hoặc hàng đợi chạm mức 80%, hệ thống tự động kích hoạt cảnh báo gửi tới Slack Operator và đề xuất bật Fast Mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
