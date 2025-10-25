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
import { mockPrompts } from './prompt.mock.ts';

// Mock delay to simulate network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock wallet data
let mockWallet: Wallet = {
  userId: '1',
  balance: 125.50,
  currency: 'USD',
  totalEarnings: 450.00,
  totalSpent: 324.50,
  lastUpdated: new Date().toISOString(),
};

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    buyerId: '1',
    buyer: { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    sellerId: '2',
    seller: { id: '2', username: 'aiexpert', email: 'expert@example.com', firstName: 'AI', lastName: 'Expert' },
    promptId: 'prompt-1',
    prompt: mockPrompts[0],
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-2',
    buyerId: '1',
    buyer: { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    sellerId: '3',
    seller: { id: '3', username: 'promptmaster', email: 'master@example.com', firstName: 'Prompt', lastName: 'Master' },
    promptId: 'prompt-3',
    prompt: mockPrompts[2],
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'paypal',
    transactionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Generate mock marketplace listings from premium prompts
const generateMockListings = (): MarketplaceListing[] => {
  return mockPrompts
    .filter(p => p.isPremium)
    .map((prompt, _index) => ({
      id: `listing-${prompt.id}`,
      promptId: prompt.id,
      prompt,
      sellerId: prompt.authorId,
      seller: {
        id: prompt.authorId,
        username: prompt.authorName.toLowerCase().replace(' ', ''),
        email: `${prompt.authorName.toLowerCase().replace(' ', '')}@example.com`,
        firstName: prompt.authorName.split(' ')[0],
        lastName: prompt.authorName.split(' ')[1] || '',
      },
      price: prompt.price || 29.99,
      currency: 'USD',
      salesCount: Math.floor(Math.random() * 100) + 10,
      revenue: (prompt.price || 29.99) * (Math.floor(Math.random() * 100) + 10),
      isActive: true,
      listedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
};

let mockListings = generateMockListings();

/**
 * Get marketplace listings (mock)
 */
export const getMarketplaceListings = async (
  filters: MarketplaceFilters = {},
  page: number = 1,
  pageSize: number = 12
): Promise<MarketplaceResponse> => {
  await delay(500);

  let filtered = [...mockListings];

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(l => l.prompt.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(l => l.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(l => l.price <= filters.maxPrice!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      l =>
        l.prompt.title.toLowerCase().includes(searchLower) ||
        l.prompt.description.toLowerCase().includes(searchLower) ||
        l.prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      filtered.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'top-rated':
      filtered.sort((a, b) => b.prompt.averageRating - a.prompt.averageRating);
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
      break;
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedListings = filtered.slice(start, end);

  return {
    listings: paginatedListings,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

/**
 * Get single marketplace listing (mock)
 */
export const getMarketplaceListing = async (listingId: string): Promise<MarketplaceListing> => {
  await delay(300);
  const listing = mockListings.find(l => l.id === listingId);
  if (!listing) {
    throw new Error('Listing not found');
  }
  return listing;
};

/**
 * Purchase a prompt (mock)
 */
export const purchasePrompt = async (request: PurchaseRequest): Promise<PurchaseResponse> => {
  await delay(800);

  const listing = mockListings.find(l => l.promptId === request.promptId);
  if (!listing) {
    throw new Error('Prompt not found in marketplace');
  }

  // Check if user has enough balance for wallet payment
  if (request.paymentMethod === 'wallet' && mockWallet.balance < listing.price) {
    throw new Error('Insufficient balance');
  }

  // Create transaction
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    buyerId: '1',
    buyer: { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    sellerId: listing.sellerId,
    seller: listing.seller,
    promptId: listing.promptId,
    prompt: listing.prompt,
    amount: listing.price,
    currency: 'USD',
    status: 'completed',
    paymentMethod: request.paymentMethod,
    transactionDate: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  // Update wallet
  if (request.paymentMethod === 'wallet') {
    mockWallet.balance -= listing.price;
    mockWallet.totalSpent += listing.price;
  }

  // Update listing stats
  listing.salesCount += 1;
  listing.revenue += listing.price;

  // Add to transactions
  mockTransactions.unshift(transaction);

  return {
    transaction,
    message: 'Purchase completed successfully!',
  };
};

/**
 * Get transactions (mock)
 */
export const getTransactions = async (
  page: number = 1,
  pageSize: number = 20
): Promise<{ transactions: Transaction[]; total: number }> => {
  await delay(400);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    transactions: mockTransactions.slice(start, end),
    total: mockTransactions.length,
  };
};

/**
 * Get wallet (mock)
 */
export const getWallet = async (): Promise<Wallet> => {
  await delay(300);
  return { ...mockWallet };
};

/**
 * Get earnings summary (mock)
 */
export const getEarningsSummary = async (): Promise<EarningsSummary> => {
  await delay(500);

  const userListings = mockListings.filter(l => l.sellerId === '1');
  const totalRevenue = userListings.reduce((sum, l) => sum + l.revenue, 0);
  const totalSales = userListings.reduce((sum, l) => sum + l.salesCount, 0);

  return {
    totalRevenue,
    totalSales,
    averageSalePrice: totalSales > 0 ? totalRevenue / totalSales : 0,
    pendingEarnings: totalRevenue * 0.1, // 10% pending
    availableBalance: mockWallet.balance,
    recentTransactions: mockTransactions.filter(t => t.sellerId === '1').slice(0, 5),
    topSellingPrompts: userListings
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map(l => ({
        prompt: l.prompt,
        salesCount: l.salesCount,
        revenue: l.revenue,
      })),
  };
};

/**
 * List prompt for sale (mock)
 */
export const listPromptForSale = async (data: {
  promptId: string;
  price: number;
}): Promise<MarketplaceListing> => {
  await delay(500);

  const prompt = mockPrompts.find(p => p.id === data.promptId);
  if (!prompt) {
    throw new Error('Prompt not found');
  }

  const newListing: MarketplaceListing = {
    id: `listing-${Date.now()}`,
    promptId: data.promptId,
    prompt: { ...prompt, isPremium: true, price: data.price },
    sellerId: '1',
    seller: { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    price: data.price,
    currency: 'USD',
    salesCount: 0,
    revenue: 0,
    isActive: true,
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockListings.unshift(newListing);
  return newListing;
};

/**
 * Update marketplace listing (mock)
 */
export const updateMarketplaceListing = async (
  listingId: string,
  data: { price?: number; isActive?: boolean }
): Promise<MarketplaceListing> => {
  await delay(400);

  const listing = mockListings.find(l => l.id === listingId);
  if (!listing) {
    throw new Error('Listing not found');
  }

  if (data.price !== undefined) {
    listing.price = data.price;
    listing.prompt.price = data.price;
  }
  if (data.isActive !== undefined) {
    listing.isActive = data.isActive;
  }

  listing.updatedAt = new Date().toISOString();
  return listing;
};

/**
 * Delete marketplace listing (mock)
 */
export const deleteMarketplaceListing = async (listingId: string): Promise<void> => {
  await delay(400);
  mockListings = mockListings.filter(l => l.id !== listingId);
};

