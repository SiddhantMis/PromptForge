import { apiClient } from './client.ts';
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

// Reviews
export const getPromptReviews = async (promptId: string): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ReviewsResponse>(`/prompts/${promptId}/reviews`);
  return response.data;
};

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await apiClient.post<Review>('/marketplace/reviews', data);
  return response.data;
};

export const markReviewHelpful = async (reviewId: string, helpful: boolean): Promise<void> => {
  await apiClient.post(`/marketplace/reviews/${reviewId}/${helpful ? 'helpful' : 'not-helpful'}`);
};

// Coupons
export const validateCoupon = async (code: string, promptId: string): Promise<CouponValidation> => {
  const response = await apiClient.post<CouponValidation>('/marketplace/coupons/validate', {
    code,
    promptId,
  });
  return response.data;
};

// Subscriptions
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await apiClient.get<SubscriptionPlan[]>('/marketplace/subscriptions/plans');
  return response.data;
};

export const subscribe = async (planId: string): Promise<UserSubscription> => {
  const response = await apiClient.post<UserSubscription>('/marketplace/subscriptions/subscribe', {
    planId,
  });
  return response.data;
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  const response = await apiClient.get<UserSubscription | null>('/marketplace/subscriptions/me');
  return response.data;
};

export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  await apiClient.post(`/marketplace/subscriptions/${subscriptionId}/cancel`);
};

// Affiliates
export const generateAffiliateLink = async (promptId?: string): Promise<AffiliateLink> => {
  const response = await apiClient.post<AffiliateLink>('/marketplace/affiliates/generate', {
    promptId,
  });
  return response.data;
};

export const getAffiliateStats = async (): Promise<AffiliateStats> => {
  const response = await apiClient.get<AffiliateStats>('/marketplace/affiliates/stats');
  return response.data;
};

export const getAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  const response = await apiClient.get<AffiliateLink[]>('/marketplace/affiliates/links');
  return response.data;
};

// Featured
export const getFeaturedPrompts = async (): Promise<FeaturedPrompt[]> => {
  const response = await apiClient.get<FeaturedPrompt[]>('/marketplace/featured');
  return response.data;
};

