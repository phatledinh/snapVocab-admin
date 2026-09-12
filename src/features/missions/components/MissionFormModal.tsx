import React, { useState, useEffect } from 'react';
import {
  Mission,
  MissionType,
  MissionActionType,
  MissionDifficulty,
  MissionTargetAudience,
  MissionStatus,
  MissionGuardrailConfig,
} from '../../../domains/missions/types';
import { validateMissionRewardGuardrails } from '../../../domains/missions/selectors';
import {
  X,
  Check,
  AlertTriangle,
  Target,
  Sparkles,
  Coins,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface MissionFormModalProps {
  isOpen: boolean;
  editingMission: Mission | null;
  guardrailConfig: MissionGuardrailConfig;
  onClose: () => void;
  onSave: (missionData: Partial<Mission>, isOverrideApproved?: boolean) => void;
}

export const MissionFormModal: React.FC<MissionFormModalProps> = ({
  isOpen,
  editingMission,
  guardrailConfig,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Mission>>({
    code: '',
    title: '',
    description: '',
    type: 'daily',
    actionType: 'SCAN_OBJECT',
    targetCount: 3,
    unit: 'lượt scan có lưu từ',
    difficulty: 'easy',
    weight: 80,
    status: 'active',
    targetAudience: 'all',
    isBonus: false,
    reward: { xp: 40, coins: 60, gems: 0 },
  });

  const [overrideApproved, setOverrideApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingMission) {
      setFormData({
        ...editingMission,
        reward: { ...editingMission.reward },
      });
      setOverrideApproved(
        (editingMission.reward.coins || 0) > guardrailConfig.maxCoinsCapPerQuest
      );
    } else {
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      setFormData({
        code: `MS-D-${randomSuffix}`,
        title: '',
        description: '',
        type: 'daily',
        actionType: 'SCAN_OBJECT',
        targetCount: 3,
        unit: 'lượt scan có lưu từ',
        difficulty: 'easy',
        weight: 80,
        status: 'active',
        targetAudience: 'all',
        isBonus: false,
        reward: { xp: 40, coins: 60, gems: 0 },
      });
      setOverrideApproved(false);
    }
    setErrorMessage('');
  }, [editingMission, isOpen, guardrailConfig]);

  if (!isOpen) return null;

  // Real-time Guardrail Validation
  const currentReward = formData.reward || { xp: 0, coins: 0 };
  const guardrailValidation = validateMissionRewardGuardrails(
    currentReward,
    guardrailConfig
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      setErrorMessage('Vui lòng nhập tên tiêu đề nhiệm vụ.');
      return;
    }
    if (!formData.code?.trim()) {
      setErrorMessage('Vui lòng nhập mã nhiệm vụ.');
      return;
    }
    if ((formData.targetCount || 0) <= 0) {
      setErrorMessage('Chỉ tiêu mục tiêu phải lớn hơn 0.');
      return;
    }

    if (!guardrailValidation.isValid && !overrideApproved) {
      setErrorMessage(
        'Phần thưởng vượt trần an toàn. Bạn cần tích chọn xác nhận ngoại lệ của Super Admin để tiếp tục.'
      );
      return;
    }

    onSave(formData, overrideApproved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary border border-primary/20 flex items-center justify-center">
              <Target size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">
                {editingMission ? `Chỉnh Sửa Nhiệm Vụ: ${editingMission.code}` : 'Tạo Nhiệm Vụ Mới'}
              </h2>
              <p className="text-[11px] text-text-muted">
                Cấu hình chỉ tiêu, phần thưởng và thuật toán xoay tua trong Pool
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 bg-danger-light/50 border border-danger/20 rounded-xl text-danger text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Row 1: Code & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-text mb-1">
                Mã Nhiệm Vụ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: MS-D-12"
                className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-text mb-1">
                Tiêu Đề Nhiệm Vụ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Quét 3 đồ vật quanh bạn bằng AI Camera"
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-text mb-1">
              Mô Tả / Hướng Dẫn Người Học
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giải thích rõ ràng điều kiện để học viên nhận thưởng..."
              className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Row 2: Type, Action Type, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-text mb-1">Loại Nhiệm Vụ</label>
              <select
                value={formData.type || 'daily'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as MissionType,
                  })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="daily">Hàng Ngày (Daily Pool)</option>
                <option value="weekly">Hàng Tuần (Weekly)</option>
                <option value="achievement">Thành Tựu (Achievement)</option>
                <option value="special_event">Sự Kiện Đặc Biệt (Event)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Hành Động Mục Tiêu</label>
              <select
                value={formData.actionType || 'SCAN_OBJECT'}
                onChange={(e) => {
                  const val = e.target.value as MissionActionType;
                  let unit = 'lượt';
                  if (val === 'SCAN_OBJECT') unit = 'lượt scan có lưu từ';
                  if (val === 'REVIEW_SRS') unit = 'thẻ flashcard';
                  if (val === 'LEARN_NEW_WORDS') unit = 'từ mới';
                  if (val === 'QUIZ_PERFECT') unit = 'bài quiz 100%';
                  if (val === 'MAINTAIN_STREAK') unit = 'ngày streak';
                  if (val === 'EXPLORE_TOPIC') unit = 'chủ đề';
                  if (val === 'LISTEN_AUDIO') unit = 'lượt nghe audio';
                  setFormData({ ...formData, actionType: val, unit });
                }}
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="SCAN_OBJECT">AI Camera Scan (Có lưu từ)</option>
                <option value="REVIEW_SRS">Ôn Tập Flashcard SRS</option>
                <option value="LEARN_NEW_WORDS">Học Từ Mới (Decks/Topics)</option>
                <option value="QUIZ_PERFECT">Làm Quiz Đạt 100%</option>
                <option value="MAINTAIN_STREAK">Duy Trì Chuỗi Streak</option>
                <option value="EXPLORE_TOPIC">Khám Phá Chủ Đề Mới</option>
                <option value="LISTEN_AUDIO">Nghe Audio Phát Âm</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Độ Khó</label>
              <select
                value={formData.difficulty || 'easy'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as MissionDifficulty,
                  })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="easy">Dễ (Easy)</option>
                <option value="medium">Trung Bình (Medium)</option>
                <option value="hard">Thử Thách (Hard)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Target Count & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-text mb-1">
                Chỉ Tiêu Hoàn Thành <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.targetCount || 1}
                onChange={(e) =>
                  setFormData({ ...formData, targetCount: Number(e.target.value) })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold text-text mb-1">Đơn Vị Tính</label>
              <input
                type="text"
                value={formData.unit || ''}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="VD: từ mới, thẻ SRS, ngày streak"
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Section: Rewards & Guardrail Enforcer */}
          <div className="bg-surface-subtle/70 border border-border rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins size={15} className="text-[#9A7000]" />
                <span className="font-bold text-text">Cơ Cấu Phần Thưởng (Rewards)</span>
              </div>
              <span className="text-[10px] text-text-muted">
                Trần an toàn: 1,000🪙 · 100💎
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">Kinh Nghiệm (XP)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reward?.xp || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward: { ...formData.reward!, xp: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Tiền Xu (Coins) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.reward?.coins || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward: { ...formData.reward!, coins: Number(e.target.value) },
                    })
                  }
                  className={`w-full p-2 rounded-lg border bg-surface text-text font-mono font-bold focus:ring-1 ${
                    (formData.reward?.coins || 0) > guardrailConfig.maxCoinsCapPerQuest
                      ? 'border-danger focus:ring-danger text-danger'
                      : 'border-border focus:ring-primary focus:border-primary'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Đá Quý (Gems)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reward?.gems || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward: { ...formData.reward!, gems: Number(e.target.value) },
                    })
                  }
                  className={`w-full p-2 rounded-lg border bg-surface text-text font-mono font-bold focus:ring-1 ${
                    (formData.reward?.gems || 0) > guardrailConfig.maxGemsCapPerQuest
                      ? 'border-danger focus:ring-danger text-danger'
                      : 'border-border focus:ring-primary focus:border-primary'
                  }`}
                />
              </div>
            </div>

            {/* Guardrail Violation Warning Box */}
            {!guardrailValidation.isValid && (
              <div className="p-3 bg-danger-light/40 border border-danger/30 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2 text-danger">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">CẢNH BÁO LIVE-OPS GUARDRAILS:</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                      {guardrailValidation.issues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1.5 border-t border-danger/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideApproved}
                    onChange={(e) => setOverrideApproved(e.target.checked)}
                    className="rounded border-danger text-danger focus:ring-danger"
                  />
                  <span className="text-[11px] font-semibold text-text">
                    Tôi xác nhận mức thưởng này đã được Super Admin phê duyệt ngoại lệ (Whitelisted).
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Row 4: Weight, Audience, Bonus flag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-text">Trọng Số Pool (1-100)</label>
                <span className="text-text-muted font-mono font-bold">{formData.weight}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.weight || 50}
                onChange={(e) =>
                  setFormData({ ...formData, weight: Number(e.target.value) })
                }
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Đối Tượng Phục Vụ</label>
              <select
                value={formData.targetAudience || 'all'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAudience: e.target.value as MissionTargetAudience,
                  })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="all">Tất cả người học</option>
                <option value="new_users">Người mới (&lt; 7 ngày)</option>
                <option value="intermediate">Trung cấp (B1-B2)</option>
                <option value="advanced">Nâng cao (C1-C2)</option>
                <option value="at_risk_streak">Có nguy cơ đứt Streak</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Trạng Thái</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as MissionStatus,
                  })
                }
                className="w-full p-2 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="active">Đang chạy (Active Pool)</option>
                <option value="draft">Bản nháp (Draft)</option>
                <option value="scheduled">Lên lịch (Scheduled)</option>
                <option value="archived">Lưu trữ (Archived)</option>
              </select>
            </div>
          </div>

          {/* Bonus Mission checkbox if daily */}
          {formData.type === 'daily' && (
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBonus || false}
                  onChange={(e) => setFormData({ ...formData, isBonus: e.target.checked })}
                  className="rounded border-border text-snapy focus:ring-snapy"
                />
                <span className="font-semibold text-text">
                  Đánh dấu là Nhiệm Vụ Thưởng Thêm (+1 Bonus Quest)
                </span>
              </label>
              <span className="text-[10px] text-text-muted">
                Bonus không tính vào điều kiện 5/5 Daily Chest
              </span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-subtle transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-hover flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check size={14} />
              <span>{editingMission ? 'Lưu Thay Đổi' : 'Tạo & Đưa Vào Pool'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
