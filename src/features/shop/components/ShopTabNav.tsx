import React from 'react';
import { ShopTabNavId } from '../../../domains/economy/types';
import { ShoppingBag, Zap, ShieldAlert, Receipt } from 'lucide-react';

interface ShopTabNavProps {
  activeTab: ShopTabNavId;
  onTabChange: (tab: ShopTabNavId) => void;
  activeItemsCount: number;
  activeFlashSalesCount: number;
  guardrailViolationsCount: number;
}

export const ShopTabNav: React.FC<ShopTabNavProps> = ({
  activeTab,
  onTabChange,
  activeItemsCount,
  activeFlashSalesCount,
  guardrailViolationsCount,
}) => {
  const tabs = [
    {
      id: 'catalog-manager' as ShopTabNavId,
      label: 'Danh Mục Vật Phẩm & Simulator',
      icon: <ShoppingBag size={15} />,
      badge: activeItemsCount,
      badgeColor: 'bg-primary-light text-primary font-bold',
    },
    {
      id: 'pricing-flashsales' as ShopTabNavId,
      label: 'Định Giá & Flash Sale',
      icon: <Zap size={15} />,
      badge: activeFlashSalesCount > 0 ? `${activeFlashSalesCount} LIVE` : undefined,
      badgeColor: 'bg-amber-100 text-[#9A7000] font-bold animate-pulse',
    },
    {
      id: 'economy-guardrails' as ShopTabNavId,
      label: 'Hàng Rào Guardrails & Sức Khỏe',
      icon: <ShieldAlert size={15} />,
      badge: guardrailViolationsCount > 0 ? `${guardrailViolationsCount} Alert` : 'OK',
      badgeColor:
        guardrailViolationsCount > 0
          ? 'bg-danger-light text-danger font-bold'
          : 'bg-emerald-100 text-emerald-700 font-medium',
    },
    {
      id: 'transaction-ledger' as ShopTabNavId,
      label: 'Sổ Cái Giao Dịch & Audit Trail',
      icon: <Receipt size={15} />,
      badge: 'Live Stream',
      badgeColor: 'bg-info-light text-info font-medium',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 pt-2 select-none overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-primary text-text bg-background/50'
                : 'border-transparent text-text-muted hover:text-text hover:bg-surface-subtle'
            }`}
          >
            <span className={isActive ? 'text-primary' : 'text-text-muted'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
