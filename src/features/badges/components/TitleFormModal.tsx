import React, { useState, useEffect } from 'react';
import {
  HonoraryTitle,
  BadgeTier,
  TitleFlairTheme,
  Badge,
} from '../../../domains/badges/types';
import { X, Check, Crown, Sparkles } from 'lucide-react';

interface TitleFormModalProps {
  isOpen: boolean;
  editingTitle: HonoraryTitle | null;
  badges: Badge[];
  onClose: () => void;
  onSave: (titleData: Partial<HonoraryTitle>) => void;
}

const FLAIR_THEME_CLASSES: Record<TitleFlairTheme, { label: string; class: string }> = {
  fire: {
    label: 'Ngọn Lửa (Fire Orange)',
    class: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 text-white shadow-xs',
  },
  emerald: {
    label: 'Lục Bảo (Emerald Scholar)',
    class: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs',
  },
  gold: {
    label: 'Vương Giả (Golden Prestige)',
    class: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-amber-950 font-extrabold shadow-xs',
  },
  royal: {
    label: 'Hoàng Gia (Royal Purple)',
    class: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xs',
  },
  neon: {
    label: 'Cyber Neon (Cyan Blue)',
    class: 'bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 text-slate-950 font-extrabold shadow-xs',
  },
};

export const TitleFormModal: React.FC<TitleFormModalProps> = ({
  isOpen,
  editingTitle,
  badges,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<BadgeTier>('gold');
  const [flairTheme, setFlairTheme] = useState<TitleFlairTheme>('fire');
  const [requiredBadgeId, setRequiredBadgeId] = useState('');
  const [status, setStatus] = useState<'active' | 'archived'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTitle) {
      setCode(editingTitle.code);
      setName(editingTitle.name);
      setDescription(editingTitle.description);
      setRarity(editingTitle.rarity);
      setFlairTheme(editingTitle.flairTheme);
      setRequiredBadgeId(editingTitle.requiredBadgeId || '');
      setStatus(editingTitle.status);
    } else {
      setCode(`TTL-${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setDescription('');
      setRarity('gold');
      setFlairTheme('fire');
      setRequiredBadgeId('');
      setStatus('active');
    }
    setErrors({});
  }, [editingTitle, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = 'Mã danh hiệu không được để trống';
    if (!name.trim()) errs.name = 'Tên danh hiệu bắt buộc nhập';
    if (!description.trim()) errs.description = 'Mô tả danh xưng bắt buộc nhập';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const reqBadge = badges.find((b) => b.id === requiredBadgeId);

    onSave({
      code: code.trim(),
      name: name.trim().startsWith('[') ? name.trim() : `[${name.trim()}]`,
      description: description.trim(),
      rarity,
      flairTheme,
      requiredBadgeId: requiredBadgeId || undefined,
      requiredBadgeName: reqBadge ? reqBadge.name : undefined,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-reward-light text-reward-hover flex items-center justify-center border border-reward/20">
              <Crown size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">
                {editingTitle ? `Sửa Danh Hiệu: ${editingTitle.code}` : 'Tạo Danh Hiệu Mới'}
              </h3>
              <p className="text-[11px] text-text-muted">
                Danh xưng danh dự hiển thị trên profile học viên
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Live Flair Preview Card */}
          <div className="p-3 bg-surface-subtle rounded-xl border border-border text-center space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase block">
              Xem trước huy hiệu danh xưng
            </span>
            <div className="flex justify-center my-1">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                  FLAIR_THEME_CLASSES[flairTheme].class
                }`}
              >
                <Sparkles size={12} />
                <span>{name || '[Tên Danh Hiệu]'}</span>
              </span>
            </div>
            <span className="text-[10px] text-text-muted">
              Độ hiếm:{' '}
              <span className="font-bold text-text uppercase font-mono">{rarity}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Mã Danh Hiệu: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: TTL-SCAN-01"
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-mono font-bold uppercase focus:ring-1 focus:ring-primary focus:border-primary"
              />
              {errors.code && <p className="text-[10px] text-danger mt-0.5">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Tên Danh Hiệu: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: [Thần Đèn Scan]"
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-bold focus:ring-1 focus:ring-primary focus:border-primary"
              />
              {errors.name && <p className="text-[10px] text-danger mt-0.5">{errors.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Ý Nghĩa & Vinh Danh: <span className="text-danger">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Vinh danh người học đạt 100 lần scan lưu từ thành công..."
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-text focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {errors.description && (
              <p className="text-[10px] text-danger mt-0.5">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Phong Cách Màu Sắc (Flair):
              </label>
              <select
                value={flairTheme}
                onChange={(e) => setFlairTheme(e.target.value as TitleFlairTheme)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-medium focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {Object.entries(FLAIR_THEME_CLASSES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Bậc Độ Hiếm:
              </label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as BadgeTier)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text font-semibold uppercase font-mono focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="bronze">Bronze (Đồng)</option>
                <option value="silver">Silver (Bạc)</option>
                <option value="gold">Gold (Vàng)</option>
                <option value="platinum">Platinum (Bạch Kim)</option>
                <option value="diamond">Diamond (Kim Cương)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Liên kết Huy hiệu mở khóa (Tùy chọn):
            </label>
            <select
              value={requiredBadgeId}
              onChange={(e) => setRequiredBadgeId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-text"
            >
              <option value="">-- Mở tự động / Trao trực tiếp --</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code} - Hạng {b.tier})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-muted hover:text-text transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check size={14} />
              <span>{editingTitle ? 'Lưu Thay Đổi' : 'Tạo Danh Hiệu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
