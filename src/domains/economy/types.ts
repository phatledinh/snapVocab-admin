export interface CurrencyFlow {
  faucet: number; // Tiền phát hành (Earned qua bài học, streak, missions)
  sink: number;   // Tiền tiêu thụ (Shop, Streak Freeze, Chests)
}

export interface LiveOpsEconomyState {
  coins: CurrencyFlow;
  gems: CurrencyFlow;
  guardrails: {
    maxCoinsCapPerQuest: number;
    maxGemsCapPerQuest: number;
    violationsDetected: number;
    status: 'healthy' | 'warning' | 'breached';
  };
  streakMetrics: {
    avgStreakDays: number;
    activeStreakLearners: number;
    streaksOver7Days: number;
    streaksOver30Days: number;
    pendingRecoveryRequests: number;
  };
}

// ----------------------------------------------------
// SHOP & ECONOMY EXTENDED DOMAIN CONTRACTS
// ----------------------------------------------------

export type ShopItemCategory =
  | 'theme'
  | 'avatar_frame'
  | 'booster'
  | 'streak_saver'
  | 'chest'
  | 'deck';

export type ShopCurrency = 'coins' | 'gems';

export type ShopItemStatus = 'active' | 'draft' | 'flash_sale' | 'archived';

export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ShopItemBadge = 'HOT' | 'NEW' | 'LIMITED' | 'BEST_VALUE';

export interface ShopItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  currency: ShopCurrency;
  originalPrice: number;
  discountPrice?: number;
  rarity: ShopItemRarity;
  badge?: ShopItemBadge;
  icon: string; // Emoji or asset identifier
  imageUrl?: string; // Đường dẫn ảnh thực tế (vd: /images/shop/icon1_clean.png)
  bgColorClass?: string; // Màu nền thẻ card trên mobile (vd: bg-amber-50)
  previewAsset?: string; // Image or CSS theme preview token
  status: ShopItemStatus;
  stock?: number; // undefined = unlimited
  purchaseLimitPerUser?: number;
  unitsSold: number;
  totalRevenue: number;
  sinkPercent: number; // Tỷ trọng tiêu thụ trong tổng sink
  createdDate: string;
  lastUpdated: string;
}

export type FlashSaleStatus = 'active' | 'scheduled' | 'ended';

export interface FlashSaleCampaign {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: FlashSaleStatus;
  itemIds: string[];
  purchaseLimitPerUser: number;
  unitsSold: number;
  revenueLift: number; // Coins/Gems hút về thêm nhờ chiến dịch
}

export interface GuardrailConfig {
  maxCoinsCapPerQuest: number; // Mặc định 1000 Coins
  maxGemsCapPerQuest: number;  // Mặc định 100 Gems
  maxItemPriceCoins: number;   // Mặc định 5000 Coins
  maxItemPriceGems: number;    // Mặc định 500 Gems
  minItemPriceFloor: number;   // Mặc định 10 Coins
  dailyEarningCapCoins: number;// Mặc định 2500 Coins/day/learner
  inflationWarningThreshold: number; // Mặc định 1.35x Faucet/Sink
  emergencyShopMaintenance: boolean; // Kill switch: Đóng băng Shop
  lockStreakSaverSales: boolean;     // Khóa riêng bán Streak Freeze
}

export interface GuardrailViolation {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  type: 'PRICE_CEILING' | 'REWARD_CAP' | 'DAILY_EARN_SPIKE' | 'ANOMALOUS_PURCHASE';
  description: string;
  targetId: string;
  targetName: string;
  status: 'active' | 'mitigated' | 'whitelisted';
  mitigatedBy?: string;
  reason?: string;
}

export type TransactionFlowType = 'FAUCET_EARN' | 'SINK_SPEND';

export type TransactionSource =
  | 'SHOP_PURCHASE'
  | 'MISSION_REWARD'
  | 'STREAK_BONUS'
  | 'CHEST_REWARD'
  | 'ADMIN_ADJUSTMENT'
  | 'STREAK_FREEZE_REDEEM';

export interface EconomyTransaction {
  id: string;
  timestamp: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  type: TransactionFlowType;
  currency: ShopCurrency;
  amount: number;
  source: TransactionSource;
  itemId?: string;
  itemOrQuestName: string;
  balanceBefore: number;
  balanceAfter: number;
  status: 'COMPLETED' | 'FLAGGED' | 'REVERSED';
  deviceInfo?: string;
  clientVersion?: string;
  note?: string;
}

export type ShopTabNavId =
  | 'catalog-manager'
  | 'pricing-flashsales'
  | 'economy-guardrails'
  | 'transaction-ledger';

export interface ShopEconomyRibbonMetrics {
  totalSinkCoins: number;
  totalSinkGems: number;
  faucetSinkRatio: number;
  faucetSinkStatus: 'healthy' | 'warning' | 'breached';
  activeItemsCount: number;
  draftItemsCount: number;
  flashSaleItemsCount: number;
  topSinkItemName: string;
  topSinkItemVolume: number;
  guardrailsStatus: 'healthy' | 'warning' | 'breached';
  guardrailsViolations: number;
  totalTransactions24h: number;
  transactionSuccessRate: number;
}

export interface ShopFilterState {
  searchQuery: string;
  category: 'ALL' | ShopItemCategory;
  currency: 'ALL' | ShopCurrency;
  status: 'ALL' | ShopItemStatus;
  sortBy: 'revenue' | 'price' | 'unitsSold' | 'name' | 'newest';
}

export type SimulatorViewMode = 'shop-screen' | 'inventory-screen';
