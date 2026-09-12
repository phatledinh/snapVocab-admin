import React, { useState } from 'react';
import {
  Wrench,
  Smartphone,
  HardDrive,
  Trash2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Power,
  Database,
} from 'lucide-react';
import { SystemMaintenanceConfig } from '../../../domains/settings/types';

interface SystemMaintenanceTabProps {
  config: SystemMaintenanceConfig;
  onChange: (updated: Partial<SystemMaintenanceConfig>) => void;
  showToast: (msg: string) => void;
}

export const SystemMaintenanceTab: React.FC<SystemMaintenanceTabProps> = ({
  config,
  onChange,
  showToast,
}) => {
  const [purgingTarget, setPurgingTarget] = useState<string | null>(null);

  const handlePurge = (target: 'dictionary' | 'aiQueue' | 'leaderboard', label: string) => {
    setPurgingTarget(target);
    setTimeout(() => {
      setPurgingTarget(null);
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

      if (target === 'dictionary') {
        onChange({ lastDictionaryPurgeTime: `${nowStr} (Thủ công bởi Admin)` });
      } else if (target === 'aiQueue') {
        onChange({ lastAiQueuePurgeTime: `${nowStr} (Thủ công bởi Admin)` });
      } else if (target === 'leaderboard') {
        onChange({ lastLeaderboardPurgeTime: `${nowStr} (Thủ công bởi Admin)` });
      }

      showToast(`Đã xóa sạch bộ nhớ đệm (Purge Cache) cho ${label}!`);
    }, 600);
  };

  const percentStorageUsed = Math.round((config.storageUsedGb / config.storageMaxGb) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-neutral-800/10 via-neutral-800/5 to-transparent border border-neutral-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-md shrink-0">
            <Wrench size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-text tracking-tight">
                Bảo Trì Hạ Tầng, Phiên Bản Ứng Dụng & Bộ Nhớ Đệm
              </h2>
              {config.maintenanceModeActive ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger-light text-danger border border-danger/30 animate-pulse">
                  Chế Độ Bảo Trì Đang BẬT
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Hệ Thống Đang Vận Hành Bình Thường
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Chặn phiên bản Mobile App lỗi thời, giám sát dung lượng media Cloudflare R2 và xóa cache Redis khẩn cấp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface/90 px-3.5 py-2 rounded-xl border border-border shadow-xs text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">App tối thiểu</span>
            <span className="font-bold text-text">v{config.minSupportedAppVersion}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">R2 Storage</span>
            <span className="font-bold text-neutral-700">
              {config.storageUsedGb}GB / {config.storageMaxGb}GB ({percentStorageUsed}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Mobile App Version Enforcement */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-primary" />
              <h3 className="font-bold text-sm text-text">Kiểm Soát Phiên Bản Mobile App</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Endpoint /app-config</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Phiên Bản Bắt Buộc Tối Thiểu
                </label>
                <input
                  type="text"
                  value={config.minSupportedAppVersion}
                  onChange={(e) => onChange({ minSupportedAppVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-mono font-bold"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Ứng dụng thấp hơn phiên bản này sẽ bị chặn và yêu cầu cập nhật bắt buộc (specs.md L180).
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Phiên Bản Mới Nhất Trên Store
                </label>
                <input
                  type="text"
                  value={config.latestAppVersion}
                  onChange={(e) => onChange({ latestAppVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-mono font-bold"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Gợi ý nâng cấp cho người dùng.
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Link App Store (iOS)</label>
              <input
                type="text"
                value={config.appStoreUrl}
                onChange={(e) => onChange({ appStoreUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-neutral-50/50 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Link Google Play Store (Android)</label>
              <input
                type="text"
                value={config.playStoreUrl}
                onChange={(e) => onChange({ playStoreUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-neutral-50/50 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Storage Bucket Monitoring */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-info" />
              <h3 className="font-bold text-sm text-text">Dung Lượng Lưu Trữ Đối Tượng (Cloudflare R2)</h3>
            </div>
            <span className="text-[11px] font-mono text-info font-bold">FR-11 Media Storage</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Storage Bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold">
                <span className="text-text">Tỷ Lệ Chiếm Dụng Ổ Đĩa</span>
                <span className="text-info font-mono">{config.storageUsedGb} GB / {config.storageMaxGb} GB</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-info h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentStorageUsed}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Chứa toàn bộ ảnh minh họa từ vựng, audio phát âm và ảnh chụp camera AI scan.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-text mb-1">Bucket Name</label>
                <div className="p-2 rounded-xl bg-neutral-50 border border-border font-mono text-[11px] font-bold text-neutral-700">
                  {config.storageBucketName}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-text mb-1">CDN Custom Domain</label>
                <div className="p-2 rounded-xl bg-neutral-50 border border-border font-mono text-[11px] text-neutral-700 truncate">
                  {config.storageCdnDomain}
                </div>
              </div>
            </div>

            {/* Maintenance Mode Toggle Box */}
            <div className={`p-4 rounded-xl border transition-colors ${
              config.maintenanceModeActive
                ? 'bg-danger-light/40 border-danger/30'
                : 'bg-neutral-50 border-border'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Power size={16} className={config.maintenanceModeActive ? 'text-danger' : 'text-neutral-500'} />
                  <div>
                    <div className="font-bold text-text">Chế Độ Bảo Trì Toàn Hệ Thống</div>
                    <div className="text-[11px] text-neutral-500">
                      Khóa tạm thời các luồng tạo thẻ và thông báo bảo trì trên app mobile.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.maintenanceModeActive}
                  onChange={(e) => onChange({ maintenanceModeActive: e.target.checked })}
                  className="w-4 h-4 rounded text-danger focus:ring-danger"
                />
              </div>

              {config.maintenanceModeActive && (
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-danger mb-1">
                    Thông Điệp Bảo Trì Hiển Thị Cho Người Học
                  </label>
                  <input
                    type="text"
                    value={config.maintenanceMessageVi}
                    onChange={(e) => onChange({ maintenanceMessageVi: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-danger/30 bg-surface text-xs text-danger font-semibold focus:outline-hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Cache Purging Tools (Full width) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-danger" />
              <h3 className="font-bold text-sm text-text">
                Xóa Bộ Nhớ Đệm Khẩn Cấp (Emergency Cache Purging)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">audit/types.ts CACHE_PURGED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Card 1: Dictionary Cache */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-border flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <Database size={14} className="text-primary" />
                  Redis Dictionary Cache
                </div>
                <p className="text-[11px] text-neutral-500">
                  Xóa bộ nhớ đệm danh mục từ vựng, ví dụ ngữ cảnh và kết quả tra cứu IPA.
                </p>
                <div className="text-[10px] text-neutral-400 pt-1">
                  Lần xóa cuối: <span className="font-medium text-neutral-600">{config.lastDictionaryPurgeTime}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={purgingTarget !== null}
                onClick={() => handlePurge('dictionary', 'Từ Điển & Flashcards')}
                className="mt-4 w-full py-2 rounded-lg bg-surface hover:bg-neutral-200/80 border border-border text-neutral-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              >
                <RefreshCw size={12} className={purgingTarget === 'dictionary' ? 'animate-spin' : ''} />
                {purgingTarget === 'dictionary' ? 'Đang xóa...' : 'Xóa Cache Từ Điển'}
              </button>
            </div>

            {/* Card 2: AI Queue Cache */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-border flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-snapy" />
                  AI Scan Job Queue Cache
                </div>
                <p className="text-[11px] text-neutral-500">
                  Hủy các job bị kẹt hàng đợi trên Redis Celery/FastAPI do lỗi worker timeout.
                </p>
                <div className="text-[10px] text-neutral-400 pt-1">
                  Lần xóa cuối: <span className="font-medium text-neutral-600">{config.lastAiQueuePurgeTime}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={purgingTarget !== null}
                onClick={() => handlePurge('aiQueue', 'Hàng Đợi AI Scan')}
                className="mt-4 w-full py-2 rounded-lg bg-surface hover:bg-neutral-200/80 border border-border text-neutral-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              >
                <RefreshCw size={12} className={purgingTarget === 'aiQueue' ? 'animate-spin' : ''} />
                {purgingTarget === 'aiQueue' ? 'Đang xóa...' : 'Xóa Cache Hàng Đợi AI'}
              </button>
            </div>

            {/* Card 3: Leaderboard Cache */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-border flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-reward-hover" />
                  Leaderboard XP Snapshot Cache
                </div>
                <p className="text-[11px] text-neutral-500">
                  Ép máy chủ tính toán lại bảng xếp hạng XP tuần cho toàn bộ các giải đấu (Leagues).
                </p>
                <div className="text-[10px] text-neutral-400 pt-1">
                  Lần xóa cuối: <span className="font-medium text-neutral-600">{config.lastLeaderboardPurgeTime}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={purgingTarget !== null}
                onClick={() => handlePurge('leaderboard', 'Bảng Xếp Hạng Mùa Giải')}
                className="mt-4 w-full py-2 rounded-lg bg-surface hover:bg-neutral-200/80 border border-border text-neutral-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              >
                <RefreshCw size={12} className={purgingTarget === 'leaderboard' ? 'animate-spin' : ''} />
                {purgingTarget === 'leaderboard' ? 'Đang tính lại...' : 'Tính Lại Bảng Xếp Hạng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
