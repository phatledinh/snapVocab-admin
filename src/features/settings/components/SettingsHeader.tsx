import React, { useRef } from 'react';
import {
  Sliders,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { SystemSettingsSnapshot } from '../../../domains/settings/types';
import { exportSettingsAsJson } from '../../../domains/settings/selectors';

interface SettingsHeaderProps {
  settings: SystemSettingsSnapshot;
  dirtyCount: number;
  warningsCount: number;
  onResetToDefault: () => void;
  onImportJson: (importedSettings: SystemSettingsSnapshot) => void;
  showToast: (msg: string) => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  settings,
  dirtyCount,
  warningsCount,
  onResetToDefault,
  onImportJson,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportSettingsAsJson(settings);
    showToast(`Đã xuất tệp sao lưu cấu hình v${settings.version} thành công!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.aiPipeline && parsed.srsLearning && parsed.economyGuardrails) {
          onImportJson(parsed);
          showToast(`Đã nạp thành công cấu hình snapshot v${parsed.version || 'mới'}!`);
        } else {
          alert('Tệp JSON không đúng cấu trúc SystemSettingsSnapshot chuẩn của SnapVocab.');
        }
      } catch (err) {
        alert('Không thể đọc tệp JSON. Vui lòng kiểm tra định dạng cú pháp.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-surface border-b border-border px-6 py-4.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Status */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Sliders size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-text tracking-tight">
                  Cài Đặt Hệ Thống & Vận Hành
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-border">
                  Snapshot v{settings.version}
                </span>

                {dirtyCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-snapy-light text-snapy border border-snapy/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-snapy animate-pulse" />
                    {dirtyCount} tham số chưa lưu
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 size={11} />
                    Đã đồng bộ
                  </span>
                )}

                {warningsCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    <AlertTriangle size={11} />
                    {warningsCount} cảnh báo Guardrail
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-text-light" />
                  Cập nhật lần cuối: <strong className="text-text">{settings.updatedAt}</strong>
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-primary" />
                  Người điều chỉnh: <span className="font-medium text-text">{settings.updatedBy}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Hidden File Input for Import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-surface border border-border text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Nhập file sao lưu cấu hình JSON"
          >
            <Upload size={13} className="text-neutral-500" />
            Nhập JSON
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-surface border border-border text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Tải snapshot cấu hình về máy khách"
          >
            <Download size={13} className="text-neutral-500" />
            Xuất JSON
          </button>

          <button
            type="button"
            onClick={onResetToDefault}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 transition-colors flex items-center gap-1.5"
            title="Đặt lại toàn bộ tham số về giá trị xuất xưởng"
          >
            <RotateCcw size={13} />
            Mặc định
          </button>
        </div>
      </div>
    </div>
  );
};
