import React, { useState, useMemo } from 'react';
import {
  ShopItem,
  ShopFilterState,
  ShopItemCategory,
  ShopCurrency,
  ShopItemStatus,
  GuardrailConfig,
} from '../../../domains/economy/types';
import { filterShopItems } from '../../../domains/economy/selectors';
import { MobileShopSimulator } from './MobileShopSimulator';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Tag,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CatalogManagerTabProps {
  items: ShopItem[];
  onAddItem: () => void;
  onEditItem: (item: ShopItem) => void;
  onToggleStatus: (item: ShopItem) => void;
  onDeleteItem: (itemId: string) => void;
  guardrailConfig: GuardrailConfig;
}

export const CatalogManagerTab: React.FC<CatalogManagerTabProps> = ({
  items,
  onAddItem,
  onEditItem,
  onToggleStatus,
  onDeleteItem,
}) => {
  const [filters, setFilters] = useState<ShopFilterState>({
    searchQuery: '',
    category: 'ALL',
    currency: 'ALL',
    status: 'ALL',
    sortBy: 'revenue',
  });

  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(items[0] || null);

  // Filter items
  const filteredItems = useMemo(() => {
    return filterShopItems(items, filters);
  }, [items, filters]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start select-none">
      {/* CỘT TRÁI: BẢNG QUẢN LÝ DANH MỤC SẢN PHẨM (FLEX-1) */}
      <div className="flex-1 w-full bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col space-y-4">
        {/* Top Action Bar: Search, Filters & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-2.5 text-text-muted"
              />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Tìm kiếm theo tên vật phẩm, mã SKU..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface-subtle focus:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-text font-medium"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value as any,
                }))
              }
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Tất cả phân loại</option>
              <option value="streak_saver">Lá chắn chuỗi</option>
              <option value="booster">Booster XP</option>
              <option value="avatar_frame">Khung Avatar</option>
              <option value="theme">Theme UI</option>
              <option value="deck">Bộ thẻ Deck</option>
              <option value="chest">Rương may mắn</option>
            </select>

            {/* Currency Filter */}
            <select
              value={filters.currency}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  currency: e.target.value as any,
                }))
              }
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Mọi loại tiền</option>
              <option value="coins">Coins 🟡</option>
              <option value="gems">Gems 💎</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as any,
                }))
              }
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text font-medium"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="active">Active (Đang bán)</option>
              <option value="flash_sale">Flash Sale</option>
              <option value="draft">Draft (Bản nháp)</option>
              <option value="archived">Archived (Lưu trữ)</option>
            </select>
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={onAddItem}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>Tạo Vật Phẩm Mới</span>
          </button>
        </div>

        {/* Data-Dense Table (TanStack Style) */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs text-text border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">Vật Phẩm & SKU</th>
                <th className="py-2.5 px-3">Phân Loại</th>
                <th className="py-2.5 px-3">Giá Niêm Yết</th>
                <th className="py-2.5 px-3">Trạng Thái</th>
                <th className="py-2.5 px-3 text-right">Đã Bán</th>
                <th className="py-2.5 px-3 text-right">Doanh Thu (Sink)</th>
                <th className="py-2.5 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted text-xs">
                    Không tìm thấy vật phẩm nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const price = item.discountPrice ?? item.originalPrice;
                  const hasDiscount = Boolean(item.discountPrice);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`hover:bg-surface-subtle/70 transition-all cursor-pointer ${
                        isSelected ? 'bg-primary-light/30 font-medium' : ''
                      }`}
                    >
                      {/* Name & SKU */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${item.bgColorClass || 'bg-surface'} border border-border flex items-center justify-center shadow-xs shrink-0 overflow-hidden p-0.5`}>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-lg">{item.icon}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-text truncate max-w-[200px] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.badge && (
                                <span
                                  className={`px-1 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                                    item.badge === 'HOT'
                                      ? 'bg-danger text-white'
                                      : item.badge === 'LIMITED'
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-primary text-white'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">{item.sku}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] font-medium text-text-muted">
                          {item.category === 'streak_saver'
                            ? 'Lá chắn chuỗi'
                            : item.category === 'booster'
                            ? 'Booster XP'
                            : item.category === 'avatar_frame'
                            ? 'Khung Avatar'
                            : item.category === 'theme'
                            ? 'Theme UI'
                            : item.category === 'deck'
                            ? 'Bộ thẻ Deck'
                            : 'Rương may mắn'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <span>{item.currency === 'coins' ? '🟡' : '💎'}</span>
                          <span
                            className={item.currency === 'coins' ? 'text-[#9A7000]' : 'text-info'}
                          >
                            {price}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-text-light line-through ml-1 font-normal">
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'flash_sale'
                              ? 'bg-amber-50 text-[#9A7000] border border-amber-200 animate-pulse'
                              : item.status === 'draft'
                              ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                              : 'bg-danger-light text-danger border border-danger/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'active'
                                ? 'bg-emerald-500'
                                : item.status === 'flash_sale'
                                ? 'bg-amber-500'
                                : item.status === 'draft'
                                ? 'bg-neutral-400'
                                : 'bg-danger'
                            }`}
                          />
                          <span>
                            {item.status === 'active'
                              ? 'Active'
                              : item.status === 'flash_sale'
                              ? 'Flash Sale'
                              : item.status === 'draft'
                              ? 'Draft'
                              : 'Archived'}
                          </span>
                        </span>
                      </td>

                      {/* Units Sold */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-text">
                        {item.unitsSold.toLocaleString('vi-VN')}
                      </td>

                      {/* Total Revenue */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono font-bold text-text">
                          {item.totalRevenue > 0
                            ? item.currency === 'coins'
                              ? `${(item.totalRevenue / 1000).toFixed(0)}k Coins`
                              : `${item.totalRevenue} Gems`
                            : '0'}
                        </div>
                        {item.sinkPercent > 0 && (
                          <div className="text-[9px] text-text-muted font-mono">
                            {item.sinkPercent}% sink
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            title="Sửa vật phẩm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditItem(item);
                            }}
                            className="p-1 rounded-md hover:bg-neutral-200 text-text-muted hover:text-text transition-all"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            title={item.status === 'active' ? 'Đổi sang bản nháp' : 'Mở bán Active'}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(item);
                            }}
                            className="p-1 rounded-md hover:bg-neutral-200 text-text-muted hover:text-primary transition-all"
                          >
                            <CheckCircle2 size={13} />
                          </button>
                          <button
                            type="button"
                            title="Lưu trữ / Ẩn vật phẩm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteItem(item.id);
                            }}
                            className="p-1 rounded-md hover:bg-danger-light text-text-muted hover:text-danger transition-all"
                          >
                            <Archive size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
          <span>
            Hiển thị <strong>{filteredItems.length}</strong> / {items.length} vật phẩm
          </span>
          <span className="font-mono text-[11px]">
            Nhấp vào hàng bất kỳ để đồng bộ mô phỏng trên Mobile Simulator
          </span>
        </div>
      </div>

      {/* CỘT PHẢI: INTERACTIVE MOBILE SHOP SIMULATOR (380PX) */}
      <MobileShopSimulator
        items={items}
        selectedItem={selectedItem}
        onSelectItem={(item) => setSelectedItem(item)}
      />
    </div>
  );
};
