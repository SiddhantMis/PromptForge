import type { Prompt } from './prompt.types.ts';
import type { User } from './user.types.ts';

/**
 * Marketplace listing for a premium prompt
 */
export interface MarketplaceListing {
  id: string;
  promptId: string;
  prompt: Prompt;
  sellerId: string;
  seller: User;
  price: number;
  currency: string;
  salesCount: number;
  revenue: number;
  isActive: boolean;
  listedAt: string;
  updatedAt: string;
}

/**
 * Transaction record for a purchase
 */
export interface Transaction {
  id: string;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  promptId: string;
  prompt: Prompt;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionDate: string;
  completedAt?: string;
}

/**
 * Purchase request payload
 */
export interface PurchaseRequest {
  promptId: string;
  paymentMethod: 'credit_card' | 'paypal' | 'wallet';
}

/**
 * Purchase response
 */
export interface PurchaseResponse {
  transaction: Transaction;
  message: string;
}

/**
 * User's wallet/balance information
 */
export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  totalEarnings: number;
  totalSpent: number;
  lastUpdated: string;
}

/**
 * Earnings summary for sellers
 */
export interface EarningsSummary {
  totalRevenue: number;
  totalSales: number;
  averageSalePrice: number;
  pendingEarnings: number;
  availableBalance: number;
  recentTransactions: Transaction[];
  topSellingPrompts: Array<{
    prompt: Prompt;
    salesCount: number;
    revenue: number;
  }>;
}

/**
 * Filters for marketplace browse
 */
export interface MarketplaceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popular' | 'price-low' | 'price-high' | 'top-rated';
  search?: string;
}

/**
 * Paginated marketplace response
 */
export interface MarketplaceResponse {
  listings: MarketplaceListing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

