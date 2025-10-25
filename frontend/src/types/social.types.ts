import type { User } from './user.types.ts';
import type { Prompt } from './prompt.types.ts';

/**
 * Comment on a prompt
 */
export interface Comment {
  id: string;
  promptId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string; // For nested replies
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  userHasLiked: boolean;
}

/**
 * Request to create a comment
 */
export interface CreateCommentRequest {
  promptId: string;
  content: string;
  parentId?: string; // For replies
}

/**
 * User follow relationship
 */
export interface Follow {
  id: string;
  followerId: string;
  follower: User;
  followingId: string;
  following: User;
  createdAt: string;
}

/**
 * Activity feed item
 */
export interface Activity {
  id: string;
  userId: string;
  user: User;
  type: 'prompt_created' | 'prompt_liked' | 'comment_added' | 'follow' | 'prompt_purchased';
  targetType?: 'prompt' | 'comment' | 'user';
  targetId?: string;
  prompt?: Prompt;
  comment?: Comment;
  targetUser?: User;
  message: string;
  createdAt: string;
}

/**
 * Notification for user
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'reply' | 'purchase' | 'mention';
  message: string;
  relatedUserId?: string;
  relatedUser?: User;
  targetType?: 'prompt' | 'comment';
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * User profile with social stats
 */
export interface UserProfile {
  user: User;
  stats: {
    promptsCount: number;
    followersCount: number;
    followingCount: number;
    likesReceived: number;
    totalSales: number;
    totalEarnings: number;
  };
  isFollowing: boolean;
  recentPrompts: Prompt[];
  recentActivity: Activity[];
}

/**
 * Paginated comments response
 */
export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Paginated activity response
 */
export interface ActivityResponse {
  activities: Activity[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Notifications response
 */
export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

