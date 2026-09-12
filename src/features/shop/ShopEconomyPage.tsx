import React, { useState, useMemo } from 'react';
import {
  ShopTabNavId,
  ShopItem,
  FlashSaleCampaign,
  GuardrailConfig,
  GuardrailViolation,
  EconomyTransaction,
  LiveOpsEconomyState,
} from '../../domains/economy/types';
import {
  INITIAL_SHOP_ITEMS,
  INITIAL_FLASH_SALES,
  DEFAULT_GUARDRAIL_CONFIG,
  INITIAL_GUARDRAIL_VIOLATIONS,
  INITIAL_TRANSACTIONS,
  MOCK_ECONOMY_STATE,
} from '../../domains/economy/mock-data';
import { computeEconomyRibbonMetrics } from '../../domains/economy/selectors';
import { ShopMetricsRibbon } from './components/ShopMetricsRibbon';
import { ShopTabNav } from './components/ShopTabNav';
import { CatalogManagerTab } from './components/CatalogManagerTab';
import { PricingFlashSalesTab } from './components/PricingFlashSalesTab';
import { EconomyGuardrailsTab } from './components/EconomyGuardrailsTab';
import { TransactionLedgerTab } from './components/TransactionLedgerTab';
import { ItemFormModal } from './components/ItemFormModal';
import { AuditReasonModal } from './components/AuditReasonModal';
import {
  ShoppingBag,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface ShopEconomyPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (wordName: string) => void;
}

