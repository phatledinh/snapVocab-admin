import {
  ShopItem,
  LiveOpsEconomyState,
  FlashSaleCampaign,
  EconomyTransaction,
  ShopEconomyRibbonMetrics,
  ShopFilterState,
  GuardrailConfig,
} from './types';

/**
 * Tính toán 6 chỉ số vận hành trên High-Density Ribbon
 */
export function computeEconomyRibbonMetrics(
  items: ShopItem[],
  economyState: LiveOpsEconomyState,
  campaigns: FlashSaleCampaign[],
  transactions: EconomyTransaction[]
): ShopEconomyRibbonMetrics {
  // 1. Tổng sink
  const totalSinkCoins = economyState.coins.sink;
  const totalSinkGems = economyState.gems.sink;

  // 2. Faucet vs Sink ratio (Coins)
  const faucetSinkRatio =
    totalSinkCoins > 0 ? economyState.coins.faucet / totalSinkCoins : 1.0;
  
  let faucetSinkStatus: 'healthy' | 'warning' | 'breached' = 'healthy';
  if (faucetSinkRatio > 1.35) {
    faucetSinkStatus = 'warning';
  }
  if (faucetSinkRatio > 1.6) {
    faucetSinkStatus = 'breached';
  }

  // 3. Số lượng mặt hàng theo trạng thái
  const activeItemsCount = items.filter((i) => i.status === 'active').length;
  const draftItemsCount = items.filter((i) => i.status === 'draft').length;
  const flashSaleItemsCount = items.filter((i) => i.status === 'flash_sale').length;

  // 4. Mặt hàng bán chạy nhất (Top Sink Item)
  let topItem = items[0];
  for (const item of items) {
    if (item.unitsSold > (topItem?.unitsSold || 0)) {
      topItem = item;
    }
  }

  // 5. Trạng thái Guardrails
  const guardrailsStatus = economyState.guardrails.status;
  const guardrailsViolations = economyState.guardrails.violationsDetected;

  // 6. Giao dịch 24h & Tỷ lệ thành công
  const totalTransactions24h = transactions.length;
  const successfulTx = transactions.filter((t) => t.status === 'COMPLETED').length;
  const transactionSuccessRate =
    totalTransactions24h > 0
      ? (successfulTx / totalTransactions24h) * 100
      : 100;

  return {
    totalSinkCoins,
    totalSinkGems,
    faucetSinkRatio,
    faucetSinkStatus,
    activeItemsCount,
    draftItemsCount,
    flashSaleItemsCount,
    topSinkItemName: topItem?.name || 'Streak Freeze Shield',
    topSinkItemVolume: topItem?.totalRevenue || 428000,
    guardrailsStatus,
    guardrailsViolations,
    totalTransactions24h: 2410, // Simulated 24h scale
    transactionSuccessRate,
  };
}

/**
 * Lọc và sắp xếp danh sách vật phẩm Shop
 */
export function filterShopItems(
  items: ShopItem[],
  filter: ShopFilterState
): ShopItem[] {
  return items
    .filter((item) => {
      // 1. Tìm kiếm theo tên hoặc SKU
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesDesc) {
          return false;
        }
      }

      // 2. Lọc danh mục (Category)
      if (filter.category !== 'ALL' && item.category !== filter.category) {
        return false;
      }

      // 3. Lọc loại tiền tệ (Currency)
      if (filter.currency !== 'ALL' && item.currency !== filter.currency) {
        return false;
      }

      // 4. Lọc trạng thái (Status)
      if (filter.status !== 'ALL' && item.status !== filter.status) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filter.sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'unitsSold':
          return b.unitsSold - a.unitsSold;
        case 'price': {
          const priceA = a.discountPrice ?? a.originalPrice;
          const priceB = b.discountPrice ?? b.originalPrice;
          return priceB - priceA;
        }
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });
}

/**
 * Kiểm tra giá niêm yết theo chính sách Guardrails
 */
export function validateItemGuardrails(
  price: number,
  currency: 'coins' | 'gems',
  config: GuardrailConfig
): {
  isValid: boolean;
  isWarning: boolean;
  message?: string;
} {
  if (price <= 0) {
    return {
      isValid: false,
      isWarning: false,
      message: 'Giá niêm yết phải lớn hơn 0 (tránh lỗi khai thác 0-coin).',
    };
  }

  if (currency === 'coins') {
    if (price < config.minItemPriceFloor) {
      return {
        isValid: false,
        isWarning: false,
        message: `Giá niêm yết không được thấp hơn giá sàn ${config.minItemPriceFloor} Coins.`,
      };
    }
    if (price > config.maxItemPriceCoins) {
      return {
        isValid: false,
        isWarning: true,
        message: `Giá niêm yết ${price} Coins vượt trần an toàn ${config.maxItemPriceCoins} Coins. Cần phê duyệt đặc biệt.`,
      };
    }
  } else {
    if (price > config.maxItemPriceGems) {
      return {
        isValid: false,
        isWarning: true,
        message: `Giá niêm yết ${price} Gems vượt trần an toàn ${config.maxItemPriceGems} Gems. Cần phê duyệt đặc biệt.`,
      };
    }
  }

  return { isValid: true, isWarning: false };
}
