import React from 'react';
import { AlertCircle, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SettingsUnsavedBarProps {
  dirtyCount: number;
  hasGuardrailViolation: boolean;
  onDiscard: () => void;
  onOpenSaveModal: () => void;
}

export const SettingsUnsavedBar: React.FC<SettingsUnsavedBarProps> = ({
  dirtyCount,
  hasGuardrailViolation,
  onDiscard,
  onOpenSaveModal,
}) => {
  if (dirtyCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-neutral-700/80 px-5 py-3 flex items-center justify-between gap-4">
        {/* Left message */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-snapy/20 border border-snapy/40 flex items-center justify-center text-snapy shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Có <span className="text-snapy underline">{dirtyCount} tham số</span> đã chỉnh sửa
              </span>
              {hasGuardrailViolation && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <AlertCircle size={10} />
                  Có vi phạm Guardrail
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              Các thay đổi sẽ không có hiệu lực cho đến khi bạn xác nhận qua Sổ cái Kiểm toán.
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDiscard}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700"
          >
            <RotateCcw size={12} />
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={onOpenSaveModal}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary hover:bg-primary-hover text-white transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 active:scale-95"
          >
            <Check size={14} className="stroke-[3]" />
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};
