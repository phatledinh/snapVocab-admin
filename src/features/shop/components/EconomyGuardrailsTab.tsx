import React, { useState } from 'react';
import {
  GuardrailConfig,
  GuardrailViolation,
} from '../../../domains/economy/types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Power,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';

interface EconomyGuardrailsTabProps {
  config: GuardrailConfig;
  violations: GuardrailViolation[];
  onUpdateConfig: (newConfig: GuardrailConfig) => void;
  onRequestAuditAction: (
    title: string,
    description: string,
    isDangerous: boolean,
    onConfirm: () => void
  ) => void;
}

export const EconomyGuardrailsTab: React.FC<EconomyGuardrailsTabProps> = ({
  config,
  violations,
  onUpdateConfig,
  onRequestAuditAction,
}) => {
  const [localConfig, setLocalConfig] = useState<GuardrailConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof GuardrailConfig, value: number) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveCaps = () => {
    onRequestAuditAction(
      'Điều Chỉnh Tham Số Hàng Rào Guardrails',
      `Cập nhật trần thưởng nhiệm vụ (${localConfig.maxCoinsCapPerQuest} Coins, ${localConfig.maxGemsCapPerQuest} Gems) và trần giá bán Shop.`,
      false,
      () => {
        onUpdateConfig(localConfig);
        setHasChanges(false);
      }
    );
  };

  const handleToggleEmergencyMaintenance = () => {
    const nextState = !config.emergencyShopMaintenance;
    onRequestAuditAction(
      nextState ? 'KÍCH HOẠT ĐÓNG BĂNG SHOP KHẨN CẤP' : 'Hủy Chế Độ Bảo Trì Khẩn Cấp Shop',
      nextState
        ? 'Toàn bộ giao dịch mua vật phẩm của người học trên ứng dụng mobile sẽ bị tạm khóa ngay lập tức. Chỉ kích hoạt khi phát hiện lỗi kinh tế hoặc duplication exploit.'
        : 'Mở lại chức năng mua sắm bình thường cho người học.',
      true,
      () => {
        onUpdateConfig({ ...config, emergencyShopMaintenance: nextState });
      }
    );
  };

  const handleToggleLockStreakSaver = () => {
    const nextState = !config.lockStreakSaverSales;
    onRequestAuditAction(
      nextState ? 'Khóa Bán Lá Chắn Streak Freeze' : 'Mở Lại Bán Lá Chắn Streak Freeze',
      'Tạm thời khóa vật phẩm Streak Freeze Shield để rà soát hành vi spam chuỗi học tập.',
      true,
      () => {
        onUpdateConfig({ ...config, lockStreakSaverSales: nextState });
      }
    );
  };

  return (
    <div className="space-y-4 select-none">
      {/* Circuit Breakers / Emergency Switches */}
      <div className="p-4 rounded-xl border bg-surface border-border shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
          <div className="flex items-center gap-2">
            <Power size={16} className="text-danger" />
            <div>
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                Cơ Chế Ngắt Khẩn Cấp (LiveOps Circuit Breaker / Kill Switches)
              </h3>
              <p className="text-[11px] text-text-muted">
                Dừng khẩn cấp các chức năng tiêu thụ hoặc mua bán khi phát hiện exploit kinh tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {config.emergencyShopMaintenance ? (
              <span className="px-2.5 py-0.5 rounded-full bg-danger-light text-danger font-bold border border-danger/30 animate-pulse">
                SHOP ĐANG ĐÓNG BĂNG
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Hệ Thống Bình Thường
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Switch 1: Emergency Shop Maintenance */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
              config.emergencyShopMaintenance
                ? 'bg-danger-light/40 border-danger/40'
                : 'bg-surface-subtle border-border'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-text">
                <Lock size={14} className={config.emergencyShopMaintenance ? 'text-danger' : 'text-text-muted'} />
                <span>Emergency Shop Maintenance Mode</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Đóng băng toàn bộ giao dịch mua tại Shop trên Mobile ngay lập tức.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleEmergencyMaintenance}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 ${
                config.emergencyShopMaintenance
                  ? 'bg-danger hover:bg-danger-hover text-white'
                  : 'bg-surface hover:bg-surface-subtle border border-border text-text'
              }`}
            >
              {config.emergencyShopMaintenance ? 'Tắt Bảo Trì' : 'Bật Ngắt Khẩn Cấp'}
            </button>
          </div>

          {/* Switch 2: Lock Streak Saver Sales */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
              config.lockStreakSaverSales
                ? 'bg-amber-50 border-amber-300'
                : 'bg-surface-subtle border-border'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-text">
                <ShieldAlert size={14} className={config.lockStreakSaverSales ? 'text-amber-600' : 'text-text-muted'} />
                <span>Khóa Riêng Bán Lá Chắn Streak Freeze</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Khóa mua vật phẩm giữ chuỗi khi phát hiện botting hoặc nghi ngờ gian lận.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleLockStreakSaver}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 ${
                config.lockStreakSaverSales
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-surface hover:bg-surface-subtle border border-border text-text'
              }`}
            >
              {config.lockStreakSaverSales ? 'Mở Khóa Bán' : 'Tạm Khóa'}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2 Columns: Policy Caps Configuration & Violations Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 Cols: Config Caps */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-primary" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  Cấu Hình Ngưỡng An Toàn (Policy Caps)
                </h3>
              </div>
              {hasChanges && (
                <span className="text-[10px] text-primary font-bold animate-pulse">
                  Có thay đổi chưa lưu
                </span>
              )}
            </div>

            <div className="space-y-3">
              {/* Cap 1: Quest Coins */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text mb-1">
                  <span>Trần Thưởng Coins / Nhiệm Vụ</span>
                  <span className="font-mono font-bold text-[#9A7000]">
                    {localConfig.maxCoinsCapPerQuest} Coins
                  </span>
                </div>
                <input
                  type="number"
                  value={localConfig.maxCoinsCapPerQuest}
                  onChange={(e) => handleInputChange('maxCoinsCapPerQuest', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface font-mono"
                />
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Cấu hình vượt quá 1,000 Coins sẽ bị hệ thống tự động từ chối.
                </span>
              </div>

              {/* Cap 2: Quest Gems */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text mb-1">
                  <span>Trần Thưởng Gems / Nhiệm Vụ</span>
                  <span className="font-mono font-bold text-info">
                    {localConfig.maxGemsCapPerQuest} Gems
                  </span>
                </div>
                <input
                  type="number"
                  value={localConfig.maxGemsCapPerQuest}
                  onChange={(e) => handleInputChange('maxGemsCapPerQuest', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface font-mono"
                />
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Giới hạn tối đa 100 Gems cho các nhiệm vụ hoặc thành tựu tuần.
                </span>
              </div>

              {/* Cap 3: Max Shop Price */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text mb-1">
                  <span>Trần Giá Bán Tối Đa Tại Shop</span>
                  <span className="font-mono font-bold text-text">
                    {localConfig.maxItemPriceCoins} Coins / {localConfig.maxItemPriceGems} Gems
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={localConfig.maxItemPriceCoins}
                    onChange={(e) => handleInputChange('maxItemPriceCoins', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface font-mono"
                  />
                  <input
                    type="number"
                    value={localConfig.maxItemPriceGems}
                    onChange={(e) => handleInputChange('maxItemPriceGems', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface font-mono"
                  />
                </div>
              </div>

              {/* Cap 4: Daily Earn Cap */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text mb-1">
                  <span>Trần Kiếm Tiền Mỗi Ngày (Daily Earning Cap)</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {localConfig.dailyEarningCapCoins} Coins/ngày
                  </span>
                </div>
                <input
                  type="number"
                  value={localConfig.dailyEarningCapCoins}
                  onChange={(e) => handleInputChange('dailyEarningCapCoins', Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface font-mono"
                />
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Ngăn chặn hành vi dùng auto-click bot để farm Coins liên tục.
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!hasChanges}
            onClick={handleSaveCaps}
            className="w-full mt-4 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>Lưu Thay Đổi Tham Số Guardrail</span>
          </button>
        </div>

        {/* Right 7 Cols: Violations & Anomaly Alert Stream */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-amber-600" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  Nhật Ký Cảnh Báo Bất Thường & Vi Phạm Chính Sách
                </h3>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                {violations.length} Sự kiện ghi nhận
              </span>
            </div>

            <div className="space-y-2.5">
              {violations.map((vio) => {
                const isHigh = vio.severity === 'high';
                const isMedium = vio.severity === 'medium';

                return (
                  <div
                    key={vio.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isHigh
                        ? 'bg-danger-light/30 border-danger/30'
                        : isMedium
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-surface-subtle border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                            isHigh
                              ? 'bg-danger text-white'
                              : isMedium
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-500 text-white'
                          }`}
                        >
                          {vio.severity}
                        </span>
                        <span className="font-bold text-text font-mono">{vio.type}</span>
                        <span className="text-text-muted">·</span>
                        <span className="font-semibold text-text truncate max-w-[200px]">
                          {vio.targetName}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">{vio.timestamp}</span>
                    </div>

                    <p className="text-text-muted leading-relaxed text-[11px]">
                      {vio.description}
                    </p>

                    {vio.mitigatedBy && (
                      <div className="pt-1 border-t border-border/50 text-[10px] text-text-muted flex items-center justify-between">
                        <span>Xử lý bởi: <strong className="text-text">{vio.mitigatedBy}</strong></span>
                        <span className="italic">{vio.reason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
            <span>Tất cả các vi phạm đều được gửi webhook tới kênh Security Alert nội bộ.</span>
            <span className="font-bold text-emerald-700">Audit Status: Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
