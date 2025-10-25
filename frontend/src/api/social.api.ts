import { promptServiceClient, userServiceClient } from './client.ts';
import type { User } from '@/types/user.types.ts';
import type {
  Comment,
  CreateCommentRequest,
  CommentsResponse,
  Follow,
  ActivityResponse,
  NotificationsResponse,
  UserProfile,
} from '@/types/social.types.ts';

/**
 * Get comments for a prompt
 */
export const getComments = async (
  promptId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<Comment[]> => {
  const response = await promptServiceClient.get<Comment[]>(
    `/api/social/comments/${promptId}`
  );
  return response.data;
};

/**
 * Create a new comment
 */
export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  const response = await promptServiceClient.post<Comment>('/api/social/comments', data);
  return response.data;
};

/**
 * Like a prompt
 */
export const likePrompt = async (promptId: string): Promise<void> => {
  await promptServiceClient.post('/api/social/likes', { promptId });
};

/**
 * Unlike a prompt
 */
export const unlikePrompt = async (promptId: string): Promise<void> => {
  await promptServiceClient.delete(`/api/social/likes/${promptId}`);
};

/**
 * Check if user has liked a prompt
 */
export const checkUserLike = async (promptId: string): Promise<boolean> => {
  const response = await promptServiceClient.get<{ hasLiked: boolean }>(
    `/api/social/likes/${promptId}/check`
  );
  return response.data.hasLiked;
};

/**
 * Rate a prompt
 */
export const ratePrompt = async (promptId: string, rating: number, review?: string): Promise<void> => {
  await promptServiceClient.post('/api/social/ratings', {
    promptId,
    rating,
    review,
  });
};

/**
 * Get prompt rating
 */
export const getPromptRating = async (promptId: string): Promise<{ averageRating: number }> => {
  const response = await promptServiceClient.get<{ averageRating: number }>(
    `/api/social/ratings/${promptId}`
  );
  return response.data;
};

/**
 * Get prompt social stats (likes, ratings, comments)
 */
export const getPromptStats = async (promptId: string): Promise<{
  likesCount: number;
  averageRating: number;
  ratingsCount: number;
  commentsCount: number;
}> => {
  const response = await promptServiceClient.get(`/api/social/stats/${promptId}`);
  return response.data;
};

/**
 * Follow a user
 */
export const followUser = async (userId: string): Promise<Follow> => {
  const response = await apiClient.post<Follow>('/social/follow', { userId });
  return response.data;
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/social/follow/${userId}`);
};

/**
 * Get user's followers
 */
export const getFollowers = async (userId: string): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/social/users/${userId}/followers`);
  return response.data;
};

/**
 * Get user's following
 */
export const getFollowing = async (userId: string): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/social/users/${userId}/following`);
  return response.data;
};

/**
 * Get activity feed from followed users
 */
export const getActivityFeed = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ActivityResponse> => {
  const response = await apiClient.get<ActivityResponse>(
    `/social/feed?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};

/**
 * Get user's notifications
 */
export const getNotifications = async (): Promise<NotificationsResponse> => {
  const response = await apiClient.get<NotificationsResponse>('/social/notifications');
  return response.data;
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await apiClient.patch(`/social/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.patch('/social/notifications/read-all');
};

/**
 * Get user profile with social stats
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/social/users/${userId}/profile`);
  return response.data;
};

