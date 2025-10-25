import type {
  Review,
  CreateReviewRequest,
  ReviewsResponse,
  CouponValidation,
  SubscriptionPlan,
  UserSubscription,
  AffiliateLink,
  AffiliateStats,
  FeaturedPrompt,
} from '@/types/advanced-marketplace.types.ts';
import { mockPrompts } from './prompt.mock.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Reviews
let mockReviews: Review[] = [
  {
    id: 'r1',
    promptId: 'prompt-1',
    userId: '2',
    user: { id: '2', username: 'aiexpert', email: 'expert@example.com', firstName: 'AI', lastName: 'Expert' },
    rating: 5,
    title: 'Excellent prompt!',
    content: 'This prompt works perfectly for my use case. Highly recommended!',
    helpful: 12,
    notHelpful: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Subscriptions
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    description: 'Perfect for individuals',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['Access to 10 premium prompts/month', 'Basic support', 'Community access'],
    promptAccessLimit: 10,
    discountPercentage: 10,
    isPopular: false,
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    description: 'Best for professionals',
    price: 29.99,
    billingCycle: 'monthly',
    features: ['Unlimited premium prompts', 'Priority support', 'AI Lab access', 'No marketplace fees'],
    promptAccessLimit: -1,
    discountPercentage: 20,
    isPopular: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'For teams and businesses',
    price: 99.99,
    billingCycle: 'monthly',
    features: ['Everything in Pro', 'Team collaboration', 'Custom prompts', 'Dedicated support', 'API access'],
    promptAccessLimit: -1,
    discountPercentage: 30,
    isPopular: false,
  },
];

// Mock Affiliate Links
let mockAffiliateLinks: AffiliateLink[] = [];

// Reviews
export const getPromptReviews = async (promptId: string): Promise<ReviewsResponse> => {
  await delay(400);
  const reviews = mockReviews.filter(r => r.promptId === promptId);
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => distribution[r.rating as keyof typeof distribution]++);
  
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    averageRating: avgRating,
    totalReviews: reviews.length,
    ratingDistribution: distribution,
  };
};

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  await delay(500);
  const newReview: Review = {
    id: `r${Date.now()}`,
    promptId: data.promptId,
    userId: '1',
    user: { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
    rating: data.rating,
    title: data.title,
    content: data.content,
    helpful: 0,
    notHelpful: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockReviews.unshift(newReview);
  return newReview;
};

export const markReviewHelpful = async (reviewId: string, helpful: boolean): Promise<void> => {
  await delay(200);
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) {
    if (helpful) review.helpful++;
    else review.notHelpful++;
  }
};

// Coupons
export const validateCoupon = async (code: string, _promptId: string): Promise<CouponValidation> => {
  await delay(400);
  
  const coupons = {
    'SAVE10': { discountType: 'percentage' as const, value: 10 },
    'SAVE20': { discountType: 'percentage' as const, value: 20 },
    'FIRST5': { discountType: 'fixed' as const, value: 5 },
  };

  const coupon = coupons[code as keyof typeof coupons];
  if (!coupon) {
    return { isValid: false, discount: 0, finalPrice: 29.99, message: 'Invalid coupon code' };
  }

  const originalPrice = 29.99;
  const discount = coupon.discountType === 'percentage'
    ? originalPrice * (coupon.value / 100)
    : coupon.value;

  return {
    isValid: true,
    discount,
    finalPrice: Math.max(0, originalPrice - discount),
    message: 'Coupon applied successfully!',
  };
};

// Subscriptions
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  await delay(300);
  return mockPlans;
};

export const subscribe = async (planId: string): Promise<UserSubscription> => {
  await delay(800);
  const plan = mockPlans.find(p => p.id === planId);
  if (!plan) throw new Error('Plan not found');

  return {
    id: `sub-${Date.now()}`,
    userId: '1',
    planId,
    plan,
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
  };
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  await delay(300);
  return null; // No active subscription
};

export const cancelSubscription = async (_subscriptionId: string): Promise<void> => {
  await delay(400);
};

// Affiliates
export const generateAffiliateLink = async (promptId?: string): Promise<AffiliateLink> => {
  await delay(500);
  const code = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const newLink: AffiliateLink = {
    id: `aff-${Date.now()}`,
    userId: '1',
    promptId,
    code,
    url: `https://promptforge.com/ref/${code}${promptId ? `?prompt=${promptId}` : ''}`,
    clicks: 0,
    conversions: 0,
    earnings: 0,
    createdAt: new Date().toISOString(),
  };
  mockAffiliateLinks.push(newLink);
  return newLink;
};

export const getAffiliateStats = async (): Promise<AffiliateStats> => {
  await delay(400);
  const totalClicks = mockAffiliateLinks.reduce((sum, l) => sum + l.clicks, 0);
  const totalConversions = mockAffiliateLinks.reduce((sum, l) => sum + l.conversions, 0);
  
  return {
    totalClicks,
    totalConversions,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    totalEarnings: mockAffiliateLinks.reduce((sum, l) => sum + l.earnings, 0),
    pendingEarnings: 50.00,
    topPerformingLinks: mockAffiliateLinks.sort((a, b) => b.earnings - a.earnings).slice(0, 5),
  };
};

export const getAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  await delay(300);
  return mockAffiliateLinks;
};

// Featured
export const getFeaturedPrompts = async (): Promise<FeaturedPrompt[]> => {
  await delay(400);
  return mockPrompts.slice(0, 3).map((prompt, i) => ({
    id: `feat-${i}`,
    promptId: prompt.id,
    prompt,
    priority: i + 1,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  }));
};

