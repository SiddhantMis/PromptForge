import type { User } from '@/types/user.types.ts';
import type {
  Comment,
  CreateCommentRequest,
  CommentsResponse,
  Follow,
  Activity,
  ActivityResponse,
  Notification,
  NotificationsResponse,
  UserProfile,
} from '@/types/social.types.ts';
import { mockPrompts } from './prompt.mock.ts';

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users
const mockUsers: User[] = [
  { id: '1', username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
  { id: '2', username: 'aiexpert', email: 'expert@example.com', firstName: 'AI', lastName: 'Expert' },
  { id: '3', username: 'promptmaster', email: 'master@example.com', firstName: 'Prompt', lastName: 'Master' },
  { id: '4', username: 'devguru', email: 'guru@example.com', firstName: 'Dev', lastName: 'Guru' },
  { id: '5', username: 'techwriter', email: 'tech@example.com', firstName: 'Tech', lastName: 'Writer' },
];

// Mock comments storage
let mockComments: Comment[] = [
  {
    id: 'c1',
    promptId: 'prompt-1',
    userId: '2',
    user: mockUsers[1],
    content: 'This is an excellent prompt! I\'ve been using it for my projects and the results are amazing.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 12,
    userHasLiked: false,
  },
  {
    id: 'c2',
    promptId: 'prompt-1',
    userId: '3',
    user: mockUsers[2],
    content: 'Great work! How long did it take you to refine this?',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 5,
    userHasLiked: true,
  },
  {
    id: 'c3',
    promptId: 'prompt-1',
    userId: '1',
    user: mockUsers[0],
    content: 'Thanks! It took about a week of testing with different models.',
    parentId: 'c2',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likesCount: 3,
    userHasLiked: false,
  },
];

// Mock follows storage
let mockFollows: Follow[] = [
  {
    id: 'f1',
    followerId: '1',
    follower: mockUsers[0],
    followingId: '2',
    following: mockUsers[1],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f2',
    followerId: '1',
    follower: mockUsers[0],
    followingId: '3',
    following: mockUsers[2],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock notifications storage
let mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'comment',
    message: 'AI Expert commented on your prompt "Advanced Code Generator"',
    relatedUserId: '2',
    relatedUser: mockUsers[1],
    targetType: 'prompt',
    targetId: 'prompt-1',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    userId: '1',
    type: 'follow',
    message: 'Prompt Master started following you',
    relatedUserId: '3',
    relatedUser: mockUsers[2],
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n3',
    userId: '1',
    type: 'like',
    message: 'Dev Guru liked your prompt',
    relatedUserId: '4',
    relatedUser: mockUsers[3],
    targetType: 'prompt',
    targetId: 'prompt-1',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock activities storage
const mockActivities: Activity[] = [
  {
    id: 'a1',
    userId: '2',
    user: mockUsers[1],
    type: 'prompt_created',
    targetType: 'prompt',
    targetId: 'prompt-2',
    prompt: mockPrompts[1],
    message: 'AI Expert created a new prompt',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2',
    userId: '3',
    user: mockUsers[2],
    type: 'prompt_liked',
    targetType: 'prompt',
    targetId: 'prompt-1',
    prompt: mockPrompts[0],
    message: 'Prompt Master liked a prompt',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3',
    userId: '2',
    user: mockUsers[1],
    type: 'comment_added',
    targetType: 'prompt',
    targetId: 'prompt-1',
    prompt: mockPrompts[0],
    message: 'AI Expert commented on a prompt',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Get comments for a prompt (mock)
 */
export const getComments = async (
  promptId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<CommentsResponse> => {
  await delay(400);

  const promptComments = mockComments.filter(c => c.promptId === promptId && !c.parentId);
  
  // Nest replies
  const commentsWithReplies = promptComments.map(comment => ({
    ...comment,
    replies: mockComments.filter(c => c.parentId === comment.id),
  }));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    comments: commentsWithReplies.slice(start, end),
    total: promptComments.length,
    page,
    pageSize,
  };
};

/**
 * Create a comment (mock)
 */
export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  await delay(500);

  const newComment: Comment = {
    id: `c${Date.now()}`,
    promptId: data.promptId,
    userId: '1',
    user: mockUsers[0],
    content: data.content,
    parentId: data.parentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 0,
    userHasLiked: false,
  };

  mockComments.unshift(newComment);
  return newComment;
};

/**
 * Update a comment (mock)
 */
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  await delay(400);

  const comment = mockComments.find(c => c.id === commentId);
  if (!comment) throw new Error('Comment not found');

  comment.content = content;
  comment.updatedAt = new Date().toISOString();

  return comment;
};

/**
 * Delete a comment (mock)
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await delay(400);
  mockComments = mockComments.filter(c => c.id !== commentId && c.parentId !== commentId);
};

/**
 * Toggle comment like (mock)
 */
export const toggleCommentLike = async (commentId: string): Promise<{ liked: boolean }> => {
  await delay(300);

  const comment = mockComments.find(c => c.id === commentId);
  if (!comment) throw new Error('Comment not found');

  comment.userHasLiked = !comment.userHasLiked;
  comment.likesCount += comment.userHasLiked ? 1 : -1;

  return { liked: comment.userHasLiked };
};

/**
 * Follow a user (mock)
 */
export const followUser = async (userId: string): Promise<Follow> => {
  await delay(400);

  const following = mockUsers.find(u => u.id === userId);
  if (!following) throw new Error('User not found');

  const newFollow: Follow = {
    id: `f${Date.now()}`,
    followerId: '1',
    follower: mockUsers[0],
    followingId: userId,
    following,
    createdAt: new Date().toISOString(),
  };

  mockFollows.push(newFollow);
  return newFollow;
};

/**
 * Unfollow a user (mock)
 */
export const unfollowUser = async (userId: string): Promise<void> => {
  await delay(400);
  mockFollows = mockFollows.filter(f => !(f.followerId === '1' && f.followingId === userId));
};

/**
 * Get followers (mock)
 */
export const getFollowers = async (userId: string): Promise<User[]> => {
  await delay(300);
  return mockFollows
    .filter(f => f.followingId === userId)
    .map(f => f.follower);
};

/**
 * Get following (mock)
 */
export const getFollowing = async (userId: string): Promise<User[]> => {
  await delay(300);
  return mockFollows
    .filter(f => f.followerId === userId)
    .map(f => f.following);
};

/**
 * Get activity feed (mock)
 */
export const getActivityFeed = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ActivityResponse> => {
  await delay(500);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    activities: mockActivities.slice(start, end),
    total: mockActivities.length,
    page,
    pageSize,
  };
};

/**
 * Get notifications (mock)
 */
export const getNotifications = async (): Promise<NotificationsResponse> => {
  await delay(400);

  return {
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.isRead).length,
  };
};

/**
 * Mark notification as read (mock)
 */
export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await delay(200);
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

/**
 * Mark all notifications as read (mock)
 */
export const markAllNotificationsRead = async (): Promise<void> => {
  await delay(300);
  mockNotifications.forEach(n => (n.isRead = true));
};

/**
 * Get user profile (mock)
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  await delay(500);

  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  const userPrompts = mockPrompts.filter(p => p.authorId === userId);
  const isFollowing = mockFollows.some(f => f.followerId === '1' && f.followingId === userId);

  return {
    user,
    stats: {
      promptsCount: userPrompts.length,
      followersCount: mockFollows.filter(f => f.followingId === userId).length,
      followingCount: mockFollows.filter(f => f.followerId === userId).length,
      likesReceived: userPrompts.reduce((sum, p) => sum + p.likesCount, 0),
      totalSales: Math.floor(Math.random() * 50),
      totalEarnings: Math.floor(Math.random() * 5000),
    },
    isFollowing,
    recentPrompts: userPrompts.slice(0, 6),
    recentActivity: mockActivities.filter(a => a.userId === userId).slice(0, 5),
  };
};

