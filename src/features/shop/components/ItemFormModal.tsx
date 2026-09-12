import React, { useState } from 'react';
import {
  ShopItem,
  ShopItemCategory,
  ShopCurrency,
  ShopItemStatus,
  ShopItemRarity,
  ShopItemBadge,
  GuardrailConfig,
} from '../../../domains/economy/types';
import { validateItemGuardrails } from '../../../domains/economy/selectors';
import { X, AlertTriangle, ShieldCheck, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

const CLEAN_SHOP_ICONS = [
  { path: '/images/shop/icon1_clean.png', label: '2XP' },
  { path: '/images/shop/icon2_clean.png', label: 'Nam Châm' },
  { path: '/images/shop/icon3_clean.png', label: 'Huy Hiệu' },
  { path: '/images/shop/icon4_clean.png', label: 'Cúp Vàng' },
  { path: '/images/shop/icon5_clean.png', label: 'Lá Chắn' },
  { path: '/images/shop/icon6_clean.png', label: 'Vé Đổi' },
  { path: '/images/shop/icon7_clean.png', label: 'Gợi Ý' },
  { path: '/images/shop/icon8_clean.png', label: 'Timer' },
  { path: '/images/shop/icon9_clean.png', label: 'Bình Tim' },
  { path: '/images/shop/badge1_clean.png', label: 'Học Giả' },
  { path: '/images/shop/badge2_clean.png', label: 'Cú Đêm' },
  { path: '/images/shop/badge3_clean.png', label: 'Phượng Hoàng' },
  { path: '/images/shop/badge10_clean.png', label: 'Theme Neon' },
  { path: '/images/shop/badge11_clean.png', label: 'Hoàng Kim' },
  { path: '/images/shop/badge12_clean.png', label: 'Rồng Thần' },
];

const BG_COLOR_OPTIONS = [
  { bg: 'bg-sky-50', border: 'border-sky-200', name: 'Xanh trời' },
  { bg: 'bg-amber-50', border: 'border-amber-200', name: 'Vàng cam' },
  { bg: 'bg-rose-50', border: 'border-rose-200', name: 'Hồng phấn' },
  { bg: 'bg-red-50', border: 'border-red-200', name: 'Đỏ ấm' },
  { bg: 'bg-blue-50', border: 'border-blue-200', name: 'Xanh dương' },
  { bg: 'bg-purple-50', border: 'border-purple-200', name: 'Tím mộng' },
  { bg: 'bg-orange-50', border: 'border-orange-200', name: 'Cam tươi' },
  { bg: 'bg-info-50', border: 'border-info-200', name: 'Xanh ngọc' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', name: 'Chàm tím' },
  { bg: 'bg-yellow-50', border: 'border-yellow-200', name: 'Hoàng kim' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', name: 'Ngọc bích' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', name: 'Cyan lạnh' },
];

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ShopItem) => void;
  initialItem?: ShopItem | null;
  guardrailConfig: GuardrailConfig;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  guardrailConfig,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialItem);

  const [name, setName] = useState<string>(initialItem?.name || '');
  const [sku, setSku] = useState<string>(initialItem?.sku || `SKU-ITEM-${Date.now().toString().slice(-4)}`);
  const [description, setDescription] = useState<string>(initialItem?.description || '');
  const [category, setCategory] = useState<ShopItemCategory>(initialItem?.category || 'booster');
  const [currency, setCurrency] = useState<ShopCurrency>(initialItem?.currency || 'coins');
  const [price, setPrice] = useState<number>(initialItem?.originalPrice || 250);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(initialItem?.discountPrice);
  const [hasDiscount, setHasDiscount] = useState<boolean>(Boolean(initialItem?.discountPrice));
  const [rarity, setRarity] = useState<ShopItemRarity>(initialItem?.rarity || 'rare');
  const [badge, setBadge] = useState<ShopItemBadge | ''>(initialItem?.badge || '');
  const [icon, setIcon] = useState<string>(initialItem?.icon || '⚡');
  const [imageUrl, setImageUrl] = useState<string>(
    initialItem?.imageUrl || '/images/shop/icon1_clean.png'
  );
  const [bgColorClass, setBgColorClass] = useState<string>(
    initialItem?.bgColorClass || 'bg-amber-50'
  );
  const [status, setStatus] = useState<ShopItemStatus>(initialItem?.status || 'active');
  const [purchaseLimit, setPurchaseLimit] = useState<number>(initialItem?.purchaseLimitPerUser || 1);

  // Validate price against Guardrail
  const guardrailCheck = validateItemGuardrails(price, currency, guardrailConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên vật phẩm.');
      return;
    }
    if (!guardrailCheck.isValid) {
      alert(guardrailCheck.message || 'Giá niêm yết không hợp lệ theo chính sách an toàn.');
      return;
    }

    const newItem: ShopItem = {
      id: initialItem?.id || `shop-${Date.now()}`,
      sku,
      name,
      description,
      category,
      currency,
      originalPrice: Number(price),
      discountPrice: hasDiscount && discountPrice ? Number(discountPrice) : undefined,
      rarity,
      badge: badge ? (badge as ShopItemBadge) : undefined,
      icon,
      imageUrl,
      bgColorClass,
      previewAsset: imageUrl || initialItem?.previewAsset || 'asset_token_preview',
      status: hasDiscount ? 'flash_sale' : status,
      purchaseLimitPerUser: Number(purchaseLimit),
      unitsSold: initialItem?.unitsSold || 0,
      totalRevenue: initialItem?.totalRevenue || 0,
      sinkPercent: initialItem?.sinkPercent || 0,
      createdDate: initialItem?.createdDate || new Date().toISOString().split('T')[0],
      lastUpdated: 'Vừa xong',
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div>
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <Sparkles size={16} className="text-[#9A7000]" />
              <span>{isEditing ? 'Chỉnh Sửa Vật Phẩm Shop' : 'Tạo Vật Phẩm Mới Trong Cửa Hàng'}</span>
            </h3>
            <p className="text-[11px] text-text-muted">
              Cấu hình niêm yết, phân loại và giá bán theo chuẩn LiveOps Virtual Economy
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200 text-text-muted hover:text-text transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Row 1: Name & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text mb-1">
                Tên Vật Phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Streak Freeze Shield (Lá chắn chuỗi)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-text font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-1">
                Mã SKU <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface font-mono text-text uppercase"
              />
            </div>
          </div>

          {/* Row 2: Category, Currency & Icon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-text mb-1">Phân Loại</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShopItemCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text font-medium"
              >
                <option value="streak_saver">Lá Chắn Chuỗi (Streak Saver)</option>
                <option value="booster">Booster XP / Tăng Tốc</option>
                <option value="avatar_frame">Khung Avatar (Avatar Frame)</option>
                <option value="theme">Theme Giao Diện (Theme UI)</option>
                <option value="deck">Bộ Thẻ Học Thuật (Study Deck)</option>
                <option value="chest">Rương May Mắn (Mystery Chest)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">Loại Tiền Tệ</label>
              <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-surface-subtle border border-border">
                <button
                  type="button"
                  onClick={() => setCurrency('coins')}
                  className={`py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                    currency === 'coins'
                      ? 'bg-surface text-[#9A7000] shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <span>🟡</span>
                  <span>Coins</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('gems')}
                  className={`py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                    currency === 'gems'
                      ? 'bg-surface text-info shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <span>💎</span>
                  <span>Gems</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">Icon / Biểu Tượng</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-14 text-center px-2 py-2 text-lg rounded-lg border border-border bg-surface"
                />
                <div className="flex items-center gap-1 text-xs">
                  {['🛡️', '⚡', '✨', '💼', '🎁', '🎓', '🔥', '🌌'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className="w-7 h-7 rounded-md hover:bg-surface-subtle border border-transparent hover:border-border text-sm flex items-center justify-center"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2.5: Real Shop Asset (Clean PNG) & Background Tint */}
          <div className="p-3 rounded-xl bg-surface-subtle/80 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text flex items-center gap-1.5">
                <ImageIcon size={14} className="text-primary" />
                <span>Ảnh Item Thực Tế (SnapVocab Clean PNG)</span>
              </span>
              <span className="text-[10px] text-text-muted font-mono">public/images/shop/*</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              {/* Preview Card */}
              <div className="flex items-center gap-2 sm:col-span-1 p-2 rounded-lg bg-surface border border-border">
                <div
                  className={`w-14 h-14 rounded-xl ${bgColorClass} border border-border/80 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-10 h-10 object-contain drop-shadow-xs"
                    />
                  ) : (
                    <span className="text-2xl">{icon}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-text truncate">Preview</div>
                  <div className="text-[9px] text-text-muted font-mono truncate">
                    {imageUrl ? imageUrl.split('/').pop() : 'Chưa chọn'}
                  </div>
                </div>
              </div>

              {/* Asset Selector */}
              <div className="sm:col-span-3 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    Chọn Ảnh PNG Không Nền:
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {CLEAN_SHOP_ICONS.map((it) => {
                      const isChosen = imageUrl === it.path;
                      return (
                        <button
                          key={it.path}
                          type="button"
                          onClick={() => setImageUrl(it.path)}
                          title={it.label}
                          className={`w-9 h-9 rounded-lg p-1 border transition-all shrink-0 flex items-center justify-center ${
                            isChosen
                              ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                              : 'border-border bg-surface hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={it.path}
                            alt={it.label}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Tint Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    Màu Nền Thẻ (Mobile Card Tint):
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                    {BG_COLOR_OPTIONS.map((c) => {
                      const isChosen = bgColorClass === c.bg;
                      return (
                        <button
                          key={c.bg}
                          type="button"
                          onClick={() => setBgColorClass(c.bg)}
                          title={c.name}
                          className={`w-6 h-6 rounded-md ${c.bg} border transition-all shrink-0 ${
                            isChosen
                              ? 'ring-2 ring-primary border-primary scale-110'
                              : 'border-border/80 hover:border-text-muted'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Pricing & Guardrails Feedback */}
          <div className="p-3 rounded-xl bg-surface-subtle/80 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text flex items-center gap-1.5">
                <span>Thiết Lập Giá Bán & Khuyến Mãi</span>
                {currency === 'coins' ? (
                  <span className="text-[10px] text-[#9A7000] font-mono">(Coins Thường)</span>
                ) : (
                  <span className="text-[10px] text-info font-mono">(Gems Cao Cấp)</span>
                )}
              </span>

              <div className="flex items-center gap-1.5 text-[10px]">
                {guardrailCheck.isWarning ? (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold flex items-center gap-1">
                    <AlertTriangle size={11} />
                    <span>Cảnh báo vượt trần an toàn</span>
                  </span>
                ) : guardrailCheck.isValid ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>Hợp chuẩn Guardrail</span>
                  </span>
                ) : (
                  <span className="text-danger bg-danger-light px-2 py-0.5 rounded-full border border-danger/20 font-bold flex items-center gap-1">
                    <AlertTriangle size={11} />
                    <span>Không hợp lệ</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">
                  Giá Niêm Yết ({currency === 'coins' ? 'Coins' : 'Gems'})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs">
                    {currency === 'coins' ? '🟡' : '💎'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border bg-surface font-mono font-bold text-text"
                  />
                </div>
                {guardrailCheck.message && (
                  <p className="text-[10px] text-amber-700 mt-1">{guardrailCheck.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-text-muted">Giá Khuyến Mãi</label>
                  <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-text">Bật Flash Sale</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs">
                    {currency === 'coins' ? '🟡' : '💎'}
                  </span>
                  <input
                    type="number"
                    disabled={!hasDiscount}
                    value={discountPrice || ''}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    placeholder="VD: 200..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border bg-surface font-mono font-bold text-text disabled:opacity-50 disabled:bg-neutral-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Rarity, Badge & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-text mb-1">Độ Hiếm (Rarity)</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as ShopItemRarity)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text font-medium"
              >
                <option value="common">Common (Phổ thông)</option>
                <option value="rare">Rare (Hiếm)</option>
                <option value="epic">Epic (Sử thi)</option>
                <option value="legendary">Legendary (Huyền thoại)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">Huy Hiệu (Badge Tag)</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as ShopItemBadge | '')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text font-medium"
              >
                <option value="">Không gán nhãn</option>
                <option value="HOT">HOT (Bán chạy)</option>
                <option value="NEW">NEW (Mới ra mắt)</option>
                <option value="LIMITED">LIMITED (Giới hạn)</option>
                <option value="BEST_VALUE">BEST_VALUE (Tiết kiệm nhất)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">Trạng Thái Mở Bán</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShopItemStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text font-medium"
              >
                <option value="active">Active (Đang mở bán)</option>
                <option value="draft">Draft (Bản nháp)</option>
                <option value="flash_sale">Flash Sale (Khuyến mãi)</option>
                <option value="archived">Archived (Lưu trữ/Ẩn)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Purchase Limit & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-text mb-1">Giới Hạn Mua / User</label>
              <input
                type="number"
                min={1}
                max={99}
                value={purchaseLimit}
                onChange={(e) => setPurchaseLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface font-mono text-text"
              />
              <span className="text-[10px] text-text-muted mt-0.5 block">
                VD: Lá chắn tối đa tích lũy 2 chiếc
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text mb-1">Mô Tả Vật Phẩm</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả công dụng, thời hạn và lợi ích khi người học trang bị..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-text font-normal resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-semibold transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Check size={14} />
              <span>{isEditing ? 'Lưu Thay Đổi' : 'Tạo Vật Phẩm & Mở Bán'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
