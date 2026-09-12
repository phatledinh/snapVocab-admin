import React from 'react';
import {
  Sparkles,
  Cpu,
  Sliders,
  Shield,
  Clock,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AIPipelineConfig } from '../../../domains/settings/types';

interface AiPipelineTabProps {
  config: AIPipelineConfig;
  onChange: (updated: Partial<AIPipelineConfig>) => void;
}

export const AiPipelineTab: React.FC<AiPipelineTabProps> = ({ config, onChange }) => {
  // Tính toán ước tính tải GPU trực quan
  const estimatedThroughput = (config.workerConcurrency * (60 / 20)).toFixed(1); // 20s/job
  const isHighLoad = config.dailyScanQuotaFree > 50;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-snapy/10 via-snapy/5 to-transparent border border-snapy/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-snapy text-white flex items-center justify-center shadow-md shadow-snapy/25 shrink-0">
            <Cpu size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-text tracking-tight">
                Florence-2-large + SAM (ViT-H) + CLIP (ViT-B/32) Pipeline
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-snapy-light text-snapy border border-snapy/30">
                Mode: F2-v13 Product
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Quy định cấu hình hàng đợi nhận diện ảnh, độ tin cậy nhãn, hạn ngạch quét hằng ngày và an toàn tệp tải lên.
            </p>
          </div>
        </div>

        {/* Live GPU Estimator pill */}
        <div className="flex items-center gap-3 bg-surface/90 px-3.5 py-2 rounded-xl border border-snapy/20 shadow-xs text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Ước tính tải GPU</span>
            <span className="font-bold text-text">~{estimatedThroughput} ảnh / phút</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Workers khả dụng</span>
            <span className="font-bold text-snapy">{config.workerConcurrency} Worker (1 GPU)</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Pipeline Service & Concurrency */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-snapy" />
              <h3 className="font-bold text-sm text-text">Dịch Vụ AI & Phân Bổ Worker</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">FastAPI Microservice</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">
                Endpoint URL Dịch Vụ AI Nội Bộ
              </label>
              <input
                type="text"
                value={config.internalEndpoint}
                onChange={(e) => onChange({ internalEndpoint: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-neutral-50/50 focus:bg-surface focus:outline-hidden focus:border-snapy font-mono text-xs"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Chỉ cho phép truy cập qua mạng nội bộ VPC giữa Backend Spring Boot và cụm AI GPU.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Worker GPU Song Song
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={config.workerConcurrency}
                    onChange={(e) => onChange({ workerConcurrency: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-snapy font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">worker</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Mặc định 1 worker/GPU T4 để tránh OOM VRAM.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Timeout Xử Lý Tối Đa
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={config.workerTimeoutSeconds}
                    onChange={(e) => onChange({ workerTimeoutSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-snapy font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">giây</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Timeout worker→AI cấu hình được (specs.md L645).
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Độ Sâu Hàng Đợi Tối Đa (Max Queue Depth)
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={config.maxQueueDepth}
                onChange={(e) => onChange({ maxQueueDepth: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-snapy font-bold"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Khi hàng đợi vượt quá con số này, hệ thống từ chối request ảnh mới và KHÔNG trừ quota của người dùng.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Confidence Floors & Thresholds */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-info" />
              <h3 className="font-bold text-sm text-text">Ngưỡng Nhận Diện & Bộ Lọc Lớp Cuối</h3>
            </div>
            <span className="text-[11px] text-info font-bold">F2-v13 Tuned</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Confidence Floor Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-text">
                  Ngưỡng Tin Cậy Nhận Diện (Confidence Floor)
                </label>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-info-light text-info border border-info/20">
                  {config.confidenceFloor.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.30}
                max={0.95}
                step={0.01}
                value={config.confidenceFloor}
                onChange={(e) => onChange({ confidenceFloor: parseFloat(e.target.value) })}
                className="w-full accent-info cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0.30 (Nhiều nhãn - Dễ nhiễu)</span>
                <span className="font-bold text-neutral-600">0.65 (Khuyến nghị)</span>
                <span>0.95 (Quá chặt)</span>
              </div>
            </div>

            {/* CLIP Score Floor Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-text">
                  Ngưỡng Lọc CLIP Score (Semantic Alignment Floor)
                </label>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-snapy-light text-snapy border border-snapy/20">
                  {config.clipScoreFloor.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.10}
                max={0.60}
                step={0.01}
                value={config.clipScoreFloor}
                onChange={(e) => onChange({ clipScoreFloor: parseFloat(e.target.value) })}
                className="w-full accent-snapy cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0.10 (Bỏ qua lọc)</span>
                <span className="font-bold text-neutral-600">0.28 (Chuẩn Internet-50)</span>
                <span>0.60 (Rất nghiêm ngặt)</span>
              </div>
            </div>

            {/* Tiled OD IoU */}
            <div>
              <label className="block font-semibold text-text mb-1">
                Độ Chồng Khớp Gom Nhãn Tiled OD Overlap (IoU)
              </label>
              <input
                type="number"
                step={0.05}
                min={0.2}
                max={0.8}
                value={config.tiledOverlapIou}
                onChange={(e) => onChange({ tiledOverlapIou: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-info font-bold"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Gom nhiều bounding boxes cùng nhãn thành một thẻ từ vựng duy nhất (buss_mainflow.md L292).
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Scan Quotas */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-primary" />
              <h3 className="font-bold text-sm text-text">Hạn Ngạch Scan Hằng Ngày (Daily Quotas)</h3>
            </div>
            {isHighLoad && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Tải Cao
              </span>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Học viên Miễn Phí (Free Tier)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={config.dailyScanQuotaFree}
                    onChange={(e) => onChange({ dailyScanQuotaFree: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">lượt/ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Mặc định 20 lượt/ngày (specs.md FR-02.10). Reset 00:00.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Học viên Trả Phí (Premium Tier)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={config.dailyScanQuotaPremium}
                    onChange={(e) => onChange({ dailyScanQuotaPremium: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">lượt/ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Ưu tiên hàng đợi riêng.
                </span>
              </div>
            </div>

            {/* Toggle Tự động retry */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border">
              <div>
                <div className="font-semibold text-text">Tự động Thử lại Job Lỗi (Auto Retry)</div>
                <div className="text-[11px] text-neutral-400">
                  Thử lại 1 lần nếu dịch vụ AI gặp trục trặc mạng hoặc GPU transient error.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.autoRetryFailedJobs}
                onChange={(e) => onChange({ autoRetryFailedJobs: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
            </div>

            {/* Toggle Active Learning Fine-tuning */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-snapy-light/40 border border-snapy/20">
              <div>
                <div className="font-semibold text-text flex items-center gap-1.5">
                  <Sparkles size={13} className="text-snapy" />
                  Active Learning Fine-Tuning Pipeline
                </div>
                <div className="text-[11px] text-neutral-500">
                  Tự động đưa ảnh đã sửa nhãn vào dataset tinh chỉnh Gemini Vision (design.md 7.2).
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.saveToFineTuningDataset}
                onChange={(e) => onChange({ saveToFineTuningDataset: e.target.checked })}
                className="w-4 h-4 rounded text-snapy focus:ring-snapy"
              />
            </div>
          </div>
        </div>

        {/* Section 4: File Safety & Upload Limits */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-text">An Toàn Tệp Tải Lên (File Safety)</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">specs.md FR-11</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Dung Lượng Ảnh Scan Tối Đa
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={config.maxScanImageSizeMb}
                    onChange={(e) => onChange({ maxScanImageSizeMb: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">MB</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Mặc định 10 MB (specs.md L643).</span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Dung Lượng Avatar Tối Đa
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={config.maxAvatarSizeMb}
                    onChange={(e) => onChange({ maxAvatarSizeMb: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">MB</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Mặc định 5 MB.</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Danh Sách Định Dạng Hợp Lệ (MIME Allowlist)
              </label>
              <div className="flex flex-wrap gap-2">
                {['image/jpeg', 'image/png', 'image/webp', 'image/heic'].map((mime) => {
                  const isChecked = config.allowedMimeTypes.includes(mime);
                  return (
                    <button
                      key={mime}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          if (config.allowedMimeTypes.length > 1) {
                            onChange({
                              allowedMimeTypes: config.allowedMimeTypes.filter((m) => m !== mime),
                            });
                          }
                        } else {
                          onChange({ allowedMimeTypes: [...config.allowedMimeTypes, mime] });
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-neutral-50 text-neutral-400 border-border'
                      }`}
                    >
                      {mime} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Chỉ cho phép các định dạng ảnh raster phổ biến để bảo vệ bộ giải mã hình ảnh FastAPI.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
