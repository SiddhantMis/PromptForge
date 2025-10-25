import type { User } from './user.types.ts';
import type { Prompt } from './prompt.types.ts';

/**
 * Review for a prompt
 */
export interface Review {
  id: string;
  promptId: string;
  userId: string;
  user: User;
  rating: number; // 1-5
  title: string;
  content: string;
  helpful: number;
  notHelpful: number;
  userFoundHelpful?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create review request
 */
export interface CreateReviewRequest {
  promptId: string;
  rating: number;
  title: string;
  content: string;
}

/**
 * Reviews response
 */
export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Coupon/discount code
 */
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

/**
 * Coupon validation result
 */
export interface CouponValidation {
  isValid: boolean;
  coupon?: Coupon;
  discount: number;
  finalPrice: number;
  message?: string;
}

/**
 * Subscription plan
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  promptAccessLimit: number; // -1 for unlimited
  discountPercentage: number;
  isPopular: boolean;
}

/**
 * User subscription
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

/**
 * Affiliate link
 */
export interface AffiliateLink {
  id: string;
  userId: string;
  promptId?: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}

/**
 * Affiliate statistics
 */
export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  topPerformingLinks: AffiliateLink[];
}

/**
 * Featured prompt
 */
export interface FeaturedPrompt {
  id: string;
  promptId: string;
  prompt: Prompt;
  priority: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

