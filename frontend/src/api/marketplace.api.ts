import { marketplaceServiceClient } from './client.ts';
import type {
  MarketplaceListing,
  MarketplaceFilters,
  MarketplaceResponse,
  PurchaseRequest,
  PurchaseResponse,
  Transaction,
  Wallet,
  EarningsSummary,
} from '@/types/marketplace.types.ts';

/**
 * Get marketplace listings (premium prompts for sale)
 */
export const getMarketplaceListings = async (
  filters: MarketplaceFilters = {},
  page: number = 1,
  pageSize: number = 12
): Promise<MarketplaceListing[]> => {
  const response = await marketplaceServiceClient.get<MarketplaceListing[]>('/api/marketplace/listings');
  return response.data;
};

/**
 * Get a single marketplace listing by ID
 */
export const getMarketplaceListing = async (listingId: string): Promise<MarketplaceListing> => {
  const response = await marketplaceServiceClient.get<MarketplaceListing>(`/api/marketplace/listings/${listingId}`);
  return response.data;
};

/**
 * Get listings by seller
 */
export const getSellerListings = async (sellerId: string): Promise<MarketplaceListing[]> => {
  const response = await marketplaceServiceClient.get<MarketplaceListing[]>(`/api/marketplace/listings/seller/${sellerId}`);
  return response.data;
};

/**
 * Purchase a prompt from the marketplace
 */
export const purchasePrompt = async (request: PurchaseRequest): Promise<Transaction> => {
  const response = await marketplaceServiceClient.post<Transaction>('/api/marketplace/purchase', request);
  return response.data;
};

/**
 * Get user's transaction history (as buyer)
 */
export const getBuyerTransactions = async (userId: string): Promise<Transaction[]> => {
  const response = await marketplaceServiceClient.get<Transaction[]>(`/api/marketplace/transactions/buyer/${userId}`);
  return response.data;
};

/**
 * Get user's transaction history (as seller)
 */
export const getSellerTransactions = async (userId: string): Promise<Transaction[]> => {
  const response = await marketplaceServiceClient.get<Transaction[]>(`/api/marketplace/transactions/seller/${userId}`);
  return response.data;
};

/**
 * Get seller's revenue summary
 */
export const getSellerRevenue = async (sellerId: string): Promise<{
  totalRevenue: number;
  totalSales: number;
}> => {
  const response = await marketplaceServiceClient.get<{
    totalRevenue: number;
    totalSales: number;
  }>(`/api/marketplace/revenue/${sellerId}`);
  return response.data;
};

/**
 * List a prompt for sale (create marketplace listing)
 */
export const listPromptForSale = async (data: {
  promptId: string;
  price: number;
  description?: string;
}): Promise<MarketplaceListing> => {
  const response = await marketplaceServiceClient.post<MarketplaceListing>('/api/marketplace/listings', data);
  return response.data;
};