export const ShopEconomyPage: React.FC<ShopEconomyPageProps> = ({
  onNavigate,
  onWordChange,
}) => {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<ShopTabNavId>('catalog-manager');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Vừa cập nhật');

  // Domain States
  const [items, setItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>(INITIAL_FLASH_SALES);
  const [guardrailConfig, setGuardrailConfig] = useState<GuardrailConfig>(DEFAULT_GUARDRAIL_CONFIG);
  const [violations, setViolations] = useState<GuardrailViolation[]>(INITIAL_GUARDRAIL_VIOLATIONS);
  const [transactions, setTransactions] = useState<EconomyTransaction[]>(INITIAL_TRANSACTIONS);
  const [economyState, setEconomyState] = useState<LiveOpsEconomyState>(MOCK_ECONOMY_STATE);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

  // Audit modal state
  const [auditModalConfig, setAuditModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDangerous: boolean;
    onConfirmCallback?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    isDangerous: false,
  });

  // Success Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Ribbon Metrics
  const ribbonMetrics = useMemo(() => {
    return computeEconomyRibbonMetrics(items, economyState, campaigns, transactions);
  }, [items, economyState, campaigns, transactions]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Vừa cập nhật (thời gian thực)');
      showToast('Đã đồng bộ dữ liệu giao dịch và tỷ lệ Faucet/Sink mới nhất.');
    }, 600);
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: ShopItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (savedItem: ShopItem) => {
    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
      showToast(`Đã cập nhật vật phẩm: ${savedItem.name}`);
    } else {
      setItems((prev) => [savedItem, ...prev]);
      showToast(`Đã tạo và mở bán vật phẩm mới: ${savedItem.name}`);
    }
  };

  const handleToggleItemStatus = (item: ShopItem) => {
    const nextStatus = item.status === 'active' ? 'draft' : 'active';
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );
    showToast(
      nextStatus === 'active'
        ? `Đã mở bán lại: ${item.name}`
        : `Đã chuyển sang bản nháp: ${item.name}`
    );
  };

  const handleDeleteItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setAuditModalConfig({
      isOpen: true,
      title: `Lưu Trữ Vật Phẩm: ${item.name}`,
      description: `Hành động này sẽ ẩn vật phẩm khỏi Cửa hàng trên Mobile. Người học đã mua vật phẩm này trước đó vẫn giữ quyền sử dụng trong Inventory.`,
      isDangerous: true,
      onConfirmCallback: () => {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, status: 'archived' } : i))
        );
        showToast(`Đã lưu trữ vật phẩm: ${item.name}`);
      },
    });
  };

  const handleCreateCampaign = (newCamp: FlashSaleCampaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);

    // Apply discount price to affected items
    setItems((prev) =>
      prev.map((item) => {
        if (newCamp.itemIds.includes(item.id)) {
          const discount = Math.round(
            item.originalPrice * (1 - newCamp.discountPercent / 100)
          );
          return {
            ...item,
            discountPrice: discount,
            status: 'flash_sale',
          };
        }
        return item;
      })
    );

    showToast(`Đã kích hoạt chiến dịch Flash Sale: ${newCamp.name}`);
  };

  const handleEndCampaign = (campaignId: string) => {
    const targetCamp = campaigns.find((c) => c.id === campaignId);
    if (!targetCamp) return;

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'ended' } : c))
    );

    // Remove discount from items
    setItems((prev) =>
      prev.map((item) => {
        if (targetCamp.itemIds.includes(item.id)) {
          return {
            ...item,
            discountPrice: undefined,
            status: 'active',
          };
        }
        return item;
      })
    );

    showToast(`Đã kết thúc chiến dịch: ${targetCamp.name}`);
  };

  const handleRequestAudit = (
    title: string,
    description: string,
    isDangerous: boolean,
    onConfirm: () => void
  ) => {
    setAuditModalConfig({
      isOpen: true,
      title,
      description,
      isDangerous,
      onConfirmCallback: onConfirm,
    });
  };

  const handleAuditConfirm = (reason: string, operator: string) => {
    if (auditModalConfig.onConfirmCallback) {
      auditModalConfig.onConfirmCallback();
    }
    showToast(`Đã lưu vết kiểm toán: "${reason}" bởi ${operator}`);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4 select-none">
      <div className="space-y-4 max-w-[1680px] mx-auto pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-modal text-xs font-semibold flex items-center gap-2 animate-slide-up border border-neutral-700">
            <CheckCircle2 size={16} className="text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-reward-light text-[#9A7000] border border-reward/30 flex items-center justify-center shadow-xs">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text tracking-tight">
                Cửa Hàng & Kinh Tế Ảo (Shop & Virtual Economy)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-reward-light text-[#9A7000] text-[10px] font-bold border border-reward/40">
                25% LiveOps
              </span>
              {guardrailConfig.emergencyShopMaintenance && (
                <span className="px-2 py-0.5 rounded-full bg-danger-light text-danger text-[10px] font-bold border border-danger/30 animate-pulse">
                  SHOP ĐANG BẢO TRÌ
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              Quản lý danh mục vật phẩm, chiến dịch Flash Sale, điều hòa dòng tiền Faucet/Sink và kiểm soát trần Guardrails.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCw size={13} className={isRefreshing ? 'animate-spin text-primary' : ''} />
            <span>{isRefreshing ? 'Đang cập nhật...' : 'Đồng Bộ'}</span>
          </button>
          <span className="text-[11px] text-text-muted font-mono hidden md:inline">
            {lastUpdated}
          </span>
        </div>
      </div>

      {/* TẦNG 1: HIGH-DENSITY METRICS RIBBON (6 Chỉ số) */}
      <ShopMetricsRibbon metrics={ribbonMetrics} />

      {/* TẦNG 2 & 3: TABS & KHÔNG GIAN LÀM VIỆC */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <ShopTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeItemsCount={ribbonMetrics.activeItemsCount}
          activeFlashSalesCount={ribbonMetrics.flashSaleItemsCount}
          guardrailViolationsCount={ribbonMetrics.guardrailsViolations}
        />

        <div className="p-4 bg-background">
          {/* TAB 1: Danh Mục Vật Phẩm & Simulator */}
          {activeTab === 'catalog-manager' && (
            <CatalogManagerTab
              items={items}
              onAddItem={handleOpenAddItem}
              onEditItem={handleOpenEditItem}
              onToggleStatus={handleToggleItemStatus}
              onDeleteItem={handleDeleteItem}
              guardrailConfig={guardrailConfig}
            />
          )}

          {/* TAB 2: Định Giá & Flash Sale */}
          {activeTab === 'pricing-flashsales' && (
            <PricingFlashSalesTab
              campaigns={campaigns}
              items={items}
              onCreateCampaign={handleCreateCampaign}
              onEndCampaign={handleEndCampaign}
            />
          )}

          {/* TAB 3: Hàng Rào Guardrails & Sức Khỏe */}
          {activeTab === 'economy-guardrails' && (
            <EconomyGuardrailsTab
              config={guardrailConfig}
              violations={violations}
              onUpdateConfig={(newCfg) => {
                setGuardrailConfig(newCfg);
                showToast('Đã lưu tham số cấu hình Guardrails an toàn.');
              }}
              onRequestAuditAction={handleRequestAudit}
            />
          )}

          {/* TAB 4: Sổ Cái Giao Dịch & Audit */}
          {activeTab === 'transaction-ledger' && (
            <TransactionLedgerTab transactions={transactions} />
          )}
        </div>
      </div>

      {/* Item Form Modal */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        guardrailConfig={guardrailConfig}
      />

        {/* Audit Reason Modal */}
        <AuditReasonModal
          isOpen={auditModalConfig.isOpen}
          onClose={() => setAuditModalConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleAuditConfirm}
          title={auditModalConfig.title}
          description={auditModalConfig.description}
          isDangerous={auditModalConfig.isDangerous}
        />
      </div>
    </div>
  );
};
